const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listings.js");

main().then((res) => {
    console.log("connected to DB");
}).catch(err => console.log(err));

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/TravelBug');
}

const initDB = async () => {
    await Listing.deleteMany({});
    //  declare owner 
    initData.data = initData.data.map((obj)=>({...obj, owner: '66d0cf9a6eb39da395598c16'}));

    await Listing.insertMany(initData.data);
    console.log("data was initialise");
};

initDB();