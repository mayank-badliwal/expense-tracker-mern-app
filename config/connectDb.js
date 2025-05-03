const mongoose = require('mongoose')
const colors = require('colors')

const connectDb = async () => {
    try {
        mongoose.set('strictQuery', true);
        await mongoose.connect(process.env.MONGO_URL)
        console.log(`Server running on ${mongoose.connection.host}`.bgCyan.white);
    } catch(error) {
        console.log(`${error}`.bgRed)
    }
}

module.exports = connectDb;

//  FROM CHATGPT

// const mongoose = require('mongoose');
// const colors = require('colors');

// const connectDb = async () => {
//   try {
//     const conn = await mongoose.connect(process.env.MONGO_URI, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//       serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds
//       connectTimeoutMS: 10000,       // Timeout after 10 seconds
//     });
//     console.log(`✅ MongoDB Connected: ${conn.connection.host}`.bgCyan.white);
//   } catch (error) {
//     console.error(`❌ MongoDB Connection Error: ${error.message}`.bgRed.white);
//     process.exit(1); // Exit on failure
//   }
// };

// // Handle disconnection errors
// mongoose.connection.on('disconnected', () => {
//   console.error('❌ MongoDB disconnected!'.bgRed.white);
// });

// // Handle reconnection attempts
// mongoose.connection.on('connected', () => {
//   console.log('✅ MongoDB reconnected!'.bgGreen.white);
// });

// module.exports = connectDb;


