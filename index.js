const express=require("express")
const mongoose=require("mongoose")
const cors=require("cors")
const cookieparser=require("cookie-parser")
const { MONGODB } = require("./config/UserConfig")
const UserRouter = require("./Routers/UserRouter")
const InputRouter = require("./Routers/InputRouter")
const app=express()
app.use(cookieparser())
app.use(express.json())
app.use(cors({
    origin: (origin, callback) => {
      callback(null, true);
    },
    credentials: true
  }));
app.use("/users",UserRouter)
app.use("/input",InputRouter)

mongoose.connect(MONGODB)
.then(()=>{
    console.log("database connected")
})
const PORT = process.env.PORT || 3500;
let currentPort = PORT;

const startServer = (port) => {
  const server = app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.log(`Port ${port} is in use, trying another port...`);
      currentPort = (port + 1) % 65535; // Ensure the port number is within valid range
      startServer(currentPort);
    } else {
      console.error(err);
    }
  });
};

startServer(currentPort);

// Ensure proper shutdown
const shutdown = () => {
  if (server) {
    server.close(() => {
      console.log('Server closed');
      process.exit(0);
    });
  }
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);