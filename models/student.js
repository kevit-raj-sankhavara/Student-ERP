const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
    studentname: {
        type: String,
        required: true
    },
    rollno: {
        type: String,
        required: true,
        unique: true
    },
    batch: {
        type: Number,
        required: true
    },
    branch: {
        type: String,
        required: true
    },
    sem: {
        type: Number,
        required: true
    },
    phoneNo: {
        type: Number,
    }
});

const Student = mongoose.model("Student", studentSchema);
module.exports = Student;