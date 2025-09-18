const express=require("express");
const router=express.Router({mergeParams:true});

const Listing=require("../models/listing.js");
const Review=require("../models/review.js");
const ExpressError=require("../util/ExpressError.js");
const asyncWrap = require("../util/asyncWrap.js");
const {reviewSchema}= require("../schema.js");
const {isLoggedIn,isReviewAuthor}=require("../middlewares.js");
const reviewController=require("../controllers/review.js");

const validateReview=(req,res,next)=>{
    console.log(req.body);
    let {error} = reviewSchema.validate(req.body); //extracting error from result; error= result.error
    if(error){
        console.log(error);
        const msg = error.details.map(el => el.message).join(', ');
        console.log(msg);
        throw new ExpressError(400,msg);
    }
    else{
        next();
    }
    
}


//review adding route
router.post("/",isLoggedIn("add review"),validateReview,asyncWrap(reviewController.newReview));

//review delete route
router.delete("/:reviewId",isReviewAuthor,asyncWrap(reviewController.destroyReview));

module.exports=router;