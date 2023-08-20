const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

async function ConnectDb(){
    try{
        await mongoose.connect(process.env.DB_CONNECTION, {useNewUrlParser: true, useUnifiedTopology: true});
        console.log("Connected to DB")
    }catch(err){
        console.log(err);
    }
}

module.exports = ConnectDb;