
const  User = require("../models/userModel");



const { generateToken } = require("../config/jwtToken");
const asyncHandler =require("express-async-handler");
const  validateMongoDbId = require("../utils/validateMogodbId");
const { generateRefreshToken } = require("../config/refreshToken");
const crypto = require("crypto");
const jwt= require("jsonwebtoken");
const sendEmail = require("./emailController");



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
    const refreshToken = await generateRefreshToken(findUser?._id);
    const  updateuser =await User.findByIdAndUpdate(findUser.id,{
        refreshToken:refreshToken
    },
    {new:true}
    );
res.cookie('refreshToken',refreshToken,{
    httpOnly:true,
    maxAge:72*60*60*1000,
})
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
}});
//handle a refresh token
const handleRefreshToken = asyncHandler(async(req,res)=>{
const cookie = req.cookies;
console.log(cookie);
if(!cookie?.refreshToken) throw new Error("No refresh Token in cookies");
const refreshToken = cookie.refreshToken;
console.log(refreshToken);
const user =await User.findOne({refreshToken});
if(!user)throw new Error('no refresh to token present in db or not matched');
 jwt.verify( refreshToken, process.env.JWT_SECRET, (err, decoded )=> {
    if ( err || user.id !== decoded.id){
        throw  new Error("there is something wrong with refresh token");
    }
    const accessToken = generateToken(user?._id);
    res.json({ accessToken });
 });
res.json(user);
});

//  logout function 

const logout = asyncHandler(async (req, res) => {
    const cookie = req.cookies;
    if (!cookie?.refreshToken) throw new Error("No Refresh Token in Cookies");
    const refreshToken = cookie.refreshToken;
    const user = await User.findOne({ refreshToken });
    if (!user) {
      res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: true,
      });
      return res.sendStatus(204); // forbidden
      console.log("dddd")
    }
    await User.findByIdAndUpdate(refreshToken, {
      refreshToken: "",
    });
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
    });
    res.sendStatus(204); // forbidden
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
    validateMongoDbId(id);
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
    validateMongoDbId(id);

    try{
     const deleteaUser =await User.findByIdAndDelete(id);
     res.json(deleteaUser);
    }catch(error){
 throw new Error (error);
    }
 });
//update a user 
const updateauser =asyncHandler(async(req,res)=>{
    const{ _id} =req.user;
  // validateMongoDbId(_id);
    try{
     const updateauser =await User.findByIdAndUpdate(_id,{
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

// Blocking the user 
const blockUser = asyncHandler(async(req,res)=>{
const {id} =req.params;
//validateMongoDbId(id);
try{
    const blockuser  = await User.findByIdAndUpdate(
        id,{
            isBlocked:true
        },{
            new:true,
        }
    );
    res.json({blockuser});
    res.json({message:"User blocked"})
}catch(error){
throw new Error(error);
}
}
);

//unblocking the user 

const unblockUser = asyncHandler(async(req,res)=>{
    const {id} =req.params;
    //validateMongoDbId(id);

    try{
        const unblock = await User.findByIdAndUpdate(
            id,{
                isBlocked:false
            },{
                new:true,
            }
        );
        res.json({unblock});
        res.json({message:"User Unblocked"})
    }catch(error){
    throw new Error(error);
    }
}
);
  
const updatePassword = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    const { password } = req.body;
   // validateMongoDbId(_id);
    const user = await User.findById(_id);
    if (password) {
      user.password = password;
      const updatedPassword = await user.save();
      res.json(updatedPassword);
    } else {
      res.json(user);
    }
  });

  const forgotPasswordToken = asyncHandler(async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) throw new Error("User not found with this email");
    try {
      const token = await user.createPasswordResetToken();
      await user.save();
      const resetURL = `Hi, Please follow this link to reset Your Password. This link is valid till 10 minutes from now. <a href='http://localhost:5000/api/user/reset-password/${token}'>Click Here</>`;
      const data = {
        to: email,
        text: "Hey User",
        subject: "Forgot Password Link",
        htm: resetURL,
      };
      sendEmail(data);
      res.json(token);
    } catch (error) {
      throw new Error(error);
    }
  });

  const resetPassword = asyncHandler(async (req, res) => {
    const { password } = req.body;
    const { token } = req.params;
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    });
    if (!user) throw new Error(" Token Expired, Please try again later");
    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();
    res.json(user);
  });
  
module.exports ={
    createUser,
    loginUserCtrl,
     getallUser,
     getsingleUser,
     deleteaUser,
     updateauser,
     unblockUser,
     blockUser,
     handleRefreshToken,
     logout,updatePassword ,
     forgotPasswordToken,
     resetPassword};