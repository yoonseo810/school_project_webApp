/*********************************************************************************
* WEB322 – Assignment 05
* I declare that this assignment is my own work in accordance with Seneca Academic Policy. No part 
* of this assignment has been copied manually or electronically from any other source 
* (including 3rd party web sites) or distributed to other students.
* 
* Name: YoonSeong(Michael) Seo Student ID: 120299219 Date: Mar 23rd, 2022
*
* Online (Heroku) Link: https://ancient-escarpment-56733.herokuapp.com/
*
********************************************************************************/

var express = require("express");
var app = express();
var path = require("path");
var blogService = require("./blog-service.js");
var exphbs = require("express-handlebars");
const multer = require("multer");
const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');
const upload = multer();
const stripJs = require('strip-js');
var HTTP_PORT = process.env.PORT || 8080;


app.use(express.static('public'));

app.engine(".hbs", exphbs.engine({
    extname: ".hbs",
    helpers: {
        navLink: function(url, options){
            return '<li' +
            ((url == app.locals.activeRoute) ? ' class="active" ' : '') +
            '><a href="' + url + '">' + options.fn(this) + '</a></li>';
        },
        equal: function (lvalue, rvalue, options) {
            if (arguments.length < 3)
            throw new Error("Handlebars Helper equal needs 2 parameters");
            if (lvalue != rvalue) {
            return options.inverse(this);
            } else {
            return options.fn(this);
            }
        },
        safeHTML: function(context){
            return stripJs(context);
        },
        formatDate: function(dateObj){
            let year = dateObj.getFullYear();
            let month = (dateObj.getMonth() + 1).toString();
            let day = dateObj.getDate().toString();
            return `${year}-${month.padStart(2, '0')}-${day.padStart(2,'0')}`;
        }
    }
}));

app.set("view engine", ".hbs");

cloudinary.config({
    cloud_name: 'ysseo-seneca-web',
    api_key: '211544157858979',
    api_secret: 'rTHvcc4hdVt9b3GQkMJzaoDen2w',
    secure: true
});

app.use(express.urlencoded({extended: true}));

app.use(function(req,res,next){
    let route = req.path.substring(1);
    app.locals.activeRoute = "/" + (isNaN(route.split('/')[1]) ? route.replace(/\/(?!.*)/, "") : route.replace(/\/(.*)/, ""));
    app.locals.viewingCategory = req.query.category;
    next();
   });


app.get("/", function (req, res) {
    res.redirect("/blog");
})

app.get("/about", function (req, res) {
    res.render("about")
})

app.get('/blog', async (req, res) => {

    // Declare an object to store properties for the view
    let viewData = {};

    try{

        // declare empty array to hold "post" objects
        let posts = [];

        // if there's a "category" query, filter the returned posts by category
        if(req.query.category){
            // Obtain the published "posts" by category
            posts = await blogService.getPublishedPostsByCategory(req.query.category);
        }else{
            // Obtain the published "posts"
            posts = await blogService.publishedPosts();
        }

        // sort the published posts by postDate
        posts.sort((a,b) => new Date(b.postDate) - new Date(a.postDate));

        // get the latest post from the front of the list (element 0)
        let post = posts[0]; 

        // store the "posts" and "post" data in the viewData object (to be passed to the view)
        viewData.posts = posts;
        viewData.post = post;

    }catch(err){
        viewData.message = "no results";
    }

    try{
        // Obtain the full list of "categories"
        let categories = await blogService.getCategories();

        // store the "categories" data in the viewData object (to be passed to the view)
        viewData.categories = categories;
    }catch(err){
        viewData.categoriesMessage = "no results"
    }

    // render the "blog" view with all of the data (viewData)
    res.render("blog", {data: viewData})
});


app.get('/blog/:id', async (req, res) => {

    // Declare an object to store properties for the view
    let viewData = {};

    try{

        // declare empty array to hold "post" objects
        let posts = [];

        // if there's a "category" query, filter the returned posts by category
        if(req.query.category){
            // Obtain the published "posts" by category
            posts = await blogService.getPublishedPostsByCategory(req.query.category);
        }else{
            // Obtain the published "posts"
            posts = await blogService.publishedPosts();
        }

        // sort the published posts by postDate
        posts.sort((a,b) => new Date(b.postDate) - new Date(a.postDate));

        // store the "posts" and "post" data in the viewData object (to be passed to the view)
        viewData.posts = posts;

    }catch(err){
        viewData.message = "no results";
    }

    try{
        // Obtain the post by "id"
        viewData.post = await blogService.getPostById(req.params.id);
    }catch(err){
        viewData.message = "no results"; 
    }

    try{
        // Obtain the full list of "categories"
        let categories = await blogService.getCategories();

        // store the "categories" data in the viewData object (to be passed to the view)
        viewData.categories = categories;
    }catch(err){
        viewData.categoriesMessage = "no results"
    }

    // render the "blog" view with all of the data (viewData)
    //console.log(viewData.post);
    res.render("blog", {data: viewData})
});


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
            if (data.length > 0)
            {
                res.render("posts", {
                    posts: data
                });
            }
            else{
                res.render("posts",{
                    message: "no results"
                });
            }
        }).catch(err => {
            res.render("posts", {
                message: "no results"
            });
        });
    }
    else if (req.query.minDate)
    {
        blogService.getPostsByMinDate(req.query.minDate).then(data => {
            if (data.length > 0)
            {
                res.render("posts", {
                    posts: data
                });
            }
            else{
                res.render("posts", {
                    message: "no results"
                });
            }
            // res.render("posts",{
            //     posts: data
            // });
        }).catch(err => {
            res.render("posts", {
                message: "no results"
            });
        });
    }
    else{

        blogService.getAllPosts().then(data => {
            if (data.length > 0)
            {
                res.render("posts", {
                    posts: data
                });
            }
            else{
                res.render("posts", {
                    message: "no results"
                });
            }
        }).catch(err => {
            res.render("posts", {
                message: "no results"
            });
        });
    }
})

app.get("/categories", (req, res) => {
    blogService.getCategories().then(data => {
        if (data.length > 0)
        {
            res.render("categories", {
                categories: data
            });
        }
        else{
            res.render("categories", {
                message: "no results"
            });
        }
    }).catch(err => {
        res.render("categories",{
            message: "no results"
        });
    })
})

app.get("/posts/add", (req, res) => {
    //res.render("addPost")
    blogService.getCategories().then(data=>{
        res.render("addPost",{categories: data});
    }).catch(err=>{
        res.render("addPost", {categories: []});
    });
})

app.get("/categories/add", (req,res)=>{
    res.render("addCategory")
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
        blogService.addPost(req.body).then(()=>{
            res.redirect("/posts");
        }).catch(err=>{
            console.log(err);
        })
        //res.redirect("/posts");
    };
})

app.post("/categories/add", (req, res)=>{
    blogService.addCategory(req.body).then(()=>{
        res.redirect("/categories");
    }).catch(err=>{
        console.log(err);
    })
})

app.get("/categories/delete/:id", (req, res)=>{
    blogService.deleteCategoryById(req.params.id).then(()=>{
        res.redirect("/categories");
    }).catch(err=>{
        res.status(500).json({message: "Unable to Remove Category / Category not found"});
    })
})

app.get("/posts/delete/:id", (req, res)=>{
    blogService.deletePostById(req.params.id).then(()=>{
        res.redirect("/posts");
    }).catch(err=>{
        res.status(500).json({message: "Unable to Remove Post / Post not found"});
    })
})

app.use((req, res) => {
    res.status(404).render("404");
})

blogService.initialize().then(() => {
    app.listen(HTTP_PORT, function () {
        console.log(`Express http server listening on ${HTTP_PORT}`);
    })
}).catch(err => {
    console.log(err);
})