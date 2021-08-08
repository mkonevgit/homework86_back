const User = require("../models/User");
const TrackHistory = require("../models/TrackHistory");
const Artist = require("../models/Artist");
const Album = require("../models/Album");
const Track = require("../models/Track");

const auth = async (req, res, next) => {
   const token = req.get("Authentication");
   if (!token) {
      return res.status(401).send({error: "No token presented"});
   }
   if (token === "anonymous") {
      const user = {username: "anonymous", role: "anonymous"};
      req.user = user;
      next();
   }
   const user = await User.findOne({token});
   if (!user) {
      return res.status(401).send({error: "Wrong token"});
   }
   req.user = user;
   next();
};


const checkUserId = async (req, res, next) => {

   if (!req.body.user) {
      return res.status(401).send({error: "User id must be in request"});
   }
   if (req.user._id.equals(req.body.user)) {
      next();
   } else {
      res.status(401).send({error: "Wrong user id in request"});
   }
}

const beforeTrackHistoryDelete = async (req, res, next) => {
   try {
      const trackHistory = await TrackHistory.findById(req.params.id);
      if (!req.user._id.equals(trackHistory.user._id) && req.user.role !== "admin") {
         res.status(401).send({error: "Wrong delete track history id"});
      } else {
         next();
      }
   } catch (error) {
      res.status(500).send(error);
   }
}

const beforeTrackDelete = async (req, res, next) => {
   try {
      const track = await Track.findById(req.params.id);
      const tracksHistoryCount = await TrackHistory.find({track: req.params.id}).countDocuments();
      if (!req.user._id.equals(track.user._id) && req.user.role !== "admin") {
         res.status(401).send({error: "Wrong delete track id"});
         //Запрещение удаления записи, если на нее есть ссылки в дочерней таблице
      } else if (tracksHistoryCount > 0) {
         res.status(400).send("This track has tracks history references. Deletion restricted.");
         //Запрещение удаления документа, если он опубликован
      } else if (track.published) {
         res.status(400).send("This document has published. Deletion restricted. Unpublish it.");
      } else {
         next();
      }
   } catch (error) {
      res.status(500).send(error);
   }
}


const beforeArtistDelete = async (req, res, next) => {
   try {
      const albumsCount = await Album.find({artist: req.params.id}).countDocuments();
      const artist = await Artist.findById(req.params.id);
      if (!req.user._id.equals(artist.user._id) && req.user.role !== "admin") {
         res.status(401).send({error: "Wrong delete artist id"});
         //Запрещение удаления записи, если на нее есть ссылки в дочерней таблице
      } else if (albumsCount > 0) {
         res.status(400).send("This document has albums references. Deletion restricted.");
         //Запрещение удаления документа, если он опубликован
      } else if (artist.published) {
         res.status(400).send("This document has published. Deletion restricted. Unpublish it.");
      } else {
         next();
      }
   } catch (error) {
      res.status(500).send(error);
   }
}


const beforeAlbumDelete = async (req, res, next) => {
   try {
      const tracksCount = await Track.find({album: req.params.id}).countDocuments();
      const album = await Album.findById(req.params.id);
      if (!req.user._id.equals(album.user._id) && req.user.role !== "admin") {
         res.status(401).send({error: "Wrong delete album id. "});
         //Запрещение удаления записи, если на нее есть ссылки в дочерней таблице
      } else if (tracksCount > 0) {
         res.status(400).send("This album has tracks references. Deletion restricted.");
         //Запрещение удаления документа, если он опубликован
      } else if (album.published) {
         res.status(400).send("This document has published. Deletion restricted. Unpublish it.");
      } else {
         next();
      }
   } catch (error) {
      res.status(500).send(error);
   }
}

module.exports = {
   auth,
   checkUserId,
   beforeTrackHistoryDelete,
   beforeTrackDelete,
   beforeArtistDelete,
   beforeAlbumDelete
};
