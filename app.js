const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/articlesDB', {useNewUrlParser: true, useUnifiedTopology: true});

const app = express();

const articleSchema = mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Title is required.']
    },
    content: {
        type: String,
        required: [true, 'Content is required.']
    }
});

const Article = mongoose.model('Article', articleSchema);

app.use(bodyParser.urlencoded({extended: true}));

app.listen(3000, () => {
    console.log('Server start');
})

app.route('/article')

    .get((req, res) => {
        Article.find({}, (error, articles) => {
            console.log('Articles : ', articles);
            console.log('error : ', error);
            if(error) {
                res.send(error);
            } else {
                res.send(articles);
            }
        });
    })

    .post((req, res) => {
        console.log(req.body);
        const article = new Article({
            title: req.body.title,
            content: req.body.content
        });

        article.save((error, articleObj) => {
            if(error){
                res.send(error);
            } else{
                res.send(articleObj)
            }
        });
    })

    .delete((req, res) => {
        Article.deleteMany({}, (error, result) => {
            if(error) {
                res.send(error);
            } else {
                res.send({count: result.deletedCount})
            }
        });    
    });

app.route('/article/:articleTitle')

    .get((req, res) => {
        console.log('Article title : ', req.params.articleTitle);
        Article.findOne({title: req.params.articleTitle}, (error, article) => {
            if (error) {
                res.send(error);
            } else {
                if (article) {
                    res.send(article);
                } else {
                    res.send('Article not found!!!');
                }
            }
        })
    })

    .put((req, res) => {
        Article.update(
            {title: req.params.articleTitle},
            {
                title: req.body.title,
                content: req.body.content
            }, 
            {overwrite: false},
            (error, updatedArticle) => {
                if(error){
                    res.send(error);
                } else {
                    res.send(updatedArticle);
                }
            }
            );
    })

    .patch((req, res) => {
        console.log('article patch object: ', req.body);
        Article.updateOne(
            {title: req.params.articleTitle},
            {$set: req.body},
            (error, article) => {
                if (error) {
                    res.send(error);
                } else {
                    res.send(article);
                }
            }
        );
    })

    .delete((req, res) => {
        Article.deleteOne({title: req.params.articleTitle}, (error) => {
            if(error) {
                res.send(error);
            } else {
                res.send('Sucessfull delete the article ' + req.params.articleTitle);
            }
        });
    });

