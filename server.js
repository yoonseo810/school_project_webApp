/*********************************************************************************
* WEB322 – Assignment 02
* I declare that this assignment is my own work in accordance with Seneca Academic Policy. No part 
* of this assignment has been copied manually or electronically from any other source 
* (including 3rd party web sites) or distributed to other students.
* 
* Name: YoonSeong(Michael) Seo Student ID: 120299219 Date: Feb 4th, 2022
*
* Online (Heroku) Link: 
*
********************************************************************************/ 

var express = require("express");
var app = express();
var path = require("path");
var blogService = require("./blog-service.js");

var HTTP_PORT = process.env.PORT || 8080;

app.use(express.static('public'));


app.get("/", function(req,res)
{
    res.redirect("/about");
})

app.get("/about", function(req,res)
{
    res.sendFile(path.join(__dirname, "/views/about.html"));
})

app.get("/blog", function(req,res)
{
    blogService.publishedPosts().then(data=>{
        res.send(data);
    }).catch(err=>{
        res.send({message: err});
    })
})

app.get("/posts", (req,res)=>{
    blogService.getAllPosts().then(data=>{
        res.send(data);
    }).catch(err=>{
        res.send({message: err});
    });
})

app.get("/categories", (req,res)=>{
    blogService.getCategories().then(data=>{
        res.send(data);
    }).catch(err=>{
        res.send({message: err});
    })
})

app.use((req,res)=>{
    res.status(404).send("ERROR: Page Not Found");
})

blogService.initialize().then(()=>{
    app.listen(HTTP_PORT, function()
    {
        console.log(`Express http server listening on ${HTTP_PORT}`);
    })
}).catch(err=>{
    console.log(err);
})