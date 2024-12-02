const stripe = require('../../config/stripe');
const addToCartModel = require('../../models/cartProduct');
const orderModel = require('../../models/orderModel');
const productModel = require('../../models/productModel');
const sendMail = require('../../helpers/emailService');

// This is your Stripe CLI webhook secret for testing your endpoint locally.
const endpointSecret = process.env.STRIPE_ENDPOINT_WEBHOOK_SECRET_KEY;


async function getLineItems(lineItems){
    let ProductItems = []
    let totalQuantity = 0

    if(lineItems?.data?.length){
        for(const item of lineItems.data){
            const product = await stripe.products.retrieve(item.price.product)
            const productId = product.metadata.productId

            const productData = {
                productId : productId,
                name : product.name,
                price : item.price.unit_amount / 100,
                quantity : item.quantity,
                image : product.images[0]
            }
            ProductItems.push(productData)
            totalQuantity += item.quantity; 
        }
    }else{
        console.log("No items found")
    }
    return {ProductItems, totalQuantity}
}
const webhooks = async(request, response) => {
    const sig = request.headers['stripe-signature'];

    const payloadString = JSON.stringify(request.body);

    const header = stripe.webhooks.generateTestHeaderString({
        payload: payloadString,
        secret: endpointSecret
    });

    let event;

    try {
        event = stripe.webhooks.constructEvent(payloadString, header, endpointSecret);
    } catch (err) {
        response.status(400).send(`Webhook Error: ${err.message}`);
        return;
    }

      // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
        const session = event.data.object;

        const lineItems = await stripe.checkout.sessions.listLineItems(session.id);

        const {ProductItems, totalQuantity} = await getLineItems(lineItems)

        if (!ProductItems || ProductItems.length === 0) {
            console.error("No product details found.");
        } else {
            console.log("Product details retrieved:", ProductItems);

            //formatarea detaliilor
            const orderDetails = {
            productDetails : ProductItems,
            email : session.customer_email,
            userId : session.metadata.userId,
            paymentDetails :{
                paymentId : session.payment_intent,
                payment_method_type : session.payment_method_types,
                payment_status : session.payment_status,
                },
            totalAmount : session.amount_total / 100,
            totalQuantity: totalQuantity // Stocăm cantitatea totală de produse
            }
            console.log("Order details to be saved:", orderDetails);

            const order = new orderModel(orderDetails)
            const saveOrder = await order.save()
            
            if(saveOrder?._id){

                // Reduce stock for each product
                for (const item of ProductItems) {
                    await productModel.findByIdAndUpdate(
                        item.productId, 
                        { $inc: { stock: -item.quantity } }, 
                        { new: true }
                    );
                }
                // Ștergem produsele din coș după plasarea comenzii
                const deleteCartItems = await addToCartModel.deleteMany({userId : session.metadata.userId})

                // Trimiterea e-mailului de confirmare
                const htmlContent = `
                <div style="font-family: Arial, sans-serif; color: #333;">
                    <h1 style="background-color: #4CAF50; color: white; padding: 10px 0; text-align: center; border-radius: 8px;">Confirmare comandă</h1>
                    <p style="font-size: 16px; text-align: center; color: #000;">Îți mulțumim pentru achiziția ta de la <strong>Bookish Boutique!</strong></p>
                    
                    <div style="margin: 20px auto; padding: 15px; border: 1px solid #ddd; border-radius: 8px; max-width: 600px;">
                        <h2 style="color: #4CAF50; font-size: 20px; border-bottom: 2px solid #4CAF50; padding-bottom: 10px;">Detalii comandă:</h2>
                        <ul style="list-style-type: none; padding: 0; font-size: 16px;">
                            ${ProductItems.map(item => `
                                <li style="padding: 10px 0; border-bottom: 1px solid #ddd;">
                                    <strong>${item.name}</strong> 
                                    <span style="color: #555;">- Cantitate: ${item.quantity}, Preț: ${item.price.toFixed(2)} Lei</span>
                                </li>
                            `).join('')}
                        </ul>
                        <p style="font-size: 18px; font-weight: bold; color: #333; margin-top: 20px;">
                            <span style="color: #4CAF50;">Total:</span> ${orderDetails.totalAmount.toFixed(2)} Lei
                        </p>
                    </div>
                    
                    <p style="font-size: 16px; text-align: center; color: #555;">Comanda ta va fi livrată în curând.</p>
                    
                    <footer style="margin-top: 30px; text-align: center; font-size: 14px; color: #777;">
                        <p style="margin: 0;">Echipa <strong>Bookish Boutique</strong></p>
                        <p style="margin: 0;">Dacă ai întrebări, te rugăm să ne contactezi la <a href="mailto:support@bookishboutique.com" style="color: #4CAF50; text-decoration: none;">support@bookishboutique.com</a></p>
                    </footer>
                </div>
            `;

            await sendMail(session.customer_email, 'Confirmare comandă', htmlContent);
            console.log("E-mailul de confirmare a fost trimis.");
            }
        }
        break;
        default:
        console.log(`Unhandled event type ${event.type}`);
  }

    response.status(200).send()

}

module.exports = webhooks