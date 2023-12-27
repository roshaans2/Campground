const express = require("express")
const Campground = require("../models/campground")
const catchAsync = require("../utils/catchAsync")
const ExpressError = require("../utils/ExpressError")
const {campgroundSchema} = require("../schema")
const {isLoggedIn,validateCampground,isAuthor} = require("../middleware")
const router = express.Router()


router.get("/new",isLoggedIn,async(req,res)=>{
    res.render("campgrounds/new")
})

router.get("/",catchAsync(async(req,res)=>{
    const campgrounds = await Campground.find({})
    res.render('campgrounds/index',{campgrounds})
}))

router.get("/:id",catchAsync(async(req,res)=>{
    const {id} = req.params
    const campground = await Campground.findById(id).populate({
        path:"reviews",
        populate:{
            path:"author"
        }
    }).populate("author")
    if(!campground){
        req.flash("error","Cannot find Campground!")
        return res.redirect("/campgrounds")
    }
    res.render("campgrounds/show",{campground})
}))

router.get("/:id/edit",isLoggedIn,isAuthor,catchAsync(async(req,res)=>{
    const {id} = req.params
    const campground = await Campground.findById(id)
    if(!campground){
        req.flash("error","Cannot find Campground!")
        return res.redirect("/campgrounds")
    }
    res.render("campgrounds/edit",{campground})
}))

router.post("/",isLoggedIn,validateCampground,catchAsync(async(req,res,next)=>{
    const campground = Campground(req.body.campground)
    campground.author = req.user.id
    await campground.save()
    req.flash("success","Successfully made a new Campground!")
    res.redirect(`/campgrounds/${campground.id}`)
}))

router.put("/:id",isLoggedIn,isAuthor,validateCampground,catchAsync(async(req,res)=>{
    const {id} = req.params
    const campground = await Campground.findByIdAndUpdate(id,{...req.body.campground})
    req.flash("success","Successfully updated Campground!")
    res.redirect(`/campgrounds/${campground.id}`)
}))

router.delete("/:id",isLoggedIn,isAuthor,catchAsync(async(req,res)=>{
    const {id} = req.params
    await Campground.findByIdAndDelete(id)
    res.redirect("/campgrounds")
}))

module.exports = router