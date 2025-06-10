const Listing = require("../models/listing.js");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({accessToken : mapToken});


module.exports.index = async(req,res) => {
  const allListings = await Listing.find({});
  res.render("./listings/index.ejs",{allListings});
};

module.exports.renderNewForm = (req,res)=> {
  res.render("./listings/new.ejs")
}

module.exports.showListing =  async (req,res) => {
  let id = req.params.id;
  const listing = await Listing.findById(id).populate({path: "reviews", populate: {
    path:"author",
  }}).populate("owner");
  if(!listing) {
    // req.flash("error","Listing Does Not Exist!");
    res.redirect("/listings");
  }
  console.log(listing);
  res.render("./listings/show.ejs", {listing})
}

module.exports.createListing = async (req,res,next) => {
  
  let response = await geocodingClient.forwardGeocode({
    query: req.body.listing.location + " " + req.body.listing.country,
    limit: 1
  })
  .send();

  let url = req.file.path;
  let filename = req.file.filename;
  const listing = new Listing(req.body.listing);
  listing.owner = req.user._id;
  listing.image = {url,filename};

  listing.geometry = response.body.features[0].geometry;
  let savedListing = await listing.save();
  console.log(savedListing);
  req.flash("success","New Listing Created!");
  res.redirect("/listings");
};

module.exports.renderEditForm = async (req,res) => {
  let id = req.params.id;
  const listing = await Listing.findById(id);
  if(!listing) {
    req.flash("error","Listing Does Not Exist!");
    res.redirect("/listings");
  }
  let originalImageUrl = listing.image.url;
  originalImageUrl = originalImageUrl.replace("/upload", "/upload/c_scale,w_250");
  res.render("listings/edit.ejs", {listing, originalImageUrl})
};

module.exports.updateListing = async (req,res) => {
  let {id} = req.params;
  let listing = await Listing.findByIdAndUpdate(id, {...req.body.listing});
  if(typeof req.file !== "undefined") {
   let url = req.file.path;
   let filename = req.file.filename;
   listing.image = {url,filename};
   let editedListing = await listing.save();
   console.log(editedListing)
  }
  req.flash("success","Listing Updated!");
  res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req,res)=> {
  let {id} = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  req.flash("success","Listing Deleted!");
  res.redirect("/listings");
}
