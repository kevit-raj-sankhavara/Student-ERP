const mongoose = require("mongoose");

const seatScchema = new mongoose.Schema({
    batch: {
        type: Number,
        required: true
    },
    branches: [
        {
            name: {
                type: String,
                required: true
            },
            totalStudents: {
                type: Number,
                required: true
            },
            totalStudentsIntake: {
                type: Number,
                required: true
            }
        }
    ]
})

seatScchema.methods.addBranchData = async function () {
    const batch = this;
}

const Seats = mongoose.model("Seat", seatScchema);
module.exports = Seats;