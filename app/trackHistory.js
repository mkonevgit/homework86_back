const express = require("express");
const router = express.Router();
const TrackHistory = require("../models/TrackHistory");
const {auth, checkUserId, beforeTrackHistoryDelete} = require("../middleware/auth");

const sortMessagesDesc = (arr) => {
   let result;
   result = arr.sort(function (a, b) {
      let timeStampA = Date.parse(a.datetime);
      let timeStampB = Date.parse(b.datetime);
      if (timeStampA < timeStampB) {
         return 1;
      }
      if (timeStampA > timeStampB) {
         return -1;
      }
      return 0;
   });
   return result;
}



const createRouter = () => {

   router.post("/", auth, checkUserId, async (req, res) => {
      const trackHistory = {...req.body};
      const result = new TrackHistory(trackHistory);
      result.user = req.user._id;
      result.datetime = (new Date()).toISOString();
      try {
         await result.save();
         res.send(result);
      } catch (error) {
         res.status(400).send(error);
      }
   });

   router.get("/", auth, async (req, res) => {
      try {
         await TrackHistory.find().
         populate({
            path: "track",
            populate: { path: "album", populate: { path: "artist" } }
         }).exec((err, TracksHistory) => {
               TracksHistory = TracksHistory.filter(TrackHistory => {
                  return TrackHistory.user._id.equals(req.user._id);
               });
               if (TracksHistory) {
                  res.send(sortMessagesDesc(TracksHistory));
               } else {
                  res.sendStatus(404);
               }
            });
      } catch (error) {
         res.status(500).send(error);
      }
   });

   router.delete("/:id", auth, beforeTrackHistoryDelete, async (req, res) => {
      try {
         const deletedTrackHistory = await TrackHistory.deleteOne({_id: req.params.id});
         res.send(deletedTrackHistory);
      } catch (error) {
         res.Status(500).send(error);
      }
   });

   router.delete("/", auth, async (req, res) => {
      try {
         const deletedTrackHistory = await TrackHistory.deleteMany({user: req.user._id});
         res.send(deletedTrackHistory);
      } catch (error) {
         res.Status(500).send(error);
      }
   });

   router.put("/:id", auth, checkUserId, async (req, res) => {
      try {
         const trackHistory = { ...req.body };
         //Включение валидации на обновление записей, опция opts
         await TrackHistory.updateOne({ _id: req.params.id },
            { $set: { user: trackHistory.user, track: trackHistory.track, datetime: trackHistory.datetime } }, opts);
         const updatedTrackHistory = await TrackHistory.findById(req.params.id);
         res.send(updatedTrackHistory);
      } catch (error) {
         res.status(500).send(error);
      }
   });


   return router;
};


module.exports = createRouter;