const fs = require("fs");

var posts =[];
var categories = [];

module.exports.initialize = function()
{
    return new Promise((resolve, reject)=>{
        var errCode = 0;
        fs.readFile("./data/posts.json", "utf-8", (err, data)=>{
            if (err) errCode++;
            else{
                posts = JSON.parse(data);
            }
        })
        fs.readFile("./data/categories.json", "utf-8", (err, data)=>{
            if (err) errCode++;
            else{
                categories = JSON.parse(data);
            }
        })
        if (!errCode)
        {
            resolve("Reading files successfully completed");
        }
        else{
            reject("Unable to read file");
        }
    })
}

module.exports.getAllPosts = function()
{
    return new Promise((resolve,reject)=>{
        if (posts.length == 0)
        {
            reject("Failed to retrieve posts data");
        }
        else{
        resolve(posts);
        }
    })
}

module.exports.publishedPosts = function()
{
    return new Promise((resolve,reject)=>{
        var arr = posts.filter(x=>x.published == true);
        if (arr.length == 0)
        {
            reject("No results returned");
        }
        else{
            resolve(arr);
        }
    })
}

module.exports.getCategories = function()
{
    return new Promise((resolve,reject)=>{
        if (categories.length == 0)
        {
            reject("Failed to retrieve categories data");
        }
        else
        {
            resolve(categories);
        }
    })
}

module.exports.addPost = function(postData)
{
    return new Promise((resolve, reject)=>{
        if (postData.published == undefined)
        {
            postData.published = false;
        }
        else{
            postData.published = true;
        }
        postData.id = posts.length + 1;
        postData.postDate = new Date().toISOString().slice(0,10);
        posts.push(postData);
        resolve(postData);
    })
}

module.exports.getPostsByCategory = function(category)
{
    return new Promise((resolve,reject)=>{
        var newArray = posts.filter(x=>x.category == category);
        if (newArray.length == 0)
        {
            reject("No result returned");
        }
        else{
            resolve(newArray);
        }
    })
}

module.exports.getPostsByMinDate = function(minDateStr)
{
    return new Promise((resolve, reject)=>{
        var newArray = posts.filter(x=>new Date(x.postDate) >= new Date(minDateStr));
        if (newArray.length == 0)
        {
            reject("No result returned");
        }
        else{
            resolve(newArray);
        }
    })
}

module.exports.getPostById = function(id)
{
    return new Promise((resolve, reject)=>{
        var found = false;
        var matchedPost;
        for (i = 0; i < posts.length; i++)
        {
            if (posts[i].id == id)
            {
                matchedPost = posts[i];
                found = true;
            }
        }
        if(found)
        {
            resolve(matchedPost);
        }
        else{
            reject("No result returned");
        }
    })
}

module.exports.getPublishedPostsByCategory = function(category)
{
    return new Promise((resolve,reject)=>{
        var arr = posts.filter(x=>x.published == true && x.category == category);
        if (arr.length == 0)
        {
            reject("No results returned");
        }
        else{
            resolve(arr);
        }
    })
}