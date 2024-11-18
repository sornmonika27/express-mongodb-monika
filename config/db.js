const mogoose = require('mongoose');
require('dotenv').config();

const mongoURI = process.env.MONGO_URI;

const connectDB = async () => {
    try{
        await mogoose.connect(mongoURI);
    }catch (error) {
        console.error('Error connecting to MongoDB:' ,error);
    }
};

module.exports = connectDB;