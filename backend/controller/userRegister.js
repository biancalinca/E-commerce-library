const userModel = require('../models/userModel')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sendMail = require('../helpers/emailService'); // Import sendMail

/**
 * Controller pentru înregistrarea utilizatorului.
 * 
 * @param {import('express').Request} req - Obiectul de cerere Express.
 * @param {import('express').Response} res - Obiectul de răspuns Express.
 * @returns {Promise<void>} - O promisiune care nu returnează nimic.
 * 
 * @description
 * Această funcție preia detaliile utilizatorului din corpul cererii, validează aceste intrări,
 * verifică dacă utilizatorul există deja în baza de date, criptează parola utilizatorului și
 * salvează noul utilizator în baza de date.
 * 
 * @throws Aruncă erori personalizate pentru lipsa detaliilor utilizatorului, utilizator deja existent
 * sau eroare la criptarea parolei.
 */


async function userRegisterController(req, res){
    try{
        const { name, lastname, email, phone, address, password } = req.body

        // Verificarea dacă utilizatorul există deja în baza de date
        const user = await userModel.findOne({ email })

        console.log(user)

        if(user){
            throw new Error('Utilizator deja existent')
        }

/*
        // Validarea intrărilor
        if(!name){
            throw new Error('Introdu numele')
        }
        
        if(!lastname){
            throw new Error('Introdu prenumele')
        }

        if(!email){
            throw new Error('Introdu email-ul')
        }
        if(!password){
            throw new Error('Introdu parola')
        }

        if(!phone){
            throw new Error('Introdu numarul de telefon')
        }   

        if(!address){
            throw new Error('Introdu adresa')
        }*/

    // Validarea intrărilor
    if (!name) throw new Error('Introdu numele');
    if (!lastname) throw new Error('Introdu prenumele');
    if (!email) throw new Error('Introdu email-ul');
    if (!password) throw new Error('Introdu parola');
    if (!phone) throw new Error('Introdu numarul de telefon');
    if (!address) throw new Error('Introdu adresa');


    //criptarea parolei
    const salt = bcrypt.genSaltSync(10);
    const hashPassword = await bcrypt.hashSync(password, salt);   

    if(!hashPassword){
        throw new Error('Eroare la criptarea parolei');
    }

    //salvarea datelor in baza de date

    const payload = {
        ...req.body,
        role: 'GENERAL',
        password : hashPassword
    }

    const userData = new userModel(payload)
    const savedUser = await userData.save()

    // Create verification token
    const token = jwt.sign({ _id: savedUser._id }, process.env.TOKEN_SECRET_KEY, { expiresIn: '1h' });
    console.log("Generated Token:", token);

    // Send verification email
    // const verificationLink = `${process.env.FRONTEND_URL}/auth/verify-email?token=${token}`;
    const verificationLink = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;

    const emailSubject = 'Verifică-ți Email-ul';
    const emailBody = `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px; background-color: #fafafa;">
            <h2 style="color: #4CAF50; text-align: center;">Confirmă-ți adresa de email</h2>
            <p style="font-size: 16px; color: #000000;">Salut, ${name}</p>
            <p style="font-size: 16px; color: #000000;">Mulțumim că te-ai înregistrat la noi. Te rugăm să confirmi adresa ta de email făcând click pe link-ul de mai jos:</p>
            <div style="text-align: center; margin: 20px 0;">
                <a href="${verificationLink}" style="font-size: 1.2em; font-weight: bold; color: #FFFFFF; background-color: #4CAF50; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Activează contul</a>
            </div>
            <p style="font-size: 16px; color: #000000;">Link-ul de confirmare va expira într-o oră.</p>
            <p style="font-size: 16px; color: #000000;">Dacă nu ai solicitat acest email, te rugăm să îl ignori.</p>
            <p style="font-size: 16px; color: #000000;">Mulțumim,</p>
            <p style="font-weight: bold; font-size: 16px; color: #000000;">Echipa Bookish Boutique</p>
        </div>
    `;

    await sendMail(email, emailSubject, emailBody);


    // Trimiterea răspunsului de succes
    res.status(201).json({
        data: savedUser,
        success: true,
        error: false,
        message: "Utilizatorul a fost creat cu succes. Verifică email-ul pentru a-l confirma."
    })

    }catch(err){
        // Trimiterea răspunsului de eroare
        res.json({
            message:err.message || err  ,
            error: true,
            sucess: false
        }) 
    }
}

module.exports = userRegisterController