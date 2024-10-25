const {Router} = require("express");
const router = Router();
const User = require("../models/user")
const { validateToken } = require("../services/authentication");


router.get("/signin" , (req,res) => {
    return res.render("signin");
})

router.get("/signup" , (req,res) => {
    return res.render("signup");
})

router.post("/signin", async (req, res) => {
    const { email, password } = req.body; 
    try {
        const token = await User.matchPassword(email, password);

        const decodedToken = validateToken(token);

        // Set the cookie and redirect on success
        return res.cookie("token", token).redirect("/");
    } catch (error) {
        // Render the signin page with an error message if authentication fails
        return res.render("signin", {
            error: "Incorrect email or password",  // Fixed error handling
        });
    }
});


router.post("/signup" , async(req,res) => {

    const {fullName , email , password} = req.body; 
    await User.create({
        fullName,
        email,
        password,
    });

   return res.redirect("/");

})

router.get("/logout" , (req,res) =>{
    res.clearCookie("token").redirect("/")
})

module.exports = router;