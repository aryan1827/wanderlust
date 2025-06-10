if(process.env.NODE_ENV != "production") {
  require('dotenv').config();
}




const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const app = express();
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError");
const { valid } = require("joi");
const Review = require("./models/review.js");
const flash = require("connect-flash");
const passport = require("passport");
const localStrategy = require("passport-local");
const User = require("./models/user.js");

const multer  = require('multer')
const upload = multer({ dest: 'uploads/' }) //temporarilty stores in our pc, usually we use third party servies
//to store the upload images

const session = require("express-session");
const MongoStore = require('connect-mongo'); //mongo sessions for deployment, not development stage

const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: true }));
app.engine('ejs', ejsMate);


const dbUrl = process.env.ATLASDB_URL;

main().then( ()=> {
  console.log("connection successful to database")
}) 
.catch(err => console.log(err));
async function main() {
  await mongoose.connect(dbUrl);
}

const store = MongoStore.create({
  mongoUrl: dbUrl,
  crypto: {
    secret: process.env.SECRET
  },
  touchAfter: 60*60*24,
})

store.on("error", () => {
  console.log("error in mongo session store");
})

const sessionOptions = {
  store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7*24*60*60*1000,
    maxAge: 7*24*60*60*1000,
    httpOnly: true,
  },
};
// app.get("/", (req, res) => {
//   res.send("Root route is working");
// });







app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
})

// app.get("/demo", async (req,res) => {
//   let fakeUser = new User({
//     email: "student@gmail.com",
//     username: "delta-student",
//   });

//   const registeredUser = await User.register(fakeUser, "helloworld");
//   res.send(registeredUser);
// });

app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);

app.all(/.*/,(req,res,next)=>{
  next(new ExpressError(404, "page not found"));
})

//Error Handling Middleware
app.use((err,req,res,next) => {
  let {status=500,message="something went wrong"} = err;
  res.status(status).render("error.ejs", {err});
  // res.status(status).send(message);
})

app.listen(8080, () => {
  console.log("Server is running on https://localhost:8080");
})
