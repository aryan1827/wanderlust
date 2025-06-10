const Review = require("../models/review");
const Listing = require("../models/listing.js");

module.exports.createReview =  async (req,res) => {
    console.log(req.params.id);
  let listing = await Listing.findById(req.params.id);
  let newReview = new Review(req.body.review);
  newReview.author = req.user;
  listing.reviews.push(newReview);
  await newReview.save();
  await listing.save();
  console.log("new review saved");
  req.flash("success","New Review Added!");
  res.redirect(`/listings/${listing._id}`);
}

module.exports.destroyReview = async (req,res) => {
  console.log("route reached")
  let {id,reviewId} = req.params;
  await Listing.findByIdAndUpdate(id, {$pull: { reviews:reviewId } });
  let deletedReview = await Review.findByIdAndDelete(reviewId);
  console.log(deletedReview);
  req.flash("success","Review Deleted!");
  res.redirect(`/listings/${id}`);
}