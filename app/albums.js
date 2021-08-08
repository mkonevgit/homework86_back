const express = require("express");
const multer = require("multer");
const path = require("path");
const {nanoid} = require("nanoid");
const config = require("../config");
const router = express.Router();
const Album = require("../models/Album");
const Track = require("../models/Track");
const {opts} = require("./utils");
const {auth, checkUserId, beforeAlbumDelete} = require("../middleware/auth");

const storage = multer.diskStorage({
   destination: (req, file, cb) => {
      cb(null, path.join(config.uploadPath, "albums"));
   },
   filename: (req, file, cb) => {
      cb(null, nanoid() + path.extname(file.originalname));
   }
});

const upload = multer({storage});

const createRouter = () => {

   router.get("/", auth, async (req, res, next) => {
      let albums;
         try {
            if (req.query.artist) {
               switch (req.user.role) {
                  case "admin":
                     albums = await Album.find({artist: req.query.artist})
                        .sort("year");
                     break;
                  case "user":
                     albums = await Album.find({artist: req.query.artist})
                        .or([{ published: true }, { user: req.user._id }])
                        .sort("year");
                     break;
                  case "anonymous":
                     albums = await Album.find({artist: req.query.artist})
                        .or([{ published: true }])
                        .sort("year");
                     break;
                  default:
                     break;
               }
               res.send(albums);
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
            const albums = await Album.find().sort("year");
            res.send(albums);
         } catch (error) {
            res.status(500).send(error);
         }
      });

   router.post("/", auth, upload.single("image"), checkUserId, async (req, res) => {
      const album = {...req.body};
      if (req.file) {
         album.image = req.file.filename;
      }
      const result = new Album(album);
      try {
         await result.save();
         res.send(result);
      } catch (error) {
         res.status(400).send(error);
      }
   });

   router.get("/:id", async (req, res) => {
      try {
         const album = await Album.findById(req.params.id).populate("artist", "name info");
         if (album) {
            res.send(album);
         } else {
            res.sendStatus(404);
         }
      } catch (error) {
         res.status(500).send(error);
      }
   });


   router.put("/:id", auth, upload.single("image"), checkUserId, async (req, res) => {
      try {
         const album = {...req.body};
         if (req.file) {
            album.image = req.file.filename;
         }
         //Включение валидации на обновление записей, опция opts
         await Album.updateOne({_id: req.params.id}, {
            $set: {
               name: album.name,
               artist: album.artist,
               image: album.image,
               year: album.year
            }
         }, opts);
         const updatedAlbum = await Album.findById(req.params.id);
         res.send(updatedAlbum);
      } catch (error) {
         res.status(500).send(error);
      }
   });

   router.put("/published/:id", async (req, res) => {
      try {
         const album = await Album.findById(req.params.id);
         if (album) {
            await Album.updateOne({_id: req.params.id}, {$set: {published: !album.published}}, opts);
            const updatedAlbum = await Album.findById(req.params.id);
            res.send(updatedAlbum);
         }
      } catch (error) {
         res.status(400).send(error);
      }
   });

   router.delete("/:id", auth, beforeAlbumDelete, async (req, res) => {
      try {
         const deletedAlbum = await Album.deleteOne({_id: req.params.id});
         res.send(deletedAlbum);
      } catch (error) {
         res.status(500).send(error);
      }
   });

   return router;
};


module.exports = createRouter;