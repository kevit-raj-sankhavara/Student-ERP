const express = require('express');
const router = new express.Router();
const Attendance = require('../models/attendance');
const Student = require('../models/student');
const auth = require('../middleware/auth');

router.get("/attendance/getAbsentStudents", auth, async (req, res) => {
    const { date, present, batch, branch, sem } = req.body;
    try {
        const data = await Attendance.find({ date, present });
        const rollNums = data.map(student => { return student.rollno });
        const studentsList = await Student.find({ rollno: { $in: rollNums }, batch, branch, sem });
        if (studentsList.length === 0)
            return res.send("No Student Found");
        res.send(studentsList);
    } catch (error) {
        res.status(404).send("No data found");
    }
});

router.post("/attendance/addAttendance", auth, async (req, res) => {
    try {
        let total = await Attendance.find({ rollno: req.body.rollno }).sort({ totalDays: -1 });

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

router.get("/attendance/checkAttendanceStatus", auth, async (req, res) => {
    const { batch, branch, sem } = req.body;
    const students = await Student.find({ batch, branch, sem });

    const rollNums = students.map(student => student.rollno);

    const maxDay = await Attendance.find({ rollno: { $in: rollNums } }).sort({ totalDays: -1 });
    if (maxDay.length === 0) {
        return res.status(404).send("No data found")
    }

    const totaldays = maxDay[0].totalDays;

    const studentsList = maxDay
        .filter(student => {
            return (student.totalDays === totaldays && student.attendancePR < req.body.attendance)
        }).map(student => student.rollno);

    if (studentsList.length === 0)
        return res.send("No Student Found");
    res.send(studentsList);
});

module.exports = router;

