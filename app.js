//jshint esversion:6
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const app = express();
app.use(express.static("partials"))
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/userDB", {useNewUrlParser: true});
const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    comments: String
});
const User = new mongoose.model("User", userSchema);
app.get("/", function(req,res){
    res.render("home");
});
app.get("/login", function(req,res){
    res.render("login");
});
app.get("/register",function(req,res){
    res.render("register");
});
app.get("/comments", function(req, res){
    res.render("comments");
});
app.get("/logout", function(req, res){
    res.render("home");
});
app.post("/register", function(req,res){
    bcrypt.hash(req.body.password, saltRounds, function(err, hash){
        const newUser = new User({
            name: req.body.name,
            email: req.body.email,
            password: hash
        });
        newUser.save(function(err){
            if(err){
                console.log(err);
            }else{
                res.render("slam");
            }
        });
    });
});
app.post("/login", function(req,res){
    const email = req.body.email;
    const password = req.body.password;
    User.findOne({email: email}, function(err, foundUser){
        if(err){
            console.log(err);
        } else {
            if (foundUser){
                bcrypt.compare(password, foundUser.password, function(err, result){
                    if(result === true){
                        res.render("slam");
                    }
                });
            }
        }
    });
});
app.post("/submit", function(req,res){
    res.render("slam");
    alert("Memories posted successfully!");
});
app.post("/logout", function(req,res){
    res.render("home");
})
app.listen(3000, function(req,res){
    console.log("site started working");
});
