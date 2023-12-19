const express = require("express")
const mongoose = require("mongoose")
const Campground = require("../models/campground")
const cities = require("./cities")
const {places,descriptors} = require("./seedHelpers")



const app = express()

require('dotenv').config()

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("DB Connected")
    })
    .catch(err => {
        console.log("Error")
        console.log(err)
    })

const sample = (array) => {
    return array[Math.floor(Math.random() * array.length)]
}


const seedDB = async()=>{
    await Campground.deleteMany({})
    for(let i=0;i<50;i++){
        const random1000 = Math.floor(Math.random() * 1000)
        const camp = await Campground({
            location:`${cities[random1000].city},${cities[random1000].state}`,
            title:`${sample(descriptors)} ${sample(places)}`

        }).save()
    }
}

seedDB().then(()=> mongoose.connection.close())