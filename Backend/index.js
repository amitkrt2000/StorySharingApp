const express = require("express");
const mongoose = require("mongoose");
const fs = require("fs");
const app = express();
const cors = require("cors");

const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const authRoutes = require("./routes/auth/indexRouter");
const storyRoutes = require("./routes/story/storyRouter");

dotenv.config();

const PORT = process.env.PORT || 3000;
app.use(cors());

// Middleware to log incoming requests
app.use((req, res, next) => {
  const log = `${req.method}-${req.url}-${req.ip}-${new Date()}\n`;
  fs.appendFile("log.txt", log, (err) => {
    if (err) {
      console.log(err);
    }
  });
  next();
});

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  next();
});

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Routes middleware
app.use("/api/auth", authRoutes);
app.use("/api/story", storyRoutes);

// Error logging middleware
app.use((err, req, res, next) => {
  let log = `${err.stack}\n${req.method}||${req.url}||${req.ip}||${new Date()}\n`;
  fs.appendFile("error.txt", log, (err) => {
    if (err) {
      console.log(err);
    }
  });
  res.status(err.status || 500).json({ message: "Something went wrong", error: err.message });
});

// Simple route
app.get("/", (req, res) => {
  res.send("Hello world");
});

// Start the server and connect to MongoDB
app.listen(PORT, () => {
  console.log(`The server is running on ${PORT}`);
  mongoose
    .connect(process.env.MONGODB_URL)
    .then(() => console.log("MongoDB connected"))
    .catch((err) => console.log(err));
});
