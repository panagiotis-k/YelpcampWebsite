const Campground = require("../models/campground");


module.exports.index =async (req,res)=>{
    const campgrounds=  await Campground.find({});
    res.render("campgrounds/index",{campgrounds})
 }


 module.exports.renderNewForm = (req,res)=>{
    res.render("campgrounds/new")
};

module.exports.createCampground = async (req,res)=>{
    const camp = new Campground(req.body.campground);
    camp.images = req.files.map(elm=>{
        return {url : elm.path , filename : elm.filename }
    });
    console.log(camp);
    camp.author = req.user._id;
    await camp.save();
    req.flash("success","Successfully made a new campground!");
    res.redirect(`/campgrounds/${camp._id}`);
}

module.exports.showCampground = async (req,res)=>{
   
        const {id} =req.params;
        const camp = await Campground.findById(id).populate({
            path : "reviews",
            populate : {
                path : "author"
            }
        }).populate("author");
        if(!camp){
            req.flash("error","Cannot find that campground!")
            return res.redirect("/campgrounds")
        }
        res.render("campgrounds/show",{camp});
 }

 module.exports.renderEditForm = async (req,res)=>{
    const {id} = req.params;
    const camp = await Campground.findById(id);
    if(!camp)
    {
        req.flash("error","Cannot find that campground!")
        return res.redirect("/campgrounds")
    }
    res.render("campgrounds/edit",{camp})
}

module.exports.updateCampground = async (req,res)=>{
    const {id} = req.params;
    const camp = await Campground.findByIdAndUpdate(id,req.body.campground);
    const images = req.files.map(elm=>{
        return {url : elm.path , filename : elm.filename };
    });
    camp.images.push(...images);
    await camp.save();
    req.flash("success","Successfully updated campground!");
    res.redirect(`/campgrounds/${id}`);
}

module.exports.deleteCampground = async (req,res)=>{
    const {id} = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash("success","Successfully deleted campground!")
    res.redirect("/campgrounds")
}