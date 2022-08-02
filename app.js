const express = require('express');
require("./db/mongoose");
const Batches = require('./models/batches');
const attendanceRouter = require("./routers/attendance");
const seatRouter = require("./routers/seatsinfo");
const studentRouter = require("./routers/student");
const superuserRouter = require("./routers/superuser");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors({
    origin: '*'
}));

app.use(attendanceRouter);
app.use(seatRouter);
app.use(studentRouter);
app.use(superuserRouter);

app.get("/", async (req, res) => {
    const batches = await Batches.aggregate([
        {
            $unwind: "$branches"
        },
        {
            $group: {
                _id: { year: "$year" },
                totalStudents: { $sum: "$branches.totalStudentsIntake" },
                branches: { $push: { k: "$branches.name", v: "$branches.totalStudentsIntake" } }
            }
        },
        {
            $project: {
                totalStudents: 1,
                branches: { $arrayToObject: "$branches" }
            },
        },
        {
            $sort: { _id: 1 }
        }
    ]);
    res.send(batches);
});

app.listen(3000, () => {
    console.log("Server is Runnig");
})