const userModel = require('../../models/userModel')

async function updateUser(req,res){
    try{

        //user-ul actual logat luat din bd
        const sessionUser = req.userId

        const {userId, email, name, lastname, role} = req.body

        const payload ={
            ...(email && {email : email}),
            ...(name && {name : name}),
            ...(lastname && {lastname : lastname}),
            ...(role && {role : role}),
        }

        const user = await userModel.findById(sessionUser)

        console.log("user role", user.role)

        //updatez user id si dupa toate field-urile pe care vreau sa le editez (payload)
        const updateUser = await userModel.findByIdAndUpdate(userId, payload)

        res.json({
            message : "User updated",
            data : updateUser,
            error : false,
            success : true
        })

    }catch(err){
        res.status(400).json({
            message:err.message || err  ,
            error: true,
            sucess: false
        }) 
    }
}

module.exports = updateUser