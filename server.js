const express = require("express");
const app = express();
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./db");
const userRoutes = require("./Routes/userRoutes");
const taskRoutes = require("./Routes/taskRoutes");
const VoiceResponse = require("twilio").twiml.VoiceResponse;
require("./CronJobs/cronJobs");

connectDB();
dotenv.config();

app.use(express.json());
app.use(cors({ origin: "*" }));

app.use("/api/user", userRoutes);
app.use("/api/task", taskRoutes);

app.post("/voice", (req, res) => {
  try {
    const twiml = new VoiceResponse();
    twiml.say(`Your Tasks are pending`);

    res.type("text/xml");
    res.send(twiml.toString());
  } catch (error) {
    console.error(error);
  }
});

app.get("/", (req, res) => {
  res.send("API is running..");
});

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Running on port ${port}`);
});
