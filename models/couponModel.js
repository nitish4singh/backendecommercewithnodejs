const mongoose = require("mongoose");
var couponSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        unique:true,
        uppercase:true,
    },
    expiry:{
        type:Date,
        require:true,
    },
    discount:{
        type:Number,
        require:true,
    }
});
module.exports =mongoose.model("Coupon",couponSchema);