const express = require('express');
const router = new express.Router();
const Attendance = require('../models/attendance');
const Student = require('../models/student');

router.get("/attendance/getAbsentStudents", async (req, res) => {
    const { date, present } = req.body;
    try {
        const data = await Attendance.find({ date, present });
        const rollNums = data.map(student => { return student.rollno });
        const studentsList = await Student.find({ rollno: { $in: rollNums } });
        res.send(studentsList);
    } catch (error) {
        res.status(404).send("No data found");
    }
});

router.post("/attendance/addAttendance", async (req, res) => {
    try {
        const total = await Attendance.find({ rollno: req.body.rollno }).sort({ totalDays: -1 });

        req.body.totalDays = (total.length === 0) ? 1 : total[0].totalDays + 1;

        const present = (req.body.present === true) ? 1 : 0;

        req.body.presentCount = (total.length === 0) ? present : total[0].presentCount + present;
        req.body.attendancePR = (total.length === 0)
            ? (present * 100)
            : ((req.body.presentCount / req.body.totalDays) * 100);

        console.log(total.length, req.body.totalDays, req.body.presentCount, req.body.attendancePR);

        const attendance = new Attendance(req.body);
        await attendance.save();
        res.send(attendance);
    } catch (error) {
        res.status(500).send(error);
    }
});

router.get("/attendance/checkAttendanceStatus", async (req, res) => {
    const maxDay = await Attendance.find(req.body).sort({ totalDays: -1 });
    if (maxDay.length === 0) {
        return res.status(404).send("No data found")
    }

    const totaldays = maxDay[0].totalDays;

    const rollNums = maxDay
        .filter(student => {
            return (student.totalDays === totaldays && student.attendancePR < req.body.attendance)
        }).map(student => student.rollno);

    const studentsList = await Student.find({ rollno: { $in: rollNums } });
    res.send(studentsList);
});

router.get("/attendance/getAttData", async (req, res) => {
    const total = await Attendance.find().sort({ totalDays: -1 });
    res.send(total);
})

module.exports = router;

