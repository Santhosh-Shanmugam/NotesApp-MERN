const express = require("express");
const app = express();


const dotenv = require("dotenv");
dotenv.config();


const config = require("./config.json");

const cors = require("cors");

const jwt = require("jsonwebtoken");
const { authenticateToken } = require("./utils");

const User = require("./models/user.model.js");
const Note = require("./models/note.model.js");

app.use(express.json());
app.use(cors({ origin: "*" }));

const mongoose = require("mongoose");
mongoose.connect(config.connectionString)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch(err => {
    console.error("MongoDB connection error:", err);
  });

app.get("/", (req, res) => {
  res.json({ data: "hello" });
});

app.post("/create-account", async (req, res) => {
    const { fullname, email, password } = req.body;

    if (!fullname) return res.status(400).json({ error: true, message: "Full Name is required" });
    if (!email) return res.status(400).json({ error: true, message: "Email is required" });
    if (!password) return res.status(400).json({ error: true, message: "Password is required" });

    try {
        const isUser = await User.findOne({ email });

        if (isUser) {
            return res.json({
                error: true,
                message: "User already exists",
            });
        }

        const user = new User({
            fullname,
            email,
            password,
        });

        await user.save();

        const accessToken = jwt.sign({ user }, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: "3600m",
        });

        return res.json({
            error: false,
            user,
            accessToken,
            message: "Registered Successfully",
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            error: true,
            message: "Internal server error",
        });
    }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email) return res.status(400).json({ message: "Email is required" });
  if (!password) return res.status(400).json({ message: "Password is required" });

  const userinfo = await User.findOne({ email: email });

  if (!userinfo) return res.status(400).json({ message: "User not found" });

  if (userinfo.password === password) {
    const user = { user: userinfo };
    const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "1h",
    });

    return res.json({
      error: false,
      message: "Login Successfully",
      email,
      accessToken,
    });
  } else {
    return res.status(400).json({
      error: true,
      message: "Invalid Credentials",
    });
  }
});

app.post("/add-note", authenticateToken, async (req, res) => {
    const { title, content, tags } = req.body;
    const { user } = req.user;

    if (!title) return res.status(400).json({ error: true, message: "Title is required" });
    if (!content) return res.status(400).json({ error: true, message: "Content is required" });

    try {
        const note = new Note({
            title,
            content,
            tags: tags || [],
            userId: user._id,
            isPinned: false,
            createdOn: Date.now(),
        });

        await note.save();

        return res.json({
            error: false,
            note,
            message: "Note added successfully",
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            error: true,
            message: "Internal server error",
        });
    }
});

// Route Handler for Editing a Note
app.put("/edit-note/:noteId", authenticateToken, async (req, res) => {
    const noteId = req.params.noteId;
    const { title, content, tags, isPinned } = req.body;
    const userId = req.user.user._id; // Accessing user ID from decoded token

    // Check if any changes are provided
    if (!title && !content && !tags) {
        return res.status(400).json({ error: true, message: "No changes provided" });
    }

    try {
        // Find the note by ID and user ID
        const note = await Note.findOne({
            _id: noteId,
            userId: userId // Ensure note belongs to the authenticated user
        });

        // If note not found, return 404 error
        if (!note) {
            return res.status(404).json({ error: true, message: "Note not found" });
        }

        // Update the note fields if provided
        if (title) note.title = title;
        if (content) note.content = content;
        if (tags) note.tags = tags;
        if (isPinned !== undefined) note.isPinned = isPinned;

        // Save the updated note
        await note.save();

        // Return success response
        return res.json({
            error: false,
            note,
            message: "Note updated successfully",
        });
    } catch (error) {
        console.error(error);
        // Return internal server error if an error occurs
        return res.status(500).json({
            error: true,
            message: "Internal server error",
        });
    }
});


const port = process.env.PORT;
app.listen(port, () => {
  console.log(`Server started at ${port}`);
});

module.exports = app;
