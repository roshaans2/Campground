const express = require("express")
const Campground = require("../models/campground")
const catchAsync = require("../utils/catchAsync")
const ExpressError = require("../utils/ExpressError")
const {campgroundSchema} = require("../schema")
const {isLoggedIn,validateCampground,isAuthor} = require("../middleware")
const campgrounds = require("../controllers/campground")
const router = express.Router()


router.get("/new",isLoggedIn,campgrounds.renderNewForm)

router.get("/",catchAsync(campgrounds.index))

router.get("/:id",catchAsync(campgrounds.showCampground))

router.get("/:id/edit",isLoggedIn,isAuthor,catchAsync(campgrounds.edit))

router.post("/",isLoggedIn,validateCampground,catchAsync(campgrounds.createCampground))

router.put("/:id",isLoggedIn,isAuthor,validateCampground,catchAsync(campgrounds.editCampground))

router.delete("/:id",isLoggedIn,isAuthor,catchAsync(campgrounds.deleteCampground))

module.exports = router