/*********************************************************************************
* WEB322 – Assignment 02
* I declare that this assignment is my own work in accordance with Seneca Academic Policy. No part 
* of this assignment has been copied manually or electronically from any other source 
* (including 3rd party web sites) or distributed to other students.
* 
* Name: YoonSeong(Michael) Seo Student ID: 120299219 Date: Feb 4th, 2022
*
* Online (Heroku) Link: https://ancient-escarpment-56733.herokuapp.com/
*
********************************************************************************/

var express = require("express");
var app = express();
var path = require("path");
var blogService = require("./blog-service.js");
const multer = require("multer");
const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');
const upload = multer();
var HTTP_PORT = process.env.PORT || 8080;

app.use(express.static('public'));

cloudinary.config({
    cloud_name: 'ysseo-seneca-web',
    api_key: '211544157858979',
    api_secret: 'rTHvcc4hdVt9b3GQkMJzaoDen2w',
    secure: true
});

app.get("/", function (req, res) {
    res.redirect("/about");
})

app.get("/about", function (req, res) {
    res.sendFile(path.join(__dirname, "/views/about.html"));
})

app.get("/blog", function (req, res) {
    blogService.publishedPosts().then(data => {
        res.send(data);
    }).catch(err => {
        res.send({ message: err });
    })
})

app.get("/post/:value", (req,res)=>{
    blogService.getPostById(req.params.value).then(data=>{
        res.send(data);
    }).catch(err => {
        res.send({ message: err });
    })
})

app.get("/posts", (req, res) => {
    if (req.query.category)
    {
        blogService.getPostsByCategory(req.query.category).then(data => {
            res.send(data);
        }).catch(err => {
            res.send({ message : err });
        });
    }
    else if (req.query.minDate)
    {
        blogService.getPostsByMinDate(req.query.minDate).then(data => {
            res.send(data);
        }).catch(err => {
            res.send({ message : err });
        });
    }
    else{

        blogService.getAllPosts().then(data => {
            res.send(data);
        }).catch(err => {
            res.send({ message: err });
        });
    }
})

app.get("/categories", (req, res) => {
    blogService.getCategories().then(data => {
        res.send(data);
    }).catch(err => {
        res.send({ message: err });
    })
})

app.get("/posts/add", (req, res) => {
    res.sendFile(path.join(__dirname, "/views/addPost.html"));
})

app.post("/posts/add", upload.single("featureImage"), (req, res) => {
    if (req.file) {
        let streamUpload = (req) => {
            return new Promise((resolve, reject) => {
                let stream = cloudinary.uploader.upload_stream(
                    (error, result) => {
                        if (result) {
                            resolve(result);
                        } else {
                            reject(error);
                        }
                    }
                );
                streamifier.createReadStream(req.file.buffer).pipe(stream);
            });
        };
        async function upload(req) {
            let result = await streamUpload(req);
            console.log(result);
            return result;
        };
        upload(req).then((uploaded) => {
            processPost(uploaded.url);
        });
    } else {
        processPost("");
    }
    function processPost(imageUrl) {
        req.body.featureImage = imageUrl;
        blogService.addPost(req.body);
        res.redirect("/posts");
    };
})

app.use((req, res) => {
    res.status(404).send("ERROR: Page Not Found");
})

blogService.initialize().then(() => {
    app.listen(HTTP_PORT, function () {
        console.log(`Express http server listening on ${HTTP_PORT}`);
    })
}).catch(err => {
    console.log(err);
})