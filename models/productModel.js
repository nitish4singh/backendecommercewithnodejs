const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model

var productSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
        trim:true,
           },
    slug:{
        type:String,
        required:true,
        unique:true,
        lowecase:true,
    },
    description:{
        type:String,
        required:true,
    },
    price:{
        type:Number,
        required:true,
    },
    brand:{
        type:String,
        require:true,
       // enum:[""]
    },
    sold:{
        type:Number,
        defualt: 0,
    },
    category:{
        type:mongoose.Schema.Types.ObjectId,
       ref:"Category",
    },
    quantity: Number,
image:{
    type:Array,
},
Color:{
    type:String,
    enum:['Black' ,"Brown","Red"]
},
ratings:[{
star:Number,
postedby:{type:mongoose.Schema.Types.ObjectId,ref:"user"}
}],

},
{timestamps:true});

//Export the model
module.exports = mongoose.model('Product', productSchema);