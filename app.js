require('dotenv').config()
const express=require("express");
const bodyParser=require("body-parser");
const path=require("path");
const { title } = require("process");
const _ =require("lodash")
const mongoose = require('mongoose');
const encrypt=require("mongoose-encryption")
const bcrypt=require("bcrypt")
const saltRounds=10
const session=require("express-session")
const passport=require("passport")
const passportLocalMongoose=require("passport-local-mongoose")

const app=express()

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname, '/public')))
app.use(session({
  secret: 'keyboard cat',    // secret .env file mae jayega
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}))
app.use(passport.initialize())
app.use(passport.session())
app.set('view engine', 'ejs');

// MongoDB connecction
mongoose.connect('mongodb://localhost/blogDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  // useCreateIndex :true
  
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
    post:String,
    like:{type:Number,default:0},
    currentdate:Number
})



const Post = mongoose.model("Post", postSchema);

const userSchema= new mongoose.Schema({
    email:String,
    password:String
})

userSchema.plugin(passportLocalMongoose);


// userSchema.plugin(encrypt,{secret:process.env.SECRET,encryptedFields:["password"]})

const User = mongoose.model("User", userSchema);

// CHANGE: USE "createStrategy" INSTEAD OF "authenticate"
passport.use(User.createStrategy());

// passport.serializeUser(User.serializeUser());
// passport.deserializeUser(User.deserializeUser());
passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});



// MongoDB ends here

const homecontent="HOME Lorem ipsum dolor sit amet consectetur adipisicing elit. Rem quidem inventore assumenda et. Deleniti dolorum atque eligendi ipsam quisquam voluptate harum officiis esse commodi. HOME Lorem ipsum dolor sit amet consectetur adipisicing elit. Rem quidem inventore assumenda et. Deleniti dolorum atque eligendi ipsam quisquam voluptate harum officiis esse commodi. Rem quidem inventore assumenda et. Deleniti dolorum atque eligendi ipsam quisquam voluptate harum officiis esse commodi. Rem quidem inventore assumenda et. Deleniti dolorum atque eligendi ipsam quisquam voluptate harum officiis esse commodi. "

const aboutcontent="ABOUT Lorem ipsum dolor sit amet consectetur adipisicing elit. Rem quidem inventore assumenda et. Deleniti dolorum atque eligendi ipsam quisquam voluptate harum officiis esse commodi."

const contactcontent="CONTACT Lorem ipsum dolor sit amet consectetur adipisicing elit. Rem quidem inventore assumenda et. Deleniti dolorum atque eligendi ipsam quisquam voluptate harum officiis esse commodi."

// let posts=[];

app.listen(3000,function(req,res){
    console.log("Server started at port 3000")
})


app.get("/",async function(req,res){
    // res.render("index",{homecont:homecontent,posts:posts})  

    if(req.isAuthenticated()){
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
    }
    else{
      res.redirect("/register")
    }
    
    
    
    




    // try {
    //     const posts = await Post.find({});
    //     res.render("index", {
    //       homecont: homecontent,
    //       posts: posts
    //     });
    //   } catch (err) {
    //     // Handle the error
    //     console.error(err);
    //     res.status(500).send("Internal Server Error");
    //   }
    

})

app.get("/about",function(req,res){
    res.render("about",{aboutcont:aboutcontent})
})

app.get("/contact",function(req,res){
    res.render("contact",{contactcont:contactcontent})
})
app.get("/login",function(req,res){
    res.render("login")
})
app.get("/register",function(req,res){
    res.render("register")
})

app.post("/register",async function(req,res){

  User.register({username:req.body.username},req.body.password,function(err,user){
    if(err){
      console.log(err)
      res.redirect("/register")
    }
    else{
      passport.authenticate("local")(req,res,function(){
        console.log("registered")
        res.redirect("/")
      })
    }
  })








//   bcrypt.hash(req.body.password, saltRounds, async function(err, hash) {
//     const newuser= new User({
//       email:req.body.username,
//       password:hash
//   })
//   try {
//     await newuser.save();
//     res.redirect("/register");
//   } catch (err) {
//     // Handle the error
//     console.error(err);
//     res.status(500).send("Internal Server Error");
//   }
  
  
//   })
    
// });





//   const newuser= new User({
//     email:req.body.username,
//     password:hash
// })
// try {
//   await newuser.save();
//   res.redirect("/register");
// } catch (err) {
//   // Handle the error
//   console.error(err);
//   res.status(500).send("Internal Server Error");
// }


})

app.post("/login", function(req,res){

  const user= new User({
         email:req.body.username,
         password:req.body.password
     })

     req.logIn(user,function(err){
      if(err){
        console.log(err)
      }
      else{
        passport.authenticate("local")(req,res,function(){
          res.redirect("/")
        })
      }
     })










//   const username=req.body.username
//   const password=(req.body.password)
// try {
//   const userfound=await User.find({email:username})
//   if(userfound){
//     bcrypt.compare(password, userfound[0].password, function(err, result) {
//       if(result===true)
//       res.redirect("/")
//   });
//   // if(userfound[0].password===password){
//   //   res.redirect("/")
//   // }
//   // else{
//   //   console.log("Wrong password")
//   //   res.redirect("/login")
//   // }
// }
// else{
//   res.redirect("/register")
// }
  
  
// } catch (err) {
//   // Handle the error
//   console.error(err);
//   res.status(500).send("Internal Server Error");
// }


})

app.get("/compose",function(req,res){
    res.render("compose",{contactcont:contactcontent})
})

app.post("/compose",async function(req,res){
  const curday=new Date().toLocaleString()
    
    const post= new Post({
        title:req.body.titlename,
        post:req.body.publishname,
        curday:curday
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
      curday:post.curday

    
    });
  } catch (err) {
    // Handle the error
    console.error(err);
    res.status(500).send("Internal Server Error");
  }


})

app.post("/post/:postname/btn",async function(req,res){
  const reqtitleurlname=req.params.postname;
  const btnnkaunsa =req.body
  
  
  
  
  
  try {

    if(btnnkaunsa["button"]==="del"){
    const post = await Post.deleteOne({ _id: reqtitleurlname });
    // res.render("publish", {
    //   finaltitle: post.title,
    //   finalblog: post.post,
    //   curday:curday
    console.log("Deleted id = " + reqtitleurlname)
    res.redirect("/")
    }
    else if(btnnkaunsa["button"]==="like"){
      const count=+1
      const post = await Post.updateOne({ _id: reqtitleurlname },{$inc:{like: count}});
      res.redirect("/")
      
      
    }

    
    }
    
  
    // });
  catch (err) {
    // Handle the error
    console.error(err);
    res.status(500).send("Internal Server Error");
  }



})



