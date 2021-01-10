const mongoose = require("mongoose");
const {Schema} = mongoose;
const passportLocalMongoose = require("passport-local-mongoose");

const UserSchema = new Schema({
    email : {
        type : String,
        required :true,
        unique : true
    }
});


//this will add a username & password field in the UserSchema
UserSchema.plugin(passportLocalMongoose);

const User = mongoose.model("User",UserSchema)

module.exports = User;