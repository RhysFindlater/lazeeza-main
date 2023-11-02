const app = require("./app");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

process.on("uncaughtException", (err) => {
  console.log("UNCAUGHT EXCEPTION! Shutting down...");
  console.log(err.name, err.message);

  server.close(() => {
    process.exit(1);
  });
});

dotenv.config({ path: "./config.env" });

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(
    `App listening on port ${port}... in ${process.env.NODE_ENV} mode!`
  );
});

const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);
mongoose.connect(DB).then(() => {
  console.log("Database successfully connected");
});

process.on("unhandledRejection", (err) => {
  console.log("UNHANDLED REJECTION! Shutting down...");
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

process.on("SIGTERM", () => {
  console.log("SIGTERM RECIEVED. Shutting down gracefully");
  server.close(() => {
    console.log("Process terminated!");
  });
});