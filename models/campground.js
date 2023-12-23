const mongoose = require("mongoose")
const Schema = mongoose.Schema
const Review = require("./review")

const CampgroundSchema = Schema({
    title:String,
    image:String,
    price:Number,
    description:String,
    location:String,
    reviews:[
        {
            type:Schema.Types.ObjectId,
            ref:'Review'
        }
    ]
})

CampgroundSchema.post('findOneAndDelete',async(doc)=>{
    console.log("Deleted")
    if(doc){
        const review = await Review.deleteMany({
            _id:{
                $in : doc.reviews
            }
        })
        console.log(review)
        
    }
})

const Campground = mongoose.model("Campground",CampgroundSchema)

module.exports = Campground