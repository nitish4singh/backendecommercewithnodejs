const bodyParser = require('body-parser');
const express = require('express');
const dbConnect = require('./config/dbConnect');
const{notFound,errorHandler} =require("./middlewares/errorHandling")
const app =express();
const dotenv =require('dotenv').config();
const PORT = process.env.PORT || 4000;
const authRouter =require('./routes/authRoute');
const productRouter =require('./routes/productRoute');
const productcategoryRouter =require('./routes/productcategoryroute');
const brandRouter =require('./routes/brandRoute');
const colorRouter =require('./routes/colorRoute');
const uploadRouter = require("./routes/uploadRoute");
const enqRouter = require("./routes/enqRouter");
const couponRouter = require('./routes/couponRoute');
const blogRouter =require('./routes/blogRoutes');
const blogcategoryRouter = require("./routes/blogCategoryRoute");

const cookiesParser =require('cookie-parser');
const morgan =require('morgan');
const cors =require("cors");
dbConnect();

app.use(morgan("dev"));
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use(cookiesParser());
app.use("/api/user", authRouter);
app.use("/api/product", productRouter);
app.use("/api/productCategory", productcategoryRouter);
app.use("/api/blog",blogRouter);
app.use("/api/blogcategory", blogcategoryRouter);
app.use("/api/brand", brandRouter);
app.use("/api/coupon", couponRouter);
app.use("/api/color", colorRouter);
app.use("/api/enquiry", enqRouter);
app.use("/api/upload", uploadRouter);




app.use(notFound);
app.use(errorHandler);

 app.listen(PORT, ()=>{
    console.log(`server is running ${PORT}`);
 });
