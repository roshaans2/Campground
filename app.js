const express = require("express")
const path = require("path")
const mongoose = require("mongoose")
const ejsMate = require("ejs-mate")
const methodOverride = require("method-override")
const Campground = require("./models/campground")
const catchAsync = require("./utils/catchAsync")
const ExpressError = require("./utils/ExpressError")
const Joi = require("joi")
const {campgroundSchema} = require("./schema")

const app = express()

app.engine('ejs',ejsMate)
app.set('view engine','ejs')
app.set('views',path.join(__dirname,'views'))


require('dotenv').config()

app.use(express.urlencoded({extended:true}))
app.use(methodOverride("_method"))

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("DB Connected")
    })
    .catch(err => {
        console.log("Error")
        console.log(err)
    })


const validateCampground = (req,res,next) => {
  
    const {error} = campgroundSchema.validate(req.body)
    if(error){
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg,400)
    }
    else{
        next()
    }
}

app.get("/",(req,res)=>{
    res.render("home.ejs")
})

app.get("/campgrounds/new",async(req,res)=>{
    res.render("campgrounds/new")
})

app.get("/campgrounds",catchAsync(async(req,res)=>{
    const campgrounds = await Campground.find({})
    res.render('campgrounds/index',{campgrounds})
}))

app.get("/campgrounds/:id",catchAsync(async(req,res)=>{
    const {id} = req.params
    const campground = await Campground.findById(id)
    res.render("campgrounds/show",{campground})
}))

app.get("/campgrounds/:id/edit",catchAsync(async(req,res)=>{
    const {id} = req.params
    const campground = await Campground.findById(id)
    res.render("campgrounds/edit",{campground})
}))

app.post("/campgrounds",validateCampground,catchAsync(async(req,res,next)=>{
    const campground = Campground(req.body.campground)
    await campground.save()
    res.redirect(`/campgrounds/${campground.id}`)
}))

app.put("/campgrounds/:id",validateCampground,catchAsync(async(req,res)=>{
    const {id} = req.params
    const campground = await Campground.findByIdAndUpdate(id,{...req.body.campground})
    res.redirect(`/campgrounds/${campground.id}`)
}))

app.delete("/campgrounds/:id",catchAsync(async(req,res)=>{
    const {id} = req.params
    await Campground.findByIdAndDelete(id)
    res.redirect("/campgrounds")
}))

app.all("*",(req,res,next)=>{
    next(new ExpressError('Page Not Found',404))
})

app.use((err,req,res,next)=>{
    const {statusCode = 500} = err
    if(!err.message){
        err.message = "Something went wrong"
    }
    res.status(statusCode).render('error',{err})
})


app.listen(5000,()=>{
    console.log("Server running at port 5000") 
})