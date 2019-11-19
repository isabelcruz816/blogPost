require("dotenv").config();

exports.DATABASE_URL =
  process.env.DATABASE_URL || "mongodb://localhost/isabel-blog-posts";
exports.PORT = process.env.PORT || 3000;
