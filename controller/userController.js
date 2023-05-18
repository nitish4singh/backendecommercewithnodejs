const  User =require("../models/userModel")



const createUser =async(req,res)=>{
 const email =req.body.email;
 const findUser =await User.findOne({email:email});
if(!findUser){
//create a new user 
const newUser = await User.create(req.body);
res.json(newUser);

}else{
    res.json({
        msg:"user already Exits",
        success:false
    });

}
};
module.exports ={createUser};