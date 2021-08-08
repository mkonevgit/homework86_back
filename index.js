const express = require("express");
const cors = require("cors");
const artists = require("./app/artists");
const albums = require("./app/albums");
const tracks = require("./app/tracks");
const users = require("./app/users");
const tracksHistory = require("./app/trackHistory");
const app = express();
const mongoose = require("mongoose");
const {checkUnusedFilesAllModels} = require("./app/utils");

const port = 8000;

const run = async () => {
  await mongoose.connect("mongodb://localhost:27017/musicDB",
   {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: true, useCreateIndex: true}
  );

  db = mongoose.connection;

  app.use(cors());
  app.use(express.static("public")); 
  app.use(express.json());
  app.use("/artists", artists());
  app.use("/albums", albums());
  app.use("/tracks", tracks());
  app.use("/users", users());
  app.use("/tracksHistory", tracksHistory());

  app.listen(port, () => {
    console.log("Server started at http://localhost:" + port);
    //checkUnusedFilesAllModels();
  });

}

run().catch(e => {
  console.log(e);
});




