const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema({
    date: {
        type: String,
        required: true
    },
    studentname: {
        type: String,
        required: true
    },
    rollno: {
        type: String,
        required: true,
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
    present: {
        type: Boolean,
        default: true
    },
    totalDays: {
        type: Number,
    },
    presentCount: {
        type: Number,
    },
    attendancePR: {
        type: Number,
    }
});

const Attendance = mongoose.model("Attendance", attendanceSchema);
module.exports = Attendance;