const express = require('express');
const router = express.Router();
// Require the model
const Photo = require('../models/photos');
const User  = require('../models/users');

router.get('/', (req, res)=>{
  Photo.find({}, (err, foundPhotos)=>{
    res.render('photoViews/index.ejs', {
      photos: foundPhotos
    });
  })
});

router.get('/new', (req, res)=>{
  User.find({}, (err, allUsers) => {
    res.render('photoViews/new.ejs', {
      users: allUsers
    });
  });
});

//avoid this handling /new by placing it towards the bottom of the file

// Display the Author with a Link on the Article show page

router.get('/:id', (req, res)=>{
  Photo.findById(req.params.id, (err, foundPhoto)=>{
    // WE need to find The author of the article
    User.findOne({'photos._id': req.params.id}, (err, foundUser) =>{

       res.render('photoViews/show.ejs', {
          photo: foundPhoto,
          user: foundUser
        });
    });
  });
});

router.get('/:id/edit', (req, res) => {

  Photo.findById(req.params.id, (err, foundPhoto) => {
    // Find all the authors, so we can select them in the drop down menu
    // when we are editing
    User.find({}, (err, allUsers) => {

      // Then we need to find THe author the article is by
      User.findOne({'photos._id': req.params.id}, (err, foundPhotoUser) => {

            res.render('photoViews/edit.ejs', {
              photo: foundPhoto,
              users: allUsers,
              photoUser: foundPhotoUser
            });
      });
    });
  });
});


router.post('/', (req, res)=>{
  // Create a new Article , Push a copy into the Authors article's array
  User.findById(req.body.userId, (err, foundUser) => {

    // foundAuthor is the document, with author's articles array

    Photo.create(req.body, (err, createdPhoto)=>{
      foundUser.photos.push(createdPhoto);
      foundUser.save((err, data) => {
        res.redirect('/photos');
      });
    });
  });
});


router.delete('/:id', (req, res)=>{
  Photo.findByIdAndRemove(req.params.id, (err, foundPhoto)=>{
    // Finding the author with that article
    User.findOne({'photos._id': req.params.id}, (err, foundUser) => {

      // Finding the article in the authors array and removing it
      foundUser.photos.id(req.params.id).remove();
      foundUser.save((err, data) => {
        res.redirect('/photos');
      });
    });
  });
});

// UPDATE AND ARTICLE WE ALL WANT TO UPDATE THE AUTHORS ARTICLES LIST
router.put('/:id', (req, res)=>{
  Photo.findByIdAndUpdate(req.params.id, req.body, {new: true},(err, updatedPhoto)=>{

    // Find the author with that article
    User.findOne({'photos._id': req.params.id}, (err, foundUser) => {

        /// Saying there is a new author
      if(foundUser._id.toString() !== req.body.userId){
        // removing that article from the old author and then saving it
         foundUser.photos.id(req.params.id).remove();
         foundUser.save((err, savedFoundUser) => {
            // Find the new author and and the article to thier array
            User.findById(req.body.userId, (err, newUser) => {
              newUser.photos.push(updatedPhoto);
              newUser.save((err, savedFoundUser) => {
                 res.redirect('/photos');
              })
            })
         });

      } else {
          // If the author is the same as it was before
           // first find the article and removing, req.params.id = articles id
          foundUser.photo.id(req.params.id).remove();
          foundUser.photo.push(updatedPhoto);
          foundUser.save((err, data) => {
              res.redirect('/photos');
            });
      }
    });
  });
});




module.exports = router;
