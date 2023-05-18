const { generateToken } = require("../config/jwtToken");
const  User = require("../models/userModel")
const asyncHandler =require("express-async-handler");

// register the user constroller

const createUser =asyncHandler(
    async(req,res)=>{
        const email =req.body.email;
        const findUser =await User.findOne({email:email});
       if(!findUser){
       //create a new user 
       const newUser = await User.create(req.body);
       res.json(newUser);
       
       }else{
           throw new Error("user alrady exit");
       
       }
       }
);
// login controller

const loginUserCtrl =asyncHandler(async (req,res)=>{
const {email,password}=req.body;
console.log(email,password);

// check the user is exit or not
const findUser =await User.findOne({email});
if(findUser && await findUser.isPasswordMatched(password)){
res.json({
_id: findUser?._id,
firstname: findUser?.firstname,
lastname: findUser?.lastname,
email: findUser?.email,
mobile: findUser?.mobile,
token: generateToken(findUser?._id),
});
}else{
    throw new Error('Invalid Credentials');
}

});

//Get all user 
const getallUser =asyncHandler(async(req,res)=>{
   try{
    const getUsers =await User.find();
    res.json(getUsers);
   }catch(error){
throw new Error (error);
   }
})
// get a single user 
const getsingleUser =asyncHandler(async(req,res)=>{
    const{id} =req.params;
    try{
     const getsingleUser =await User.findById(id);
     res.json(getsingleUser);
    }catch(error){
 throw new Error (error);
    }
 });

 // delete a user 
const deleteaUser =asyncHandler(async(req,res)=>{
    const{id} =req.params;
    try{
     const deleteaUser =await User.findByIdAndDelete(id);
     res.json(deleteaUser);
    }catch(error){
 throw new Error (error);
    }
 });
//update a user 

const updateauser =asyncHandler(async(req,res)=>{
    const{id} =req.params;
    try{
     const updateauser =await User.findByIdAndUpdate(id,{
        firstname:req?.body?.firstname,
        lastname:req?.body?.lastname,
        email:req?.body?.email,
        mobile:req?.body?.mobile
     },
     {
        new:true,
     }
     );
     res.json(updateauser);
    }catch(error){
 throw new Error (error);
    }
 });






module.exports ={createUser,loginUserCtrl, getallUser,getsingleUser,deleteaUser,updateauser};