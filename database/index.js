const mongoose = require('mongoose');
const dotenv = require("dotenv");
dotenv.config() ;
const Schema = mongoose.Schema ;
const ObjectId = mongoose.Types.ObjectId ; 

const UserSchema = new Schema({
    email : {
        type : String,
        required : true,
        unique : true
    },
    password : String,
    firstName : String,
    lastName : String
});

const adminSchema = new Schema({
    email : {
        type : String,
        required : true,
        unique : true
    },
    password : String,
    firstName : String,
    lastName : String
});

const courseSchema = new Schema({
    instructorId : Schema.Types.ObjectId,
    title : String,
    description : String,
    price : Number,
    imageUrl : String
});

const purchaseSchema = new Schema({
    userId : ObjectId,
    courseId : ObjectId
})

const userModel = mongoose.model('User', UserSchema); // [User collection, Schema]
const adminModel = mongoose.model('Admin', adminSchema) ;
const courseModel = mongoose.model('Course', courseSchema);
const purchaseModel = mongoose.model('Purchase', purchaseSchema);


module.exports = {
    userModel,
    adminModel,
    courseModel,
    purchaseModel
}