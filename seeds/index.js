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
        const price = Math.floor(Math.random() * 20000) + 10
        const camp = await Campground({
            author:'658ba7f1b50305da7f105ff7',
            location:`${cities[random1000].city},${cities[random1000].state}`,
            title:`${sample(descriptors)} ${sample(places)}`,
            description:'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ducimus neque possimus officia rem repellendus iure voluptates facere quos, odio iste culpa. Ducimus, culpa id. Laudantium veniam saepe explicabo vitae numquam!',
            price:price,
            images:[
                {
                  url: 'https://res.cloudinary.com/darp0sfda/image/upload/v1704276222/YELPCAMPGROUND/e4io3elaskkxyepcmluk.jpg',
                  filename: 'YELPCAMPGROUND/e4io3elaskkxyepcmluk',
                },
                {
                  url: 'https://res.cloudinary.com/darp0sfda/image/upload/v1704276223/YELPCAMPGROUND/h7tocfahm3lgj9avq1en.jpg',
                  filename: 'YELPCAMPGROUND/h7tocfahm3lgj9avq1en',
                }
              ]

        }).save()
    }
}

seedDB().then(()=> mongoose.connection.close())