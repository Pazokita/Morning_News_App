var express = require("express");
var router = express.Router();

var userModel = require("../models/users");
var articleModel = require("../models/articles");
var bcrypt = require("bcrypt");
var uid2 = require("uid2");

router.post("/sign-up", async function (req, res, next) {
  var error = [];
  var result = false;
  var saveUser = null;
  var token = null;


  const data = await userModel.findOne({
    email: req.body.emailFromFront,
  });

  if (data != null) {
    error.push("utilisateur déjà présent");
  }

  if (
    req.body.usernameFromFront == "" ||
    req.body.emailFromFront == "" ||
    req.body.passwordFromFront == ""
  ) {
    error.push("champs vides");
  }

  if (error.length == 0) {
    const hash = bcrypt.hashSync(req.body.passwordFromFront, 10);
    var newUser = new userModel({
      username: req.body.usernameFromFront,
      email: req.body.emailFromFront,
      password: hash,
      token: uid2(32),
    });

    saveUser = await newUser.save();

    if (saveUser) {
      result = true;
    }
  }

  res.json({ result, saveUser, error, token });
});

router.post("/sign-in", async function (req, res, next) {
  var result = false;
  var user = null;
  var error = [];
  var token = null;

  if (req.body.emailFromFront == "" || req.body.passwordFromFront == "") {
    error.push("champs vides");
  }

  if (error.length == 0) {
    const user = await userModel.findOne({
      email: req.body.emailFromFront,
    });

    if (user) {
      
      const hash = bcrypt.hashSync(req.body.passwordFromFront, 10);
      var password = hash;
      if (bcrypt.compareSync(req.body.passwordFromFront, user.password)) {
      
        result = true;
        token = user.token
      } else {
        result = false;
        error.push("mot de passe incorrect");
      }
    } else {
      error.push("email incorrect");
    }
  }
  res.json({ result, user, error, token });
});

router.post("/wishlist", async function (req, res, next) {
  let articlefound = await articleModel.findOne({title:req.body.titleFromFront})
  let result= false;
  if(!articlefound) {
    
    var newArticle = new articleModel({
      title: req.body.titleFromFront,
      description: req.body.descriptionFromFront,
      content: req.body.contentFromFront,
      image: req.body.imageFromFront,
    });
  
    saveArticle = await newArticle.save();
    if (saveArticle) {
      result = true;
    }
  res.json({ result, saveArticle });
  } else {
    res.json({result})
  }
 
 
});  


module.exports = router ;