const express=require("express");
const bodyParser=require("body-parser");
const path=require("path");
const { title } = require("process");
const _ =require("lodash")
const mongoose = require('mongoose');

const app=express()

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname, '/public')))
app.set('view engine', 'ejs');

// MongoDB connecction
mongoose.connect('mongodb://localhost/blogDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });

const postSchema= new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    post:String
})

const Post = mongoose.model("Post", postSchema);




// MongoDB ends here

const homecontent="HOME Lorem ipsum dolor sit amet consectetur adipisicing elit. Rem quidem inventore assumenda et. Deleniti dolorum atque eligendi ipsam quisquam voluptate harum officiis esse commodi. HOME Lorem ipsum dolor sit amet consectetur adipisicing elit. Rem quidem inventore assumenda et. Deleniti dolorum atque eligendi ipsam quisquam voluptate harum officiis esse commodi. Rem quidem inventore assumenda et. Deleniti dolorum atque eligendi ipsam quisquam voluptate harum officiis esse commodi. Rem quidem inventore assumenda et. Deleniti dolorum atque eligendi ipsam quisquam voluptate harum officiis esse commodi. "

const aboutcontent="ABOUT Lorem ipsum dolor sit amet consectetur adipisicing elit. Rem quidem inventore assumenda et. Deleniti dolorum atque eligendi ipsam quisquam voluptate harum officiis esse commodi."

const contactcontent="CONTACT Lorem ipsum dolor sit amet consectetur adipisicing elit. Rem quidem inventore assumenda et. Deleniti dolorum atque eligendi ipsam quisquam voluptate harum officiis esse commodi."

let posts=[];

app.listen(3000,function(req,res){
    console.log("Server started at port 3000")
})


app.get("/",async function(req,res){
    // res.render("index",{homecont:homecontent,posts:posts})   
    try {
        const posts = await Post.find({});
        res.render("index", {
          homecont: homecontent,
          posts: posts
        });
      } catch (err) {
        // Handle the error
        console.error(err);
        res.status(500).send("Internal Server Error");
      }
    

})

app.get("/about",function(req,res){
    res.render("about",{aboutcont:aboutcontent})
})

app.get("/contact",function(req,res){
    res.render("contact",{contactcont:contactcontent})
})

app.get("/compose",function(req,res){
    res.render("compose",{contactcont:contactcontent})
})

app.post("/compose",async function(req,res){
    
    const post= new Post({
        title:req.body.titlename,
        post:req.body.publishname
    })



    // posts.push(post)
    // res.redirect("/")
    try {
        await post.save();
        res.redirect("/");
      } catch (err) {
        // Handle the error
        console.error(err);
        res.status(500).send("Internal Server Error");
      }
    
})

app.get("/post/:postname",async function(req,res){
    // const reqtitleurlname=_.lowerCase(req.params.postname);
    const reqtitleurlname=req.params.postname;

    const curday=new Date().toLocaleString()

    // posts.forEach(function(title){
    //     const storedtitlename=_.lowerCase(title.title)
    //     if(reqtitleurlname===storedtitlename){
    //         res.render("publish",{finaltitle:title.title,finalblog:title.post,curday:curday})
        
    //     }else{
    //         console.log("Not found")
            
    //     }
    // })

    // const requestedPostId = req.params.postId;

  try {
    const post = await Post.findOne({ _id: reqtitleurlname });
    res.render("publish", {
      finaltitle: post.title,
      finalblog: post.post,
      curday:curday

    
    });
  } catch (err) {
    // Handle the error
    console.error(err);
    res.status(500).send("Internal Server Error");
  }


})

app.post("/post/:postname",async function(req,res){
  const reqtitleurlname=req.params.postname;
  try {
    const post = await Post.deleteOne({ _id: reqtitleurlname });
    // res.render("publish", {
    //   finaltitle: post.title,
    //   finalblog: post.post,
    //   curday:curday
    console.log("Deleted id = " + reqtitleurlname)
    res.redirect("/")

    // });
  } catch (err) {
    // Handle the error
    console.error(err);
    res.status(500).send("Internal Server Error");
  }



})

