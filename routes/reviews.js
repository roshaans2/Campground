const express = require("express")
const catchAsync = require("../utils/catchAsync")
const ExpressError = require("../utils/ExpressError")
const {reviewSchema} = require("../schema")
const router = express.Router({mergeParams:true})
const Review = require("../models/review")
const Campground = require("../models/campground")

const validateReview = (req,res,next) => {
  
    const {error} = reviewSchema.validate(req.body)
    if(error){
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg,400)
    }
    else{
        next()
    }
}


router.post("/",validateReview,catchAsync(async(req,res)=>{
    const {id} = req.params
    const campground = await Campground.findById(id)
    const review = Review(req.body.review)
    campground.reviews.push(review)
    await review.save()
    await campground.save()
    req.flash("success","Successfully created a new review")
    res.redirect(`/campgrounds/${campground.id}`)

}))

router.delete("/:reviewId",catchAsync(async(req,res)=>{
    const {id,reviewId} = req.params
    const campground = await Campground.findByIdAndUpdate(id,{$pull:{reviews:reviewId}})
    await Review.findByIdAndDelete(reviewId)
    req.flash("success","Successfully deleted review")
    res.redirect(`/campgrounds/${id}`)

}))

module.exports = router