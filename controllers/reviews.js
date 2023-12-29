const Review = require("../models/review")
const Campground = require("../models/campground")

module.exports.createReview = async(req,res)=>{
    const {id} = req.params
    const campground = await Campground.findById(id)
    const review = Review(req.body.review)
    review.author = req.user.id
    campground.reviews.push(review)
    await review.save()
    await campground.save()
    req.flash("success","Successfully created a new review")
    res.redirect(`/campgrounds/${campground.id}`)

}

module.exports.deleteReview = async(req,res)=>{
    const {id,reviewId} = req.params
    const campground = await Campground.findByIdAndUpdate(id,{$pull:{reviews:reviewId}})
    await Review.findByIdAndDelete(reviewId)
    req.flash("success","Successfully deleted review")
    res.redirect(`/campgrounds/${id}`)

}