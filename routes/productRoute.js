const express =require("express");
const { createProduct, getaProduct, getAllProduct, updateProduct, deleteProduct, addToWishlist, rating, uploadImages, } = require("../controller/productController");
const {isAdmin,authMiddleware} = require("../middlewares/authMiddleware");
const { productImgResize, uploadPhoto } = require("../middlewares/uploadImage");
const router =express.Router();

router.post("/" ,authMiddleware,isAdmin,createProduct);
//router.put("/upload",authMiddleware,isAdmin, uploadPhoto.array("images",10), uploadImages)
router.put('/wishlist',authMiddleware,addToWishlist);
router.put('/rating',authMiddleware,rating);
router.put("/:id" ,authMiddleware,getaProduct);
router.put("/:id" ,authMiddleware,isAdmin,updateProduct);
router.delete("/:id",authMiddleware,isAdmin ,deleteProduct);
router.get("/" , getAllProduct);


module.exports = router;