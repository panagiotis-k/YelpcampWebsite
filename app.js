//include env variables as long we are not in production mode 
//we are in development mode
if(process.env.NODE_ENV !== "production"){
  require("dotenv").config();
}

//requirements
const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError");
const session = require("express-session");
const flash = require("connect-flash");
const User = require("./models/user");
const passport = require("passport");
const LocalStrategy = require("passport-local");

//my app
const app = express();

//import router
const usersRoutes = require("./routes/users");

const campgroundsRoutes = require("./routes/campgrounds");
const reviewsRoutes = require("./routes/reviews");

//connection to mongo
mongoose.connect("mongodb://localhost:27017/yelp-camp", {
  useNewUrlParser: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
  useCreateIndex: true,
});

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
});

//setting up views dir
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));

//set the ejsMate as ejs engine
app.engine("ejs", ejsMate);

//middlewares for form body parser & method override
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

//public middleware
app.use(express.static(path.join(__dirname, "/public")));

//session middleware & configuration
const sessionConfig = {
  secret: "thisisnotagoodsecret",
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};

app.use(session(sessionConfig));

//flash middleware
app.use(flash());

//passport config | PASSPORTSESSION() MUST BE AFTER MY APP SESSIONS |
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//locals middleware
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");

  next();
});

//middlewares for routes with their prefixed paths
app.use("/campgrounds", campgroundsRoutes);
app.use("/campgrounds/:id/reviews", reviewsRoutes);
app.use("/", usersRoutes);

// home route
app.get("/", (req, res) => {
  res.render("home");
});

//ERROR 404 NOT FOUND-
app.all("*", (req, res, next) => {
  next(new ExpressError("PAGE NOT FOUND", 404));
});

//DEFINING MY OWN ERROR HANDLER
app.use((err, req, res, next) => {
  if (!err.message) {
    err.message = "Oh no, something went wrong!";
  }
  const { status = 500 } = err;
  res.status(status).render("error", { err });
});

//start server
app.listen(3000, () => {
  console.log("Serving on PORT 3000");
});
