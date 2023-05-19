const Product = require("../models/productModel");
const asyncHandler =require("express-async-handler");

// creating a product
const createProduct =asyncHandler(async(req,res)=>{
try{
const newProduct =await Product.create(req.body);
res.json(newProduct);
}catch(error){

    throw new Error(error);
}

});




//fetching of product

const getaProduct =asyncHandler(async(req,res) => {
    const { id } = req.params;
try{
const findProduct = await Product.findById(id);
res.json(findProduct);

}catch(error){
throw new Error(error);
}
})
//fetching all the product

const getAllProduct =asyncHandler(async(req,res) => {
   // const { id } = req.params;
try{
const getallProduct  = await Product.find();
res.json(getallProduct);

}catch(error){
throw new Error(error);
}
})


module.exports = {createProduct,getaProduct,getAllProduct};