const Product = require("../models/productModel");
const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");
const slugify = require("slugify");
//const validateMongoDbId = require("../utils/validateMongodbId");


const createProduct = asyncHandler(async (req, res) => {
  try {
    if (req.body.title) {
      req.body.slug = slugify(req.body.title);
    }
    const newProduct = await Product.create(req.body);
    res.json(newProduct);
  } catch (error) {
    throw new Error(error);
  }
});

//Update a product


// const updateProduct = asyncHandler(async (req, res) => {
//   const id = req.params;
//   //validateMongoDbId(id);
//   try {
//     if (req.body.title) {
//       req.body.slug = slugify(req.body.title);
//     }
//     const updateProduct = await Product.findOneAndUpdate({ id }, req.body, {
//       new: true,
//     });
//     res.json(updateProduct);
//   } catch (error) {
//     throw new Error(error);
//   }
// });

const updateProduct = asyncHandler(async (req, res) => {
    const product =await Product.findById(req.params.id);
    if(!product){
        res.status(404);
        throw new Error ("product not found")
    }
    if (req.body.title) {
      req.body.slug = slugify(req.body.title);
    }
const updatedproduct =await Product.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new:true}
);

    res.status(200).json(updatedproduct);
});


const deleteProduct =asyncHandler( async (req, res) => {
    const product =await Product.findById(req.params.id);
    if(!product){
        res.status(404);
        throw new Error ("product not found")
    }
    await Product.deleteOne({_id:req.params.id});

    res.status(200).json(product);
});

// to get a single product

const getaProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const findProduct = await Product.findById(id);
    res.json(findProduct);
  } catch (error) {
    throw new Error(error);
  }
});



// to get all the produuct from the database using filtlering  rough way 

// const getAllProduct = asyncHandler(async (req, res) => {
//   //const { id } = req.params;
//   console.log(req.query);
//   try {
//     const getallProduct = await Product.find(req.query);
//     res.json(getallProduct);
//   } catch (error) {
//     throw new Error(error);
//   }
// });





const getAllProduct = asyncHandler(async (req, res) => {
  try {
    // Filtering
    const queryObj = { ...req.query };
    const excludeFields = ["page", "sort", "limit", "fields"];
    excludeFields.forEach((el) => delete queryObj[el]);
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    let query = Product.find(JSON.parse(queryStr));

    // Sorting
    if (req.query.sort) {
      const sortBy = req.query.sort.split(",").join(" ");
      query = query.sort(sortBy);
    } else {
      query = query.sort("-createdAt");
    }


    // limiting the fields
    if (req.query.fields) {
      const fields = req.query.fields.split(",").join(" ");
      query = query.select(fields);
    } else {
      query = query.select("-__v");
    }

    // pagination

    const page = req.query.page;
    const limit = req.query.limit;
    const skip = (page - 1) * limit;
    query = query.skip(skip).limit(limit);
    if (req.query.page) {
      const productCount = await Product.countDocuments();
      if (skip >= productCount) throw new Error("This Page does not exists");
    }
    const product = await query;
    res.json(product);
  } catch (error) {
    throw new Error(error);
  }
});

// adding the funciton of wishlist
const addToWishlist =asyncHandler(async(req,res)=>{
  const{ _id }= req.user;
  const{ prodId } = req.body;
  try{
const user = await User.findById(_id);
const alreadyadded = user.wishlist.find((id) => id.toString()=== prodId) ;
if(alreadyadded){
  let user =await User.findByIdAndUpdate(_id,
    {
    $pull:{wishlist:prodId}
  
  },{new:true});
  res.json(user);
}else{
  let user =await User.findByIdAndUpdate(_id,
    {
    $push:{wishlist:prodId}
  
  },{new:true});
  res.json(user);
}

  }catch(error){
    throw new Error(error);
  }
})




module.exports = {
  createProduct,
  getaProduct,
  getAllProduct,
  updateProduct,
  deleteProduct,
  addToWishlist
};