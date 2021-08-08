const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const {nanoid} = require("nanoid");
const config = require("../config");
const Artist = require("../models/Artist");
const Album = require("../models/Album"); 
const Track = require("../models/Track"); 


const checkUnusedFiles = async (Model, modelDir) => {
        const dir = path.join(config.uploadPath, modelDir);
        fs.readdir(dir, (err, files) => {
            files.forEach(async (file) => {
                const rows = await Model.find({image: file}).countDocuments();
                if (rows === 0) { 
                    const fileName = dir + '/' + file;
                    if (fs.existsSync(fileName)) {
                        fs.unlinkSync(fileName);
                    }
                }
            });
        })
}


const checkUnusedFilesAllModels = () => {
    checkUnusedFiles(Artist, "artists");
    checkUnusedFiles(Album, "albums");
    checkUnusedFiles(Track, "tracks");
    console.log("Cleanup of unused files completed");
}

const opts = { runValidators: true };

module.exports = {checkUnusedFiles, checkUnusedFilesAllModels, opts};