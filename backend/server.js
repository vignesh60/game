const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000", // Replace with your frontend's URL
    methods: ["GET", "POST"],
  },
});

app.use(cors());
app.use(express.json());

// MongoDB setup
mongoose.connect("mongodb://localhost:27017/gameDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  score: { type: Number, default: 0 },
  results: [
    {
      score: Number,
      date: { type: Date, default: Date.now },
      gameDuration: Number, // For example, how long the game lasted
      // Add any other relevant details here
    },
  ],
});

const User = mongoose.model("User", userSchema);

// Socket.io communication
io.on("connection", (socket) => {
  console.log("New client connected");

  // Handle game over and update user's score with game results
  socket.on("game_over", async ({ name, email, score, gameDuration }) => {
    try {
      const user = await User.findOneAndUpdate(
        { email },
        {
          $set: { name },
          $max: { score }, // Update if the new score is higher
          $push: {
            results: { score, gameDuration }, // Add game result to results array
          },
        },
        { upsert: true, new: true }
      );

      // Broadcast the updated leaderboard
      updateLeaderboard();
    } catch (error) {
      console.error("Error updating score:", error);
    }
  });

  // Emit leaderboard to all clients
  const updateLeaderboard = async () => {
    try {
      const leaderboard = await User.find()
        .sort({ score: -1 })
        .limit(10)
        .select("name score -_id");
      io.emit("update_leaderboard", leaderboard);
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
    }
  };

  // Disconnect
  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

// API endpoint to get user score by email
// API endpoint to get user score by email
app.get("/api/getUserScore/:email", async (req, res) => {
  const email = req.params.email; // Correctly get email from the route params
  try {
    const user = await User.findOne({ email });
    if (user) {
      res.json({
        name: user.name,
        email: user.email,
        score: user.score,
        results: user.results,
      });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error fetching user score" });
  }
});


app.get("/leaderboard", async (req, res) => {
  try {
    const topPlayers = await User.find().sort({ score: -1 }).limit(10);
    res.json(topPlayers);
  } catch (error) {
    res.status(500).json({ error: "Error fetching leaderboard" });
  }
});

// Start the server
server.listen(4000, () => {
  console.log("Server is running on http://localhost:4000");
});
