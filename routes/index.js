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
  var langue = null;


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
      langue: 'fr'
    });

    saveUser = await newUser.save();

    if (saveUser) {
      result = true;
      token = saveUser.token;
      langue = saveUser.langue;
    }
  }

  res.json({ result, saveUser, error, token, langue});
});

router.post("/sign-in", async function (req, res, next) {
  var result = false;
  var user = null;
  var error = [];
  var token = null;
  var langue = null;

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
        langue = user.langue
      } else {
        result = false;
        error.push("mot de passe incorrect");
      }
    } else {
      error.push("email incorrect");
    }
  }
  res.json({ result, user, error, token, langue });
});

router.post("/wishlist", async function (req, res, next) {
  let articlefound = await articleModel.findOne({title:req.body.titleFromFront, token: req.body.tokenFromFront});
  let result= false;
  console.log(articlefound);
  if(!articlefound) {
    let userFound = await userModel.findOne({token: req.body.tokenFromFront});
    console.log(userFound);
    if(userFound) {
      var newArticle = new articleModel({
        title: req.body.titleFromFront,
        description: req.body.descriptionFromFront,
        content: req.body.contentFromFront,
        urlToImage: req.body.imageFromFront,
        userId: userFound.id,
        langue: req.body.langueFromFront
      });
    
      let saveArticle = await newArticle.save();
      if (saveArticle) {
        result = true;
      }
      res.json({ result, saveArticle });
    } else {
      res.json({result})
    }
  } else {
    res.json({result})
  }
 
 
});  

router.delete("/wishlist", async function (req, res, next) {
  let userFound = await userModel.findOne({token: req.body.tokenFromFront});
  let articlefound;
  let result= false;
  if(userFound) {
    articlefound = await articleModel.findOneAndDelete({title:req.body.titleFromFront, userId: userFound.id});
    if(articlefound) {
      result = true;
    }
  }
  res.json({ result });
});  
router.get("/wishlist", async function (req, res, next) {
  let userFound = await userModel.findOne({token: req.query.tokenFromFront});
  let result= false;
  console.log('blablba')
  let articlesFind = [];
  if(userFound){
    articlesFind = await articleModel.find({userId:userFound.id, langue: req.query.languageFromFront})
    console.log(articlesFind)
    
    result = true;
      
  } 
  res.json({ result, articlesFind });
  
}
)

router.put("/language", async function (req, res, next) {
  let userFound = await userModel.findOne({token: req.body.tokenFromFront});
  let result= false;
  console.log(userFound);
  if(userFound){
    result = true;
    userFound.langue = req.body.languageFromFront;
    let userSaved = await userFound.save();
    console.log(userSaved);
  }
  res.json({ result }); 
})

module.exports = router ;