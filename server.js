const express = require("express");
const cors = require("cors");
const path = require("path");
const app = express();

// CORS configuration
app.use(
  cors({
    origin: ["https://aaramghar.onrender.com", "http://localhost:3000"],
    credentials: true,
  })
);

const dbConfif = require("./db.js");
const roomsRoute = require("./routes/roomsRoute.js");
const usersRoute = require("./routes/usersRoute.js");
const bookingRoute = require("./routes/bookingsRoute.js");

app.use(express.json());

// API Routes
app.use("/api/rooms", roomsRoute);
app.use("/api/users", usersRoute);
app.use("/api/bookings", bookingRoute);

// Serve static files from the React app
app.use(express.static(path.join(__dirname, "client/build")));

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client/build", "index.html"));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server running on port ${port}!`));
