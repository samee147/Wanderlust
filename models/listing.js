const mongoose =require("mongoose");
const {Schema}=mongoose;
const Review=require("./review.js");

const listingSchema =Schema({
    title:{
        type:String,
        required:true                                       //this is not needed as we have used listing validation also by using Joi, but kept incase Joi fails
    },
    description:String,
    image:{
        url:String,
        filename:String
    },
    price:{
        type:Number,
        required:true
    },
    location:{
        type:String,
        required:true
    },
    country:{
        type:String,
        required:true
    },
    reviews:[{
        type:Schema.Types.ObjectId,
        ref:"Review"
    }],
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User"
    }
});

//middleware for deleting reviews
listingSchema.post("findOneAndDelete",async(listing)=>{
    if(listing){
        await Review.deleteMany({_id:{$in:listing.reviews}});
    }
});

const Listing=mongoose.model("Listing",listingSchema);

module.exports=Listing;