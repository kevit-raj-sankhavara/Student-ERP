const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema({
    date: {
        type: Date,
        required: true
    },
    rollno: {
        type: String,
        required: true,
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