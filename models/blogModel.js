const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var blogSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
        unique:true,
        index:true,
    },
    description:{
        type:String,
        required:true,
            },
    category:{
        type:String,
        required:true,
       
    },
    numViews:{
        type:Number,
        default:0,
    },
    isLiked: {
        type: Boolean,
        default: false,
      },
      isDisliked: {
        type: Boolean,
        default: false,
      },
      likes: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      ],
      dislikes: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      ],
    image:{
        type:String,
        default:"https://www.google.com/imgres?imgurl=https%3A%2F%2Fwww.webnode.com%2Fblog%2Fwp-content%2Fuploads%2F2019%2F04%2Fblog2.png&tbnid=y3EBe47DosTnDM&vet=12ahUKEwjCpN74gYf_AhW0ynMBHQuPBk0QMygjegUIARCzAg..i&imgrefurl=https%3A%2F%2Fwww.webnode.com%2Fblog%2Fhow-to-become-a-successful-blogger%2F&docid=6IhkdAAOmKAVUM&w=700&h=441&q=blog&ved=2ahUKEwjCpN74gYf_AhW0ynMBHQuPBk0QMygjegUIARCzAg"
    },
    author:{
        type:String,
        default:"Admin"
    }
},{
toJSON: {
    virtuals:true
},
toObject:{
virtuals:true

},
timestamps:true
}
);

//Export the model
module.exports = mongoose.model("Blog", blogSchema);