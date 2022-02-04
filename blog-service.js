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
