const express = require("express")
const path = require("path")
const mongoose = require("mongoose")
const methodOverride = require("method-override")
const Campground = require("./models/campground")

const app = express()


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



app.get("/",(req,res)=>{
    res.render("home.ejs")
})

app.get("/campgrounds/new",async(req,res)=>{
    res.render("campgrounds/new")
})

app.get("/campgrounds",async(req,res)=>{
    const campgrounds = await Campground.find({})
    res.render('campgrounds/index',{campgrounds})
})

app.get("/campgrounds/:id",async(req,res)=>{
    const {id} = req.params
    const campground = await Campground.findById(id)
    res.render("campgrounds/show",{campground})
})

app.get("/campgrounds/:id/edit",async(req,res)=>{
    const {id} = req.params
    const campground = await Campground.findById(id)
    res.render("campgrounds/edit",{campground})
})

app.post("/campgrounds",async(req,res)=>{
    const campground = Campground(req.body.campground)
    await campground.save()
    res.redirect(`/campgrounds/${campground.id}`)
})

app.put("/campgrounds/:id",async(req,res)=>{
    const {id} = req.params
    const campground = await Campground.findByIdAndUpdate(id,{...req.body.campground})
    res.redirect(`/campgrounds/${campground.id}`)
})

app.delete("/campgrounds/:id",async(req,res)=>{
    const {id} = req.params
    await Campground.findByIdAndDelete(id)
    res.redirect("/campgrounds")
})


app.listen(5000,()=>{
    console.log("Server running at port 5000")
})