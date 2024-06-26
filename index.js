const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const multer = require("multer");
//const cors = require("cors");
const app = express();

// Set the view engine to EJS
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

//app.use(cors());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "public")));

mongoose
  .connect("mongodb://localhost:27017/multerData")
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Connection error:", error);
  });
const userSchema = new mongoose.Schema({
  name: String,

  file: String,
});
const User = mongoose.model("User", userSchema);

// muter code
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads/");
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});
const upload = multer({ storage: storage });

app.get("/", (req, res) => {
  User.find({})
    .then((users) => {
      res.render("user", { users: users });
    })
    .catch((err) => {
      console.log(err);
    });
});

app.post("/submit", upload.single("file"), (req, res) => {
  const user = new User({
    name: req.body.name,
    file: req.file.filename,
  });
  user
    .save()
    .then((result) => {
      res.redirect("/");
    })
    .catch((err) => console.log(err));
});

app.listen(3000, (req, res) => {
  console.log("server connected $3000");
});
