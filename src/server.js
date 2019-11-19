const express = require("express");
const bodyparser = require("body-parser");
const morgan = require("morgan");
const mongoose = require("mongoose");
const jsonParser = bodyparser.json();
const Post = require("./Post");

require("dotenv").config();

const app = express();

app.use(express.static("public"));
app.use(morgan("dev"));

app.get("/blog-posts", jsonParser, async (req, res, next) => {
  const posts = await Post.find();
  return res.status(200).json({success: true, posts});
});

app.get("/blog-post", jsonParser, async (req, res, next) => {
  const author = req.query.author;
  const posts = await Post.find({author});
  if (posts) {
    for (let i = 0; i < posts.length; i++) {
      if (posts[i].author === author) {
        return res.status(200).json({post: posts[i], success: true});
      }
    }
    return res
      .status(404)
      .json({success: false, error: "Unsuccessful request, Author not found."});
  } else {
    return res.status(406).json({
      success: false,
      error: "Unsuccessful request, Author not passed."
    });
  }
});

app.post("/blog-posts", jsonParser, async (req, res, next) => {
  const {title, content, author, publishedDate} = req.body;

  if (title && content && author && publishedDate) {
    const post = await Post.create({title, author, content, publishedDate});
    return res.status(201).json({post: post, success: true});
  } else {
    return res
      .status(406)
      .json({success: false, error: "Unsuccessful request, missing fields."});
  }
});

app.delete("/blog-posts/:id", async (req, res, next) => {
  const id = req.params.id;
  const post = await Post.findById(id);
  if (post) {
    await Post.findByIdAndDelete(id);
    return res.status(200).json({success: true, msg: "Deleted successfully"});
  } else {
    return res
      .status(404)
      .json({success: false, error: "Unsuccesful request, ID not found."});
  }
});

app.put("/blog-posts/:id", jsonParser, async (req, res, next) => {
  const {title, content, author, publishedDate, id} = req.body;
  const post = await Post.findById(req.params.id);
  console.log(post);

  if (!post) {
    return res
      .status(406)
      .json({success: false, error: "Unsuccessful request, ID not found."});
  }

  if (post.id !== req.params.id) {
    return res
      .status(409)
      .json({success: false, error: "Unsuccessful request, IDs do not match."});
  }

  if (title || content || author || publishedDate) {
    let Obj = {};
    if (title) {
      Obj.title = title;
    }
    if (content) {
      Obj.content = content;
    }
    if (author) {
      Obj.author = author;
    }
    if (publishedDate) {
      Obj.publishedDate = publishedDate;
    }
    await Post.updateOne({_id: post._id}, Obj, {new: true});
    return res.status(200).json({success: true, post: post});
  }
});

app.listen(process.env.PORT || 3000, () => {
  console.log("App is running on localhost:3000");
  mongoose.connect(process.env.MONGO_DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
  mongoose.connection.once("open", () => {
    console.log("Connected to mongo");
  });
});
