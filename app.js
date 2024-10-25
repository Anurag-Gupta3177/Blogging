require("dotenv").config();

const express = require("express")
const app = express();
const path = require("path")
const PORT = process.env.PORT || 8000;
const userRoutes = require("./routes/user")
const blogRoutes = require("./routes/blog")

const mongoose = require("mongoose")
const cookieParser = require("cookie-parser")
const {checkForAuthenticationCookie} = require("./middlewares/authentication")

const Blog = require("./models/blog")


mongoose.connect(process.env.MONGO_URL)
.then((e) => console.log("Mongodb Connected"))

app.set("view engine" , "ejs")
app.set("views" , path.resolve("./views"))

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());
app.use(checkForAuthenticationCookie("token"));
app.use(express.static(path.resolve("./public")))


app.get("/" , async(req,res) => {

     const allBlogs = await Blog.find({});
     res.render("home",{
          user : req.user,
          blogs : allBlogs,
     });
});

app.use("/user" , userRoutes)
app.use("/blog" , blogRoutes)


app.listen(PORT , () => console.log(`Server is running at PORT : ${PORT}` ) )