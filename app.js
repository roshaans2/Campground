const express = require("express")
const path = require("path")
const mongoose = require("mongoose")
const ejsMate = require("ejs-mate")
const methodOverride = require("method-override")
const Campground = require("./models/campground")
const Review = require("./models/review")
const catchAsync = require("./utils/catchAsync")
const ExpressError = require("./utils/ExpressError")
const Joi = require("joi")
const {campgroundSchema,reviewSchema} = require("./schema")
const campgrounds = require("./routes/campgrounds")
const reviews = require("./routes/reviews")
const session = require("express-session")
const flash = require("connect-flash")

const app = express()

require('dotenv').config()

app.engine('ejs',ejsMate)
app.set('view engine','ejs')
app.set('views',path.join(__dirname,'views'))


app.use(express.urlencoded({extended:true}))
app.use(methodOverride("_method"))
app.use(express.static(path.join(__dirname,'public')))

const sessionConfig = {
    secret: process.env.secret,
    resave:false,
    saveUninitialized:true,
    cookie:{
        httpOnly:true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge:1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig))
app.use(flash())

app.use((req,res,next)=>{
    res.locals.success = req.flash('success')
    res.locals.error = req.flash('error')
    next()
})


app.use("/campgrounds",campgrounds)
app.use("/campgrounds/:id/reviews",reviews)

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("DB Connected")
    })
    .catch(err => {
        console.log("Error")
        console.log(err)
    })





app.get("/",(req,res)=>{
    res.render("home.ejs")
})

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