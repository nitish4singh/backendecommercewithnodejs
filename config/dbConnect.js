const { default: mongoose } = require("mongoose");

const dbConnect = () => {
    try{
    const  conn =mongoose.connect(process.env.MONGODB_URL);
console.log("database connected");
    }
    catch(error){
        throw new Error(error);
        console.log("databaseError");
    }
};
module.exports =dbConnect;