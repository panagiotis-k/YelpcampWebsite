const mongoose = require("mongoose");
const Campground = require("../models/campground") 
const cities = require("./cities")
const {descriptors , places} = require("./seedHelpers");


//connection to mongo
mongoose.connect("mongodb://localhost:27017/yelp-camp",{
    useNewUrlParser:true,
    seCreateIndex: true,
    useUnifiedTopology : true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});


const sample = (array) =>{
    return array[Math.floor(Math.random() * array.length )];
}



const seedDB = async()=>{
    await Campground.deleteMany({});
    for (let i = 0 ;i <50; i++)
    {
        const number = Math.floor(Math.random() * 1000) + 1;
        const price = Math.floor(Math.random() * 30) +10;
        const camp = new Campground( {
            author : "5ff48996135d46376031876d",
            location : `${cities[number].city}, ${cities[number].state}`,
            title : `${sample(descriptors)} ${sample(places)}`,
            images: [
                {
                  url: 'https://res.cloudinary.com/dx6omlxkv/image/upload/v1610136010/YelpCamp/wkydbbeqqhhclrxjvwxb.jpg',
                  filename: 'YelpCamp/wkydbbeqqhhclrxjvwxb'
                },
                {
                  url: 'https://res.cloudinary.com/dx6omlxkv/image/upload/v1610136011/YelpCamp/m77yhkyyvdgefavvrgcm.jpg',
                  filename: 'YelpCamp/m77yhkyyvdgefavvrgcm'
                }
              ],
            description :"Lorem ipsum dolor sit, amet consectetur adipisicing elit. Expedita magnam cupiditate libero ipsa beatae eius in illo, aperiam recusandae numquam.",
            price : `${price}`
        });
        await camp.save();
    }
}



//disconnect mongo
seedDB()
    .then(()=>{
        db.close();
    })