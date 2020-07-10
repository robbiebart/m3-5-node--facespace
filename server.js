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
  console.log(users);
  res
    .status(200)
    .render("pages/homepage", { users: users, myName: "Daniel", currentUser }); // what's happening here?
};
/*
render is for ejs, it looks for the ejs file. it tries to display that view. so pages/homepage 
displays homepage.ejs
second parameter is an object that you can put anything into
you can use my name in ejs file, it'll say what you tell it to be

*/

const getFriendsList = (friendIdList) => {
  return friendIdList.map((friendId) => {
    return users.find((user) => {
      return user._id === friendId;
    });
  });
};

const handleProfilePage = (req, res) => {
  const _id = req.params._id;

  let userObj = {};
  userObj = users.find((user) => {
    return user._id === _id;
  });
  let friends = getFriendsList(userObj.friends);
  // res.send(_id);
  res.render("pages/profiles", { user: userObj, friends, currentUser });
};

const handleSignin = (req, res) => {
  if (currentUser.name === undefined) {
    res.render("pages/signin", { currentUser });
  } else {
    res.redirect("/");
  }
};

const handleName = (req, res) => {
  let firstName = req.body.firstName;
  let foundUser = users.find((user) => {
    return user.name === firstName;
  });

  currentUser = foundUser;

  if (foundUser !== undefined) {
    res.status(200).redirect("/users/" + foundUser._id);
  } else {
    res.status(404).redirect("/signin");
  }
};

// -----------------------------------------------------
// server endpoints
express()
  .use(morgan("dev"))
  .use(express.static("public"))
  .use(express.urlencoded({ extended: false }))
  .set("view engine", "ejs")

  // endpoints
  .get("/", handleHomepage)

  .get("/users/:_id", handleProfilePage)

  .get("/signin", handleSignin)

  .post("/getname", handleName)
  /*
 : means a query parameter; 
 on line 44 you have ":_id"
 on line 28 you're accessing that by req.params._id
 so im setting _id to whatever the user input in the url
  */

  // a catchall endpoint that will send the 404 message.
  .get("*", handleFourOhFour)

  .listen(8000, () => console.log("Listening on port 8000"));
