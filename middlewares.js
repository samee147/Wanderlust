const Listing=require("./models/listing.js");
const Review=require("./models/review.js");


const isLoggedIn = (todo) => {
    // This is the actual middleware function that Express will use
    return (req, res, next) => {
        if (!req.isAuthenticated()) {
            req.session.redirectUrl=req.originalUrl;
            req.flash("error", `You must log in to ${todo}.`);
            return res.redirect("/user/login");
        }
        next();
    };
};

const saveRedirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};

const isOwner=async(req,res,next)=>{
    let {id}=req.params;
    let listing=await Listing.findById(id);
    if(!listing.owner.equals(res.locals.currUser._id)){
        req.flash("error","only owner can edit their listing");
        return res.redirect(`/listings/${id}`);
    }
    next();
}

const isReviewAuthor=async(req,res,next)=>{
    let {id,reviewId}=req.params;
    let review=await Review.findById(reviewId);
    if(!review.author.equals(res.locals.currUser._id)){
        req.flash("error","only author can delete their review");
        return res.redirect(`/listings/${id}`);
    }
    next();
}


module.exports = {isLoggedIn,saveRedirectUrl,isOwner,isReviewAuthor};