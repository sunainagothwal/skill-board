const express = require('express');
const fs = require("fs");
const path = require('path')
const bodyParser = require("body-parser");
require('dotenv').config();
const usersRoutes = require("./routes/users-routes");
const tasksRoutes = require("./routes/tasks-routes");
const HttpError= require("./models/http-error");
const { default: mongoose } = require("mongoose");

const app = express();
 
app.use(bodyParser.json());
app.use('/uploads/images',express.static(path.join('uploads','images')));

 app.use((req, res, next)=>{
  res.setHeader('Access-Control-Allow-Origin','*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin,X-Requested-With,Content-Type,Accept,Authorization');
  res.setHeader("Access-Control-Allow-Methods", 'GET, POST,PATCH, PUT, DELETE');
  next()
}); 

app.use("/api/users", usersRoutes);
app.use("/api/tasks", tasksRoutes);


 app.use((req, res, next) => {
  const error = new HttpError("Could not find this route.", 404);
  throw error;
}); 

app.use((error, req, res, next) => {
   if (req.file) {
    fs.unlink(req.file.path, (err) => {
      console.log(err);
    });
  } 
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || "An unknown error occurred!" });
});
//mongodb+srv://bhagirath:bhagiraths@cluster0.bxc5w.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0

  const PORT = process.env.PORT || 5000;

  mongoose
    .connect(
      `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.bxc5w.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority&appName=Cluster0`
    )
    .then(() => {
      app.listen(PORT, () => {
        console.log(`✅ Server is running on port ${PORT}`);
      });
    }).catch((err) => {
      console.log("Server not connected "+" "+err);
    });
