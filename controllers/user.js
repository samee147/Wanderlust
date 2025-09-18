const User=require("../models/user.js");

module.exports.renderSignupForm=(req,res)=>{
    res.render("user/signUp.ejs")
};

module.exports.signup=async(req,res,next)=>{
    try{
        let {username,email,password}=req.body;
        let newUser= new User({
            username:username,
            email:email
        });

        let registeredUser=await User.register(newUser,password);
        console.log(registeredUser);
        req.login(registeredUser,(err)=>{
            if(err){
                return next(err);
            }
            req.flash("success","welcome to wanderlust!");
            res.redirect("/listings");
        });
    }
    catch(err){
        req.flash("error",err.message);
        res.redirect("/user/signUp");
    }

};

module.exports.renderLoginForm=(req,res)=>{
    res.render("user/login.ejs");
};

module.exports.afterLogin=async(req,res)=>{
    req.flash("success","welcome back to wanderlust!");
    console.log(req.session);
    console.log(res.locals.redirectUrl);
    const redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
};

module.exports.logout=(req,res)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","you logged out!");
        res.redirect("/listings");
    });
};