const express=require("express");
const router=express.Router();

const ExpressError=require("../util/ExpressError.js");
const asyncWrap = require("../util/asyncWrap.js");

const User=require("../models/user.js");
const passport = require("passport");
const {saveRedirectUrl}=require("../middlewares.js");
const userController=require("../controllers/user.js");
const { renderNewForm } = require("../controllers/listing.js");

router.route("/signUp")
    .get(userController.renderSignupForm)
    .post(asyncWrap(userController.signup));

router.route("/login")
    .get(userController.renderLoginForm)
    .post(saveRedirectUrl,passport.authenticate("local",{failureRedirect:"/user/login",failureFlash:true}),userController.afterLogin);

router.get("/logout",userController.logout);

module.exports=router;