const express = require("express");
const server = express();
const path = require("path");

// Settings
server.set("port", 3000);
server.set("views", path.join(__dirname, "views"));
server.engine("html", require("ejs").renderFile);
server.set("view engine", "ejs");

// Middlewares

// Routes
server.use(require("./routes/index"));

// Static files
server.use(express.static(path.join(__dirname, "public")));

// Listening the server
server.listen(server.get("port"), () => {
  console.log("Server on port", server.get("port"));
});
