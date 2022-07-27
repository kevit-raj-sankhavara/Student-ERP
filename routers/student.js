const express = require('express');
const Student = require('../models/student');
const router = new express.Router();
const auth = require('../middleware/auth');

router.post("/student/addStudent", auth, async (req, res) => {
    const student = new Student(req.body);
    console.log(student);
    try {
        await student.save();
        res.send({ success: true, student });
    } catch (error) {
        res.status(500).send(error);
    }
})

module.exports = router;