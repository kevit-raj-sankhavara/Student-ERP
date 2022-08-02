const express = require('express');
const router = new express.Router();
const Seats = require('../models/seatsinfo');
const auth = require('../middleware/auth');

router.post("/seats/addSeatInfo", auth, async (req, res) => {
    try {
        let seat = await Seats.findOne({ batch: req.body.batch });

        if (seat === null) {
            seat = new Seats({ batch: req.body.batch });
            await seat.save();
        }
        const branchData = req.body.branches;
        seat.branches = seat.branches.concat(branchData);
        await seat.save();
        res.send(seat);
    } catch (error) {
        res.status(400).send(error);
    }
});

router.get("/seats/getSeatInfo", auth, async (req, res) => {
    // const start = new Date();
    const data = await Seats.aggregate([
        {
            $match: { batch: req.body.batch }
        },
        {
            $unwind: "$branches"
        },
        {
            $group: {
                _id: { batch: "$batch" },
                totalStudents: { $sum: "$branches.totalStudents" },
                totalStudentsIntake: { $sum: "$branches.totalStudentsIntake" },
                branches: {
                    $push: {
                        k: "$branches.name",
                        v: {
                            totalStudents: "$branches.totalStudents",
                            totalStudentsIntake: "$branches.totalStudentsIntake",
                            availableIntake: { $subtract: ["$branches.totalStudentsIntake", "$branches.totalStudents"] }
                        }
                    }
                }
            }
        },
        {
            $project: {
                totalStudents: 1,
                totalStudentsIntake: 1,
                availableIntake: { $subtract: ["$totalStudentsIntake", "$totalStudents"] },
                branches: { $arrayToObject: "$branches" }
            }
        }
    ])

    res.send(data);
    // res.send({ data, end: new Date() - start });
});

module.exports = router;