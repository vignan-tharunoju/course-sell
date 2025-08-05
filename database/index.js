const mongoose = require('mongoose');
const dotenv = require("dotenv");
dotenv.config() ;
const Schema = mongoose.Schema ;

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

const instructorSchema = new Schema({
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
    courseId : Schema.Types.ObjectId,
    userId : Schema.Types.ObjectId
})

const userModel = mongoose.model('User', UserSchema); // [User collection, Schema]
const instructorModel = mongoose.model('Todo', instructorSchema);
const adminModel = mongoose.model('Admin', adminSchema) ;
const courseModel = mongoose.model('Course', courseSchema);
const purchaseModel = mongoose.model('Purchase', purchaseSchema);


module.exports = {
    userModel,
    instructorModel,
    adminModel,
    courseModel,
    purchaseModel
}