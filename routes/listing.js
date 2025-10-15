// if(process.env.NODE_ENV!="production"){
    require("dotenv").config();
// }

const express=require("express");
const router=express.Router({mergeParams:true});

const Listing=require("../models/listing.js");
const ExpressError=require("../util/ExpressError.js");
const asyncWrap = require("../util/asyncWrap.js");
const {listingSchema}= require("../schema.js");
const {isLoggedIn,isOwner}=require("../middlewares.js");
const listingController=require("../controllers/listing.js");
const multer  = require('multer');
const {storage}=require("../cloudConfig.js");
const upload = multer({ storage });

const validateListing=(req,res,next)=>{
    console.log(listingSchema);
    console.log(req.body);
    let {error} = listingSchema.validate(req.body); //extracting error from result; error= result.error
    if(error){
        console.log(error);
        const msg = error.details.map((el)=> el.message).join(', ');
        console.log(msg);
        throw new ExpressError(400,msg);
    }
    else{
        next();
    }
    
}

const delRevFromListing= async()=>{
    let listing= await Listing.findById('685d35ba71bd4dd73c4172bf');

    for(let i=1;i<=listing.reviews.length;i++){
        let del=listing.reviews.pop();
        console.log(`deleted=>${del}`);
    }
    
    await listing.save();
}


router.get("/",asyncWrap(listingController.index));

router.get("/new",isLoggedIn("add new listing"),listingController.renderNewForm);

// app.get("/listings/new",(req,res)=>{
//     let newListing= new Listing({
//         title:"uu la la vila",
//         description:"sea facing vila",
//         price:4000,
//         location:"Arambol,Goa",
//         country:"India"
//     });
//     newListing.save().then((res)=>{
//         console.log(res);
//     });
// })

//create route
router.post("/create",upload.single('listing[image]'),validateListing,asyncWrap(listingController.createNew));


//show,update,delete
router.route("/:id")
    .get(asyncWrap(listingController.showListing))
    .put(isLoggedIn("wanderlust"),isOwner,upload.single('listing[image]'),validateListing,asyncWrap(listingController.updateListing))
    .delete(isLoggedIn("delete"),asyncWrap(listingController.destroyListing));

//edit route
router.get("/:id/edit",isLoggedIn("edit"),asyncWrap(listingController.renderEditForm));


module.exports=router;