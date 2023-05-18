const mongoose = require('mongoose'); // Erase if already required
const bcrypt =require('bcrypt');
// Declare the Schema of the Mongo model
var userSchema = new mongoose.Schema({
    firstname:{
        type:String,
        required:true,
        index:true,
    },
   lastname:{
        type:String,
        required:true,
        index:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    mobile:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
    },
    role:{
        type:String,
        default: "user",
    }
});

//function t bcrypt the password with salting 
userSchema.pre('save',async function(next){
    const salt =await bcrypt.genSaltSync(10);
   this.password = await bcrypt.hash(this.password,salt);

});
//to match the login password 

userSchema.methods.isPasswordMatched =async function(enteredPassword){
    return await bcrypt.compare(enteredPassword,this.password);
};

//Export the model
module.exports = mongoose.model('User', userSchema);