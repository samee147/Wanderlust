const express = require("express");
const app = express();
const mongoose =require("mongoose");
const Listing=require("./models/listing.js");
const path=require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError=require("./util/ExpressError.js");
const asyncWrap = require("./util/asyncWrap.js");
const Review=require("./models/review.js");
const cookieParser=require("cookie-parser");
const session=require("express-session");
const flash=require("connect-flash");
const User=require("./models/user.js");
const passport=require("passport");
const LocalStrategy=require("passport-local");

const listingsRouter=require("./routes/listing.js");
const reviewsRouter=require("./routes/review.js");
const usersRouter=require("./routes/user.js");

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(cookieParser("secretcode"));

let sessionOptions=
    {
        secret:process.env.SECRET,
        resave:false,
        saveUninitialized:true,
        cookie:{
            expires:Date.now() + 7 * 24 * 60 * 60 * 1000,
            maxAge: 7 * 24 * 60 * 60 * 1000,
            httpOnly:true
        }
    }

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(express.static(path.join(__dirname,"/public")));

async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
}

main().then((res)=>{
    console.log("database connected");
}).catch((err)=>{
    console.log(err);
});

app.use((req,res,next)=>{
    res.locals.loginMsg=req.flash("loginMsg");
    res.locals.loginErr=req.flash("loginErr");
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currUser=req.user;
    next();
})

// app.get("/reqsession",(req,res)=>{
//     if(req.session.count){
//         req.session.count++;
//     }
//     else{
//         req.session.count=1;
//     }
//     res.send(`you sent the request ${req.session.count} times`);
// });

app.get("/exampleoflogin",(req,res)=>{
    let {name="anonymous"}=req.query;
    req.session.name=name;
    if(name="anonymous"){
        req.flash("loginErr","user not logged in");
    }
    else{
        req.flash("loginMsg","logged in successfully");
    };
    res.redirect("/listings");
})

app.get("/signedcookies",(req,res)=>{
    res.cookie("home","mumbai",{signed:true});
    res.send("signed cookies sent");
});

app.get("/verify",(req,res)=>{
    console.log(req.signedCookies);
    res.send("see result in terminal");
})

app.get("/sendcookies",(req,res)=>{
    res.cookie("name","Sameep");
    res.send("cookies sent");
});

app.get("/getCookies",(req,res)=>{
    let {name="anonymous"}=req.cookies;
    res.send(`hi! ${name}`);
});

app.get("/demoUser",async(req,res)=>{
    let fakeUser=new User({
        email:"fake@gmail.com",
        username:"fakeUser"
    });

    let registeredUser=await User.register(fakeUser,"demoPassword");
    res.send(registeredUser);
});

app.use("/listings",listingsRouter);
app.use("/listings/:id/review",reviewsRouter);
app.use("/user",usersRouter);

app.all("/*path",(req, res, next) => {
    next(new ExpressError(404, "page not found!"));
});

app.use((err,req,res,next)=>{
    const {statusCode=500,message="Page Not Found!"}=err;
    res.status(statusCode).render("error.ejs",{message});
});

app.listen(8080,()=>{
    console.log("server listening on port 8080");
});
