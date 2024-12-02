const mongoose = require('mongoose') //importa biblioteca mongoose

// definirea modelului
const userSchema =new mongoose.Schema({  
    name: String,
    lastname: String,
    email: {
        type: String,
        unique: true, //previne erorile de duplicate
        required: true //camp obligatoriu
    },
    phone: String,
    address: String,
    password: String,
    profilePic: String,
    role : String,
    otp: String,
    otpExpires: Date,
    emailVerified: {
        type: Boolean,
        default: false
    }
},{
    timestamps: true //adauga automat createdAt, updatedAt
})

// creearea modelului pe baza schemei definite anterior
//user - numele colectiei, userSchema - schema utilizata
const userModel = mongoose.model('user', userSchema) //se pluralizeaza automat numele modelului in mongodb cloud

module.exports = userModel