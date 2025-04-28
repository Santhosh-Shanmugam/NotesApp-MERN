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
mongoose.connect(config.connectionString, {
    serverSelectionTimeoutMS: 5000, // 5 seconds timeout
    socketTimeoutMS: 10000, // 10 seconds timeout
})
.then(() => console.log("Connected to MongoDB"))
.catch(err => console.error("MongoDB connection error:", err));

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

        const accessToken = jwt.sign({ user }, process.env.JWT_SECRET, {
            expiresIn: "1d",
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
    try {
        const user = await User.findOne({ email: req.body.email });
        
        if (!user || req.body.password !== user.password) {
            return res.status(400).json({ message: "Invalid Email or Password", success: false });
        }

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
            expiresIn: "1d",
        });

        res.json({ token, user, success: true }); // Send user details along with token
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error logging in", success: false, error });
    }
});

const authenticateUser = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader?.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'No token provided' });
        }

        const token = authHeader.split(' ')[1];
        
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                console.error("Token verification error:", err);
                return res.status(401).json({ error: 'Invalid token' });
            }

            req.userId = decoded.userId || decoded.user._id;
            next();
        });
    } catch (error) {
        console.error("Auth error:", error);
        return res.status(401).json({ error: 'Authentication failed' });
    }
};

app.post("/add-note", authenticateUser, async (req, res) => {
    const { title, content, tags } = req.body;

    if (!title) return res.status(400).json({ error: true, message: "Title is required" });
    if (!content) return res.status(400).json({ error: true, message: "Content is required" });

    try {
        const note = new Note({
            title,
            content,
            tags: tags || [],
            userId: req.userId,
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

app.put("/edit-note/:id", authenticateUser, async (req, res) => {
    const { id } = req.params;
    const { title, content, tags } = req.body;

    try {
        const note = await Note.findOneAndUpdate(
            { _id: id, userId: req.userId },
            { title, content, tags },
            { new: true }
        );

        if (!note) {
            return res.status(404).json({ error: true, message: "Note not found" });
        }

        res.json({ message: "Note updated successfully", result: note });
    } catch (error) {
        console.error("Error during update:", error);
        return res.status(500).json({ error: true, message: "Server error during update" });
    }
});

app.get("/get-all-notes", authenticateUser, async (req, res) => {
    try {
        const notes = await Note.find({ userId: req.userId }).sort({ isPinned: -1 });

        return res.json({
            notes
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            error: true,
            message: "Internal server error",
        });
    }
});

app.delete("/delete-note/:id", authenticateUser, async (req, res) => {
    try {
        const result = await Note.findOneAndDelete({ _id: req.params.id, userId: req.userId });
        if (!result) {
            return res.status(404).json({ error: true, message: "Note not found" });
        }
        res.json({ message: "Note deleted successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: true, message: "Internal server error" });
    }
});

app.put("/update-note-isPinned/:noteId", authenticateUser, async (req, res) => {
    const noteId = req.params.noteId;
    const { isPinned } = req.body;

    try {
        const note = await Note.findOneAndUpdate(
            { _id: noteId, userId: req.userId },
            { isPinned: isPinned },
            { new: true }
        );

        if (!note) {
            return res.status(404).json({ error: true, message: "Note not found" });
        }

        return res.json({
            error: false,
            note,
            message: "Note updated successfully",
        });
    } catch (error) {
        console.error(error);
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
