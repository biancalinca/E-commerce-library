const userModel = require('../models/userModel')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { resetLoginAttempts } = require('../middleware/rateLimit');

async function userLoginController(req, res){
    try{
        const { email, password } = req.body

        if(!email){
            throw new Error('Introdu email-ul')
        }
        if(!password){
            throw new Error('Introdu parola')
        }
        //verific dupa mail daca exista user-ul
        const user = await userModel.findOne({ email }) 

        //daca utilizatorul nu exista, va arunca eroarea
        if(!user){
            throw new Error('Utilizator inexistent')
        }

        // Check if email is verified
        if (!user.emailVerified) {
            throw new Error('Email-ul nu este verificat. Verifică email-ul pentru a continua.');
        }

        //daca utilizatorul exista, vreau sa verific parola daca e corecta
        //primul parametru password- vine de la user
        //al doilea parametru vine din baza de date
        const checkPassword = await bcrypt.compare(password, user.password)
        console.log("checkPassword", checkPassword)

        //daca parola corespunde atunci ne putem autentifica cu succes
        if(checkPassword){
            const tokenData = {
                _id : user._id,
                email: user.email
            }

           const token = await jwt.sign(tokenData, process.env.TOKEN_SECRET_KEY, { 
            algorithm: 'HS512', // Specifică algoritmul SHA-512 de hash al token-ului
            expiresIn: '24h' 
        });
            
           //vreau sa trimit toke-ul la user:
           const tokenOption = {
               httpOnly: true,
               secure: true,
              // sameSite: 'none'
           }
           res.cookie("token", token, tokenOption).json({
               message: 'Autentificare reusita',
               data: token,
               success: true,
               error: false
           })
           // Resetează încercările după autentificare reușită
           resetLoginAttempts(req.ip);
        }else{
            throw new Error('Parola gresita')
        }

    }catch(err){
        res.json({
            message:err.message || err  ,
            error: true,
            sucess: false
        }) 
    }
}

module.exports = userLoginController