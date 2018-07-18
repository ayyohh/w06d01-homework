const express = require('express');
const router = express.Router();
const User = require('../models/users');
const Photo = require('../models/photos');


//Index route
router.get("/", (req, res) => {
  User.find({}, (err, foundUsers) => {
    if(err){
      console.log('error in find');
      console.log(err);
    } else {
      res.render('userViews/index.ejs', {users: foundUsers});
    }
  });
});

//New route
router.get("/new", (req, res) => {
  res.render("userViews/new.ejs", {})
});

//Create route
router.post("/", (req, res) => {
  User.create(req.body, (err, newUser) => {
    if(err){
      console.log(err, 'error in create');
      res.render("userViews/new.ejs");
    } else {
      res.redirect("/users");
    }
  });
});

//Show route
router.get("/:id", (req, res) => {
  User.findById(req.params.id, (err, user) => {
    if(err){
      console.log(err, 'error in show');
      res.send(err);
    } else {
      console.log(req.params.id);
      res.render("userViews/show.ejs", {user: user});
    }
  });
});

//Edit route
router.get("/:id/edit", (req, res) => {
  User.findById(req.params.id, (err, foundUser) => {
    if(err) {
      console.log(req.params.id, 'this is id');
      res.send(err);
    } else {
      res.render("userViews/edit.ejs", {user: foundUser});
    }
  });
});

//Update route
router.put("/:id", (req, res) => {
  User.findByIdAndUpdate(req.params.id, req.body, {new: true}, (err, user) => {
    if(err){
      console.log(err, 'error in update');
      res.send(err);
    } else {
      res.redirect("/users");
    }
  });
});
//Destroy route
router.delete("/:id", (req, res) => {
  User.findByIdAndRemove(req.params.id, (err, user) => {
    console.log(user, ' this is deleted user');

    const photoIds = [];
    for(let i = 0; i < user.photos.length; i++){
      photoIds.push(user.photos[i].id);
    }

    Photo.remove({
      _id: { $in: photoIds}
    }, (err, data) => {
      res.redirect('/users')
    });
  });
});


module.exports = router;
