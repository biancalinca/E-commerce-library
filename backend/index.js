const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors')
require('dotenv').config()
const connectDB = require('./config/db')
const router = require('./routes')
const authRoutes = require('./routes/authRoutes');
const  cookieParser = require('cookie-parser')

const app = express()

// Setează limite mai mari pentru body-parser
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(cors(
    {
        origin: process.env.FRONTEND_URL,
        credentials: true
    }
))
app.use(express.json())
app.use(cookieParser())
app.use("/api", router)

//ruta pentru verificare otp si email
app.use('/auth', authRoutes);

const PORT = 8000 || process.env.PORT

//call-ul functiei
connectDB().then(()=>{
    app.listen(PORT, () => {
        console.log("conectat la baza de date")
        console.log(`Server running on port ${PORT}`)})
}) 
