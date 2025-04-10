const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const dotenv = require('dotenv')
const colors = require('colors')
const connectDb = require('./config/connectDb')
const path = require('path')

//config dotenv file
dotenv.config();

//database call
connectDb();

// rest object
const app = express();

//middleware
app.use(morgan("dev"));
app.use(express.json());
app.use(cors());

//routes
//1. user routes
app.use('/users', require('./routes/userRoute'))

//2. transactions routes
app.use('/transactions', require("./routes/transactionRoute"))

//static files
app.use(express.static(path.join(__dirname, './client/build')))

app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "./client/build/index.html"))
})

//port
const PORT = 8080 || process.env.PORT;

//listen server 
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})