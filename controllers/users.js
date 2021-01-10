const User = require("../models/user");
const passport = require("passport");

module.exports.renderRegisterForm = (req,res)=>{
    res.render("users/register")
};

module.exports.register = async (req,res,next)=>{
    try
    {
        const {email , username, password} = req.body.user;
        const user = new User({
            username : username,
            email : email
        });
        const registeredUser = await User.register(user,password);
        //req.login(user,callback)
        req.login(registeredUser,err=>{
            if (err){
                return next(err);
            }
            req.flash("success","Welcome to Yelp Camp!")
            res.redirect("/campgrounds")
        });
    }catch(e){
            req.flash("error",e.message);
            res.redirect("/register");
    }
}

module.exports.renderLoginForm = (req,res)=>{
    res.render("users/login")
}

module.exports.login = (req,res)=>{
    req.flash("success",`Welcome back!`);
    const redirectUrl = req.session.returnTo || "/campgrounds"
    delete req.session.returnTo;
    res.redirect(redirectUrl);
}

module.exports.logout = (req,res)=>{
    req.logout();
    req.flash("success",`Goodbye!`)
    res.redirect("/campgrounds")
}