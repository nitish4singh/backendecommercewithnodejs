// give the massg for not found

const notFound =(req,res,next) =>{
    const error =new Error(`Not Found :${req.orginalUrl}`);
    res.status(404);
    next(error);
};

// error handeler for api

const errorHandler =(err,req,res,next)=>{
    const statusCode=res.statusCode==200?500:res.statusCode;
    res.status(statusCode);
    res.json({
        message:err?.message,
        stack:err?.stack,
    });
}

module.exports = {errorHandler,notFound};
