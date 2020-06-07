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
  //console.log(currentUser.loggedInUser);

  //create an empty array, if user is not logged-in then the data passed is
  //empty
  let friends = [];

  //before rendering the homepage, check if a user is logged in
  //and retrieve that user's lists of friends
  if (isLoggedIn) {
    friends = users.find((user) => user.name === currentUser.loggedInUser)
      .friends;

    console.log(friends);
  }

  res.status(200).render("pages/homepage", {
    users: users,
    currentUser: currentUser,
    isLoggedIn: isLoggedIn,
    friends: friends,
  });
};

const handleProfilePage = (req, res) => {
  //console.log(req.params.id);

  //return the element containing user data, if the id matches with the request
  let userPage = users.find((user) => user._id === req.params.id);
  //console.log(userPage);

  res.status(200).render("pages/profile", {
    user: userPage,
    users: users,
    currentUser: currentUser,
    isLoggedIn: isLoggedIn,
  });
  // res.status(200).send(req.params.id);
};

//render the sign in page
const handleSignin = (req, res) => {
  res.status(200).render("pages/signin", {
    currentUser: currentUser,
    isLoggedIn: isLoggedIn,
  });
};

//redirect signin page to user, when logged in
const handleName = (req, res) => {
  //the req.query returns what was inputed in the form of the sign in page
  //as GET /getname?firstName=Russel, req.query accesses the key firstname via
  //dot method
  let firstName = req.query.firstName;
  //console.log(firstName); //to help confirm the above

  //use the find method on the users data to return the object with the same
  //name entered, this will be our "login" method
  let loginName = users.find((user) => user.name === firstName);
  console.log(loginName); //check if it returns the object

  //if the user inputs a valid name that exists in our data file then it will
  //sucessfully redirect user to that profile page
  if (loginName != undefined) {
    currentUser["loggedInUser"] = `${loginName.name}`;
    isLoggedIn = true;
    res.status(200).redirect(`/users/${loginName._id}`);
  } else {
    //if the input doesnt match anything on our data file, then it will re-render
    //the page
    res.status(404).render("pages/signin");
  }
};

// ------------------------------ SIGN IN STATUSES --------------------------

//this triggers the logged in status, renders user name in the header.ejs file
let isLoggedIn = false;
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

  //
  .get("/getname", handleName)

  // a catchall endpoint that will send the 404 message.
  .get("*", handleFourOhFour)

  .listen(8000, () => console.log("Listening on port 8000"));
