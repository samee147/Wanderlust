const axios = require('axios');
const Listing=require("../models/listing.js");

module.exports.index=async(req,res)=>{
    let name=req.session.name;
    const allListing=await Listing.find({});
    res.render("index.ejs",{allListing,name});
};

module.exports.renderNewForm=(req,res)=>{
    res.render("new.ejs");
};

// module.exports.createNew=async(req,res)=>{
//     let url=req.file.path;
//     let filename=req.file.filename;

//     // 1. Get an access token from Mappls
//     const accessToken = await getMapplsAccessToken();

//     // 2. Get the address from the form
//     const address = req.body.listing.location;

//     // 3. Make the Geocoding API request
//     const geocodingUrl = `https://apis.mappls.com/advancedmaps/v1/${accessToken}/geo_code?addr=${encodeURIComponent(address)}`;
//     const geocodingResponse = await axios.get(geocodingUrl);

//     // 4. Create the GeoJSON object
//     let geometry = {
//         type: "Point",
//         coordinates: [78.9629, 20.5937] // Default to India center if not found
//     };

//     if (geocodingResponse.data && geocodingResponse.data.results.length > 0) {
//         const bestResult = geocodingResponse.data.results[0];
//         geometry.coordinates = [bestResult.lng, bestResult.lat]; // IMPORTANT: longitude first, then latitude
//     }


//     const newListing= new Listing(req.body.listing);
//     //  if (!(newListing.price)){
//     //     throw new ExpressError(400,"send valid price for listing");
//     // }
//     newListing.owner=req.user._id;
//     newListing.geometry=geometry;
//     newListing.image={url,filename};

//     console.log(newListing.geometry);
    
//     await newListing.save();
//     console.log("new listing added");
//     req.flash("success","new listing added");
//     res.redirect("/listings");
// };

// In controllers/listings.js
// Make sure you have the getMapplsAccessToken helper function defined correctly above this

// In controllers/listings.js

module.exports.createNew = async (req, res, next) => {
    try {
        const newListing = new Listing(req.body.listing);
        newListing.owner = req.user._id;
        newListing.image = { url: req.file.path, filename: req.file.filename };
    
        await newListing.save();
        req.flash("success", "New listing created!");
        res.redirect("/listings");

    } catch (err) {
        // Catch any errors during the process
        console.error("Error creating listing:", err.message);
        if (err.response) {
            console.error("API Error:", err.response.data);
        }
        req.flash("error", "An error occurred while creating the listing.");
        res.redirect("/listings/new");
    }
};

module.exports.showListing=async(req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id).populate({path:"reviews",populate:{path:"author"}}).populate("owner");
    if(!listing){
        req.flash("error","listing not found!");
        return res.redirect("/listings");
    }
    console.log(listing.owner);
    res.render("show.ejs",{listing});
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