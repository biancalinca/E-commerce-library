const mongoose = require('mongoose')

async function connectDB() {
    try{
        await mongoose.connect(process.env.MONGODB_URI)
        console.log("Connected to MongoDB")
    }catch(err){
        console.log("Eroare la conectarea la baza de date in db.js: \n", err)
    }
}

module.exports = connectDB