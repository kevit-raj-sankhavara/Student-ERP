const express = require('express');
const router = new express.Router();
const Superuser = require("../models/superuser");
const bcrypt = require("bcryptjs");
const auth = require('../middleware/auth');

router.post("/admin/addAdmin", async (req, res) => {
    try {
        const admin = new Superuser(req.body);
        admin.password = await bcrypt.hash(admin.password, 8);
        await admin.save();
        await admin.generateAuthToken();
        res.send({ admin });
    } catch (error) {
        res.status(400).send();
    }
})

router.post("/staff/addStaffMember", auth, async (req, res) => {
    try {
        console.log(req.user);
        if (req.user.email === "admin@admin.com") {
            const staffMember = new Superuser(req.body);
            staffMember.password = await bcrypt.hash(staffMember.password, 8);
            await staffMember.save();
            await staffMember.generateAuthToken();
            return res.send({ succes: true, staffMember });
        }
        res.status(401).send("Your are not authorized to add staff member!!");

    } catch (error) {
        res.status(400).send();
    }
})

router.post("/staff/login", async (req, res) => {
    try {
        const user = await Superuser.findByCredentials(req.body.email, req.body.password);
        const token = await user.generateAuthToken();
        res.send({ login: "success", user, token });
    } catch (error) {
        res.status(400).send("Invalid credentials");
    }
})

module.exports = router;