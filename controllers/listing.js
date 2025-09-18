const Listing=require("../models/listing.js");

module.exports.index=async(req,res)=>{
    let name=req.session.name;
    const allListing=await Listing.find({});
    res.render("index.ejs",{allListing,name});
};

module.exports.renderNewForm=(req,res)=>{
    res.render("new.ejs");
};

module.exports.createNew=async(req,res)=>{
    let url=req.file.path;
    let filename=req.file.filename;

    const newListing= new Listing(req.body.listing);
    //  if (!(newListing.price)){
    //     throw new ExpressError(400,"send valid price for listing");
    // }
    newListing.owner=req.user._id;
    newListing.image={url,filename};
    await newListing.save();
    console.log("new listing added");
    req.flash("success","new listing added");
    res.redirect("/listings");
};

module.exports.showListing=async(req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id).populate({path:"reviews",populate:{path:"author"}}).populate("owner");
    if(!listing){
        req.flash("error","listing not found!");
        return res.redirect("/listings");
    }
    console.log(listing.owner);
    res.render("show.ejs",{listing,mapTokenKey:process.env.MAP_TOKEN_KEY});
};

module.exports.renderEditForm=async(req,res)=>{
    let {id}=req.params;
    const listing= await Listing.findById(id);

    let originalImage=listing.image.url;
    let showImage=originalImage.replace("/upload","/upload/h_200,w_300");
    res.render("edit.ejs",{listing,showImage});
};

module.exports.updateListing=async(req,res)=>{
    let {id}=req.params;
    let updatedListing=await Listing.findByIdAndUpdate(id,{...req.body.listing});

    // Check if a new image file was uploaded
    if (typeof req.file !== "undefined") {
        let url = req.file.path;
        let filename = req.file.filename;
        updatedListing.image = { url, filename };
        await updatedListing.save(); // Save the updated listing document
    }

    req.flash("success","listing updated");
    res.redirect(`/listings/${id}`);
};

module.exports.destroyListing=async(req,res)=>{
    let {id}=req.params;
    let deletedListing=await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success","listing deleted");
    res.redirect("/listings");
};