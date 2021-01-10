const mongoose = require("mongoose");
const Review = require("./review");
const Schema = mongoose.Schema;

//defining Schema
const CampgroundSchema = new Schema({
    title : String,
    images : [
        {
            url : String,
            filename : String
        }
    ],
    price : Number,
    description : String,
    location : String,
    reviews : [{
        type : Schema.Types.ObjectId,
        ref : "Review"
    }],
    author : {
        type : Schema.Types.ObjectId,
        ref: "User"
    }
});


//campground delete mongoose middleware
CampgroundSchema.post("findOneAndDelete",async (doc)=>{
    if(doc){
        await Review.deleteMany({
            _id : {
                $in : doc.reviews
            }
        })
    }
});


//defining model
const Campground = mongoose.model("Campground",CampgroundSchema);

module.exports = Campground;