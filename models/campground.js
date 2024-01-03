const mongoose = require("mongoose")
const Schema = mongoose.Schema
const Review = require("./review")

const CampgroundSchema = Schema({
    title:String,
    images:[
        {
            url:String,
            filename:String
        }
    ],
    price:Number,
    description:String,
    location:String,
    author:{
        type:Schema.Types.ObjectId,
        ref:'User'
    },
    reviews:[
        {
            type:Schema.Types.ObjectId,
            ref:'Review'
        }
    ]
})

CampgroundSchema.post('findOneAndDelete',async(doc)=>{
    if(doc){
        const review = await Review.deleteMany({
            _id:{
                $in : doc.reviews
            }
        })
    }
})

const Campground = mongoose.model("Campground",CampgroundSchema)

module.exports = Campground