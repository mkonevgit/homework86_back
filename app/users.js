const express = require("express");
const User = require("../models/User");
const bcrypt = require("bcrypt");

const router = express.Router();

const createRouter = () => {
    router.get('/', async (req, res) => {
        try {
            const users = await User.find({});
            res.send(users);
        } catch (error) {
            res.status(500).send(error);
        }
    });
    router.post('/', async (req, res) => {
        try {
            const user = new User(req.body);
            user.generateToken();
            await user.save();
            res.send(user);
        } catch (error) {
            res.status(400).send(error);
            
        }
    });

    router.post('/sessions', async (req, res) => {
        const user = await User.findOne({username: req.body.username});
        const errorMessage = "Wrong username or password";
        if (!user) {
            res.status(400).send({error: errorMessage});
        } else {
            const isMatch = await user.checkPassword(req.body.password);
            if (!isMatch) {
                res.status(400).send({error: errorMessage});
            } else {
                user.generateToken();
                await user.save({validateBeforeSave: false});
                res.status(200).send(user);
            }
        }
            
    });


    router.delete("/sessions", async (req, res) => {
        const token = req.get("Authentication");
        const success = {message: "Success"};
        if (!token) return res.send(success);
        const user = await User.findOne({token});
        if (!user) return res.send(success);
        user.generateToken();
        try {
            await user.save({ validateBeforeSave: false });
            return res.send(success);
        } catch (err) {
            res.status(500).send(err);
        }
    });


    return router;
}

module.exports = createRouter;