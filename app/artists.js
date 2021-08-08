const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const {nanoid} = require("nanoid");
const config = require("../config");
const Artist = require("../models/Artist");
const Album = require("../models/Album");
const {opts} = require("./utils");
const {auth, checkUserId, beforeArtistDelete} = require("../middleware/auth");

const storage = multer.diskStorage({
   destination: (req, file, cb) => {
      cb(null, path.join(config.uploadPath, "artists"));
   },
   filename: (req, file, cb) => {
      cb(null, nanoid() + path.extname(file.originalname));
   }
});
const upload = multer({storage});


const createRouter = () => {
   router.get('/hello', async (req, res) => {
      res.status(200).send("Hello World!");
   });

   router.get('/', auth, async (req, res) => {
      let artists;
      try {
         switch (req.user.role) {
             case "admin":
                artists = await Artist.find();
                 break;
            case "user":
               artists = await Artist.find().or([{ published: true }, { user: req.user._id }]);
               break;
            case "anonymous":
               artists = await Artist.find({ published: true });
               break;
             default:
                 break;
         }
         res.send(artists);
      } catch (error) {
         console.log(error);
         res.sendStatus(500);
      }
   });


   router.post('/', auth, upload.single("image"), checkUserId, async (req, res) => {
      const artist = new Artist(req.body);
      if (req.file) {
         artist.image = req.file.filename;
      }
      try {
         await artist.save();
         res.send(artist);
      } catch (error) {
         res.status(400).send(error);
      }
   });

   // router.put("/published", async (req, res) => {
   //     try {
   //         //Добавление поля published в существующую коллекцию
   //         await Artist.updateMany({ $set: { published: true } });
   //         const updatedArtists = await Artist.find();
   //         res.send(updatedArtists);
   //     } catch (error) {
   //         res.status(500).send(error);
   //     }
   // });
   //
   // router.put("/user", async (req, res) => {
   //     try {
   //         //Добавление поля user в существующую коллекцию
   //         await Artist.updateMany({ $set: { user: "608fdd7d4c61ed0decad0ce7"} });
   //         const updatedArtists = await Artist.find();
   //         res.send(updatedArtists);
   //     } catch (error) {
   //         res.status(500).send(error);
   //     }
   // });


   router.put("/:id", auth, upload.single("image"), checkUserId, async (req, res) => {
      try {
         const artist = {...req.body};
         if (req.file) {
            artist.image = req.file.filename;
         }
         //Включение валидации на обновление записей, опция opts
         await Artist.updateOne({_id: req.params.id}, {
            $set: {
               name: artist.name,
               image: artist.image,
               info: artist.info
            }
         }, opts);
         const updatedArtist = await Artist.findById(req.params.id);
         res.send(updatedArtist);
      } catch (error) {
         res.status(500).send(error);
      }
   });

   router.put("/published/:id", async (req, res) => {
      try {
         const artist = await Artist.findById(req.params.id);
         if (artist) {
            await Artist.updateOne({_id: req.params.id}, {$set: {published: !artist.published}}, opts);
            const updatedArtist = await Artist.findById(req.params.id);
            res.send(updatedArtist);
         }
      } catch (error) {
         res.status(400).send(error);
      }
   });

   router.delete("/:id", auth, beforeArtistDelete, async (req, res) => {
      try {
         const deletedArtist = await Artist.deleteOne({_id: req.params.id});
         res.send(deletedArtist);
      } catch (error) {
         res.status(500).send(error);
      }
   });

   return router;
};

module.exports = createRouter;