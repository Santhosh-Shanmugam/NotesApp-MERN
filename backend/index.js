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
  .catch(error => {
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
        
        if (!user) {
            return res.send("Invalid Email or Password");
        }
        if (req.body.password!==user.password) {
            return res.send("Invalid Email or Password");
        } else {
            const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET, {
                expiresIn: "1d",
            });
            console.log(token)
            res.send({ token, user }); // Send user details along with token
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: "Error logging in", success: false, error });
    }
});
const verifyToken = (token) => {
    try {
        return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
        throw new Error('Invalid token');
    }
};

const authenticateUser = (req, res, next) => {
    const token = req.headers.authorization;

    if (!token) {
        return res.status(401).json({ error: 'User not allowed' });
    }

    try {
        const decodedToken = verifyToken(token);

        req.user = decodedToken;
        next();
    } catch (error) {
        console.error(error);
        return res.status(401).json({ error: 'Invalid token' });
    }
};

app.use(authenticateUser);



app.post("/add-note", async (req, res) => {
    const { title, content, tags,data } = req.body;


    if (!title) return res.status(400).json({ error: true, message: "Title is required" });
    if (!content) return res.status(400).json({ error: true, message: "Content is required" });

    try {
        const note = new Note({
            title,
            content,
            tags: tags || [],
            userId: data._id,
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


  
// // PUT route to edit a note
app.put("/edit-note/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { title, content, tags } = req.body;

        // Check if any changes are provided
        if (!title && !content && !tags) {
            return res.status(400).json({ error: true, message: "No changes provided" });
        }

        // Update the note fields if provided
        const updateData = {};
        if (title) updateData.title = title;
        if (content) updateData.content = content;
        if (tags) updateData.tags = tags;

        const result = await Note.findByIdAndUpdate(id, updateData, { new: true });
        res.send(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: true, message: "Server error" });
    }
});

  
app.post("/get-all-note", async (req, res) => {
  

    try {
        // Find the note by ID and user ID
        const notes = await Note.find().sort({ isPinned: -1 
        });

        // Return success response
        return res.json({
            notes
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

app.delete("/delete-note/:id", async (req, res) => {

    try {
        const result = await Note.findByIdAndDelete(req.params.id);
    } 
    catch (error) {
        console.error(error);
    }
});


// // try {
//     const user = await User.findOne({ email: req.body.email });

//     if (!user) {
//       return res.status(400).send("Invalid Email or Password");
//     }
//     if (req.body.password !== user.password) {
//       return res.status(400).send("Invalid Email or Password");
//     } else {
//       const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
//         expiresIn: "1d",
//       });
//       res.send({ token, user }); // Send user details along with token
//     }
//   } catch (error) {
//     console.log(error);
//     res.status(500).send({ message: "Error logging in", success: false, error });
//   }
// });

app.put("/update-note-isPinned/:noteId", authenticateToken, async (req, res) => {
    const noteId = req.params.noteId;
    const { isPinned } = req.body;
    const {user} = req.user; // Ensure this correctly fetches the authenticated user

    try {
        // Find the note by ID and user ID
        const note = await Note.findOne({
            _id: noteId,
            userId: user._id // Ensure note belongs to the authenticated user
        });

        // If note not found, return 404 error
        if (!note) {
            return res.status(404).json({ error: true, message: "Note not found" });
        }

        // Update the isPinned status
        note.isPinned = isPinned;

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
