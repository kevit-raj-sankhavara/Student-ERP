const express = require('express');
const router = new express.Router();
const Attendance = require('../models/attendance');


router.get("/getStudentList", async (req, res) => {
    try {
        const data = await Attendance.find(req.body);
        const studentList = data.map(student => {
            return ({
                name: student.studentname,
                rollno: student.rollno
            });
        })
        res.send(studentList);
    } catch (error) {
        res.status(404).send("No data found");
    }
});

router.post("/addAttendance", async (req, res) => {
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

router.get("/checkAttendanceStatus", async (req, res) => {
    const maxDay = await Attendance.find(req.body).sort({ totalDays: -1 });
    // console.log(maxDay);
    if (maxDay.length === 0) {
        return res.status(404).send("No data found")
    }

    const totaldays = maxDay[0].totalDays;

    const Data = maxDay
        .filter(student => {
            return (student.totalDays === totaldays && student.attendancePR >= req.body.attendance)
        })
        .map(student => {
            return ({
                name: student.studentname,
                rollno: student.rollno,
                attendance: student.attendancePR
            })
        });
    res.send(Data);
})

module.exports = router;

