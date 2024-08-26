const mongoose = require('mongoose');

require("dotenv").config();

exports.connect = () =>{
    mongoose.connect(process.env.MONGODB_URL).then(() => 
        {console.log("DB connection established")})
    .catch((err) => {
        console.log("Error connecting");
        console.error(err);
        process.exit(1); // Exit the application with an error
    } )
}