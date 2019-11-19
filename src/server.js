const express = require("express");
const bodyparser = require("body-parser");
const morgan = require("morgan");
const uuid = require("uuid");
const jsonParser = bodyparser.json();

const app = express();

let posts = [
  {
    id: uuid.v4(),
    title: "Todays post",
    content: "This is todays post content",
    author: "Isabel",
    publishedDate: Date.now()
  },
  {
    id: uuid.v4(),
    title: "Tomorrows post",
    content: "This is tomorrows post content",
    author: "Author",
    publishedDate: Date.now()
  }
];

app.use(express.static("public"));
app.use(morgan("dev"));

app.get("/blog-posts", jsonParser, (req, res, next) => {
  return res.status(200).json({success: true, posts});
});

app.get("/blog-post", jsonParser, (req, res, next) => {
  if (req.query.author) {
    for (let i = 0; i < posts.length; i++) {
      if (posts[i].author === req.query.author) {
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

app.post("/blog-posts", jsonParser, (req, res, next) => {
  const {title, content, author, publishedDate} = req.body;

  if (title && content && author && publishedDate) {
    const post = {
      id: uuid.v4(),
      title: title,
      author: author,
      content: content,
      publishedDate: publishedDate
    };
    posts.push(post);
    return res.status(201).json({post: post, success: true});
  } else {
    return res
      .status(406)
      .json({success: false, error: "Unsuccessful request, missing fields."});
  }
});

app.delete("/blog-posts/:id", (req, res, next) => {
  let postIndex = 0;
  if (req.params.id) {
    for (let i = 0; i < posts.length; i++) {
      if (posts[i].id === req.params.id) {
        postIndex = i;
      }
    }
    posts.splice(postIndex, 1);
    return res.status(200).json({success: true, msg: "Deleted successfully"});
  } else {
    return res
      .status(404)
      .json({success: false, error: "Unsuccesful request, ID not found."});
  }
});

app.put("/blog-posts/:id", jsonParser, async (req, res, next) => {
  const {title, content, author, publishedDate, id} = req.body;
  console.log(id);

  if (!req.params.id || !id) {
    return res
      .status(406)
      .json({success: false, error: "Unsuccessful request, ID not found."});
  }

  if (id !== req.params.id) {
    return res
      .status(409)
      .json({success: false, error: "Unsuccessful request, IDs do not match."});
  }

  if (title || content || author || publishedDate) {
    let found = false;
    for (let i = 0; i < posts.length; i++) {
      if (posts[i].id === req.params.id) {
        if (title) {
          posts[i].title = title;
        }
        if (content) {
          posts[i].content = content;
        }
        if (author) {
          posts[i].author = author;
        }
        if (publishedDate) {
          posts[i].publishedDate = publishedDate;
        }
        found = true;
        return res.status(200).json({success: true, post: posts[i]});
      }
    }
    if (!found) {
      return res
        .status(404)
        .json({success: false, error: "Unsucessful request, Post not found."});
    }
  }
});

app.listen(3000, () => {
  console.log("App is running on localhost:3000");
});

//aqui me falta lo de mongoose pero no ce como lol
