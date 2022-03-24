const Sequelize = require("sequelize");

var sequelize = new Sequelize('delvtlql40l3qg', 'amazsbuozpkeay', 'ec9362ad3252301b4487ab0b658ea76420e193bde33835346da73438183e6cbd', {
    host: 'ec2-3-219-63-251.compute-1.amazonaws.com',
    dialect: 'postgres',
    port: 5432,
    dialectOptions: {
    ssl: { rejectUnauthorized: false }
    },
    query: { raw: true }
});

var Post = sequelize.define('Post', {
    body: Sequelize.TEXT,
    title: Sequelize.STRING,
    postDate: Sequelize.DATE,
    featureImage: Sequelize.STRING,
    published: Sequelize.BOOLEAN
})

var Category = sequelize.define('Category', {
    category: Sequelize.STRING
})

Post.belongsTo(Category, {foreignKey: 'category'});


module.exports.initialize = function()
{
    return new Promise((resolve, reject)=>{
        sequelize.sync().then(()=>{
            resolve("successfully connected!");
        }).catch(err=>{
            reject("unable to sync the database");
        })
    })
}

module.exports.getAllPosts = function()
{
    return new Promise((resolve,reject)=>{
        Post.findAll().then(data=>{
            resolve(data);
        }).catch(err=>{
            reject("no results returned");
        })
    });
}

module.exports.publishedPosts = function()
{
    return new Promise((resolve,reject)=>{
       Post.findAll({
           where: {
               published: true
           }
       }).then(data=>{
           resolve(data);
       }).catch(err=>{
           reject("no results returned");
       })
    })
}

module.exports.getCategories = function()
{
    return new Promise((resolve,reject)=>{
       Category.findAll().then(data=>{
           resolve(data);
       }).catch(err=>{
           reject("no results returned");
       })
    })
}

module.exports.addPost = function(postData)
{
    return new Promise((resolve, reject)=>{
       postData.published = (postData.published) ? true : false;
       //postData.postDate = new Date();
       for (var prop in postData)
       {
           if (prop == "")
           {
               prop = null;
           }
       };
       if (postData.category == "")
       {
           postData.category = null;
       };
       postData.postDate = new Date();
       Post.create(postData).then(()=>{
           resolve();
       }).catch(err=>{
           reject("unable to create post");
       })
    })
}

module.exports.addCategory = function(catData)
{
    return new Promise((resolve, reject)=>{
        for (var prop in catData)
        {
            if (prop == "")
            {
                prop = null;
            }
        };
    Category.create(catData).then(()=>{
        resolve();
    }).catch(err=>{
        reject("unable to create category");
    })
})
}

module.exports.deleteCategoryById = function(id)
{
    return new Promise((resolve, reject)=>{
        Category.destroy({
            where: {
                id: id
            }
        }).then(()=>{
            resolve("destroyed");
        }).catch(err=>{
            reject("rejected");
        })
    })
}

module.exports.deletePostById = function(id)
{
    return new Promise((resolve, reject)=>{
        Post.destroy({
            where: {
                id: id
            }
        }).then(()=>{
            resolve("destroyed");
        }).catch(err=>{
            reject("rejected");
        })
    })
}


module.exports.getPostsByCategory = function(category)
{
    return new Promise((resolve,reject)=>{
        Post.findAll({
            where: {
                category: category
            }
        }).then(data=>{
            resolve(data);
        }).catch(err=>{
            reject("no results returned");
        })
    });
}

module.exports.getPostsByMinDate = function(minDateStr)
{
    return new Promise((resolve, reject)=>{
        const {gte} = Sequelize.Op;
        Post.findAll({
            where: {
                postDate: {
                    [gte]: new Date(minDateStr)
                }
            }
        }).then(data=>{
            resolve(data);
        }).catch(err=>{
            reject("no results returned");
        })
    })
}

module.exports.getPostById = function(id)
{
    return new Promise((resolve, reject)=>{
        Post.findAll({
            where: {
                id: id
            }
        }).then(data=>{
            resolve(data[0]);
        }).catch(err=>{
            reject("no results returned");
        })
    })
}

module.exports.getPublishedPostsByCategory = function(category)
{
    return new Promise((resolve,reject)=>{
        Post.findAll({
            where: {
                published: true,
                category: category
            }
        }).then(data=>{
            resolve(data);
        }).catch(err=>{
            reject("no results returned");
        })
    })
}