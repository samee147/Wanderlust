const Listing=require("../models/listing.js");
const Review=require("../models/review.js");

module.exports.newReview=async(req,res)=>{
    let target=await Listing.findById(req.params.id);
    let newReview=new Review(req.body.review);

    newReview.author=req.user;

    target.reviews.push(newReview);

    await newReview.save();
    await target.save();

    console.log("new review saved");
    res.redirect(`/listings/${req.params.id}`);
};

module.exports.destroyReview=async(req,res)=>{
    let {id,reviewId}=req.params;

    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    console.log("review deleted");

    res.redirect(`/listings/${id}`);
};