const express = require("express");
const multer = require("multer");
const path = require("path");
const {nanoid} = require("nanoid");
const config = require("../config");
const router = express.Router();
const Track = require("../models/Track");
const TrackHistory = require("../models/TrackHistory");
const {opts} = require("./utils");
const {auth, checkUserId, beforeTrackDelete} = require("../middleware/auth");

const storage = multer.diskStorage({
   destination: (req, file, cb) => {
      cb(null, path.join(config.uploadPath, "tracks"));
   },
   filename: (req, file, cb) => {
      cb(null, nanoid() + path.extname(file.originalname));
   }
});

const upload = multer({storage});

const createRouter = () => {

   router.get("/", auth, async (req, res, next) => {
      let tracks;
         try {
            if (req.query.album) {
               switch (req.user.role) {
                  case "admin":
                     tracks = await Track.find({album: req.query.album})
                        .sort("trackNumber");
                     break;
                  case "user":
                     tracks = await Track.find({album: req.query.album})
                        .or([{ published: true }, { user: req.user._id }])
                        .sort("trackNumber");
                     break;
                  case "anonymous":
                     tracks = await Track.find({album: req.query.album})
                        .or([{ published: true }])
                        .sort("trackNumber");
                     break;
                  default:
                     break;
               }
               res.send(tracks);
               next('route');
            } else {
               next();
            }
         } catch (error) {
            res.status(500).send(error);
         }
      },
      async (req, res) => {
         try {
            const tracks = await Track.find();
            res.send(tracks);
         } catch (error) {
            res.status(500).send(error);
         }
      });

   router.post("/", auth, upload.single("image"), checkUserId, async (req, res) => {
      const track = {...req.body};
      if (req.file) {
         track.image = req.file.filename;
      }
      const result = new Track(track);
      try {
         await result.save();
         res.send(result);
      } catch (error) {
         res.status(400).send(error);
      }
   });


   router.get("/:artist", async (req, res) => {
      try {
         await Track.find().populate({
            path: "album",
            populate: {path: 'artist'}
         })
            .exec((err, tracks) => {
               tracks = tracks.filter(track => {
                  return track.album.artist._id.equals(req.params.artist);
               });
               if (tracks) {
                  res.send(tracks);
               } else {
                  res.sendStatus(404);
               }
            });
      } catch (error) {
         res.status(500).send(error);
      }
   });


   router.put("/:id", auth, upload.single("image"), checkUserId, async (req, res) => {
      try {
         const track = {...req.body};
         if (req.file) {
            track.image = req.file.filename;
         }
         //Включение валидации на обновление записей, опция opts
         await Track.updateOne({_id: req.params.id},
            {$set: {name: track.name, album: track.album, image: track.image, duration: track.duration}}, opts);
         const updatedTrack = await Track.findById(req.params.id);
         res.send(updatedTrack);
      } catch (error) {
         res.status(500).send(error);
      }
   });


   router.put("/published/:id", async (req, res) => {
      try {
         const track = await Track.findById(req.params.id);
         if (track) {
            await Track.updateOne({_id: req.params.id}, {$set: {published: !track.published}}, opts);
            const updatedTrack = await Track.findById(req.params.id);
            res.send(updatedTrack);
         }
      } catch (error) {
         res.status(400).send(error);
      }
   });


   router.delete("/:id", auth, beforeTrackDelete, async (req, res) => {
      try {
         const deletedTrack = await Track.deleteOne({_id: req.params.id});
         res.send(deletedTrack);
      } catch (error) {
         res.status(500).send(error);
      }
   });

   return router;
};


module.exports = createRouter;