"use strict";

const express = require("express");
const morgan = require("morgan");

const { users } = require("./data/users");

let currentUser = {};

// declare the 404 function
const handleFourOhFour = (req, res) => {
  res.status(404).send("I couldn't find what you're looking for.");
};

const handleHomepage = (req, res) => {
  res.status(200).render("pages/homepage", { users: users });
};

const handleProfilePage = (req, res) => {
  //console.log(req.params.id);

  //return the element containing user data, if the id matches with the request
  let userPage = users.find((user) => user._id === req.params.id);
  //console.log(userPage);

  res.status(200).render("pages/profile", { user: userPage, users: users });
  // res.status(200).send(req.params.id);
};

const handleSignin = (req, res) => {
  res.status(200).send("ok");
};

// -----------------------------------------------------
// server endpoints
express()
  .use(morgan("dev"))
  .use(express.static("public"))
  .use(express.urlencoded({ extended: false }))
  .set("view engine", "ejs")

  // endpoints

  //go to homepage
  .get("/", handleHomepage)

  //go to user page
  .get("/users/:id", handleProfilePage)

  //go to sign in page
  .get("/signin", handleSignin)

  // a catchall endpoint that will send the 404 message.
  .get("*", handleFourOhFour)

  .listen(8000, () => console.log("Listening on port 8000"));
