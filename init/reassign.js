const initData= require("./data.js");
const listing=require("../models/listing.js");
const mongoose=require("mongoose");

async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
}

main().then((res)=>{
    console.log("database connected");
}).catch((err)=>{
    console.log(err);
});

async function initDB(){
    await listing.deleteMany({});
    initData.data=initData.data.map((obj)=>({...obj,owner:'6890f090d1e81c03ea6436bd'}));
    await listing.insertMany(initData.data);
    console.log("data is initialised");
}

initDB();


