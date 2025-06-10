const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");

const listingSchema = new Schema({ //schema validation
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    // required: true
  },
image: {
  url: String,
  fileName: String,
},
  price: {
    type: Number,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  country: {
    type: String,
    required: true
  },
  reviews: [
    {
      type:Schema.Types.ObjectId,
      ref:"Review",
    }
  ],
  owner: {
    type: Schema.Types.ObjectId,
    ref:"User",
  },
  geometry: {
    type: {
      type: String, // Don't do `{ location: { type: String } }`
      enum: ['Point'], // 'location.type' must be 'Point'
      required: false
    },
    coordinates: {
      type: [Number],
      required: false
    }
  }
});

listingSchema.post("findOneAndDelete", async (listing)=> {  //triggered by findbyidanddelete
  if(listing) {
    await Review.deleteMany({_id : {$in: listing.reviews}});
  }
});

const Listing = mongoose.model("Listing", listingSchema) ;//making model
module.exports = Listing;
