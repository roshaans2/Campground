const express = require("express")
const catchAsync = require("../utils/catchAsync")
const ExpressError = require("../utils/ExpressError")
const {reviewSchema} = require("../schema")
const router = express.Router({mergeParams:true})
const Review = require("../models/review")
const Campground = require("../models/campground")
const {validateReview,isLoggedIn,isReviewAuthor} = require("../middleware")

router.post("/",isLoggedIn,validateReview,catchAsync(async(req,res)=>{
    const {id} = req.params
    const campground = await Campground.findById(id)
    const review = Review(req.body.review)
    review.author = req.user.id
    campground.reviews.push(review)
    await review.save()
    await campground.save()
    req.flash("success","Successfully created a new review")
    res.redirect(`/campgrounds/${campground.id}`)

}))

router.delete("/:reviewId",isLoggedIn,isReviewAuthor,catchAsync(async(req,res)=>{
    const {id,reviewId} = req.params
    const campground = await Campground.findByIdAndUpdate(id,{$pull:{reviews:reviewId}})
    await Review.findByIdAndDelete(reviewId)
    req.flash("success","Successfully deleted review")
    res.redirect(`/campgrounds/${id}`)

}))

module.exports = router