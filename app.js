const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');
mongoose.connect('mongodb://localhost:27017/wiki');
app.use(bodyParser.urlencoded({extended: true}));

const articleSchema = new mongoose.Schema({
  title: String,
  content: String
});

const Article = mongoose.model('Article', articleSchema);

// All the methods here are using 'query' as a selector because the requests
// were sent through postman and it's easier to use it with queries

//Using ROUTE, chained methods
// Accessing all the articles
app.route('/articles')
.get((req, res) => {
  Article.find({}, (err, data) => {
    if(!err){
      res.send(data);
    }
    else{
      res.send(err);
    }
  });
})
.post((req, res) => {
  Article.create({
    title: req.query.title,
    content: req.query.content
  }, (err) =>{
    if(err){
      res.send(err);
    }
    else{
      res.send('added successfully');
    }
  });
})
.delete((req, res) => {
  Article.deleteMany((err) => {
    if(!err){
      res.send('deleted successfully');
    }
    else{
      console.log(err);
    }
  });
});

// Accessing a specific article
app.route('/articles/:articleTitle')
.get((req, res) => {
  const title = req.params.articleTitle;
  Article.findOne({title: title}, (err, data) => {
    if(!err && data){
    res.send(data);
    }
    else{
      res.send('No matches found');
    }
  });
})
// All the resources say to use PUT when updating an entire document and PATCH when updating just some parts of it
// but I dont really get it because I can update jsut one property using PUT as well as by using PATCH so...
// It just doesnt delete every property for which i provided no data in the request and only updates the ones I did
// provide for so idk
// BUT Some guy on Udemy said that it's not about the code but about the principles of a RESTful API so it's just to keep it clean
// Use PUT to update some properties and PATCH when updating a whole document
.put((req, res) =>{
  Article.updateOne(
    {title: req.query.title},                             // condition
    {title: req.query.title, content: req.query.content}, //new values
    (err) => {                                            // callback
      if(!err){
        res.send('successfully updated');
      }
      else{
        console.log(err);
      }
    }
  );
})
.patch((req, res) => {
  Article.updateOne(
    {title: req.query.title,              // condition
    $set: req.query},                    // setting new value
    (err) =>{                             // callback
      if (!err){
        res.send('successfully updated');
      }
    }
  )
})
.delete((req, res) => {
  Article.deleteOne({title: req.query.title}, (err) => {
    if(!err){
      res.send('successfully deleted');
    }
  });
});

app.listen(3000, (req, res) => {
  console.log('server up');
});
