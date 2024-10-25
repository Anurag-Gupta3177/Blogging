const {Schema , model} = require("mongoose")
const {createHmac , randomBytes} = require("crypto");
const { createToken } = require("../services/authentication");

const userSchema = new Schema({
    
    fullName : {
        type : String,
        required : true,
    },
    email : {
        type : String,
        unique : true,
    },
    salt : {
        type : String,
    },
    password : {
        type : String,
        required : true,       
    },
    profileImageURL : {
        type : String,
        default : "/images/default.png",
    },
    role : {
        type : String,
        enum : ["USER" , "ADMIN"],
        default : "USER",
    },
},
 {timestamps : true}
);

userSchema.pre("save", function (next) {
    const user = this;

    // Only hash the password if it is new or modified
    if (!user.isModified("password")) return next();

    // Generate a salt and hash the password with the salt
    const salt = randomBytes(16).toString("hex"); // Convert to hex string
    const hashPassword = createHmac("sha256", salt)
        .update(user.password)
        .digest("hex");

    // Save the hashed password and the salt
    this.salt = salt;
    this.password = hashPassword;

    next();
});

 

userSchema.static("matchPassword", async function (email, password) {
    try {
        const user = await this.findOne({ email });

        // If the user is not found, throw an error
        if (!user) throw new Error("User not found");

        // Recreate the hash with the provided password and stored salt
        const userProvidedHash = createHmac("sha256", user.salt)
            .update(password)
            .digest("hex");

        // Check if the provided password matches the stored hashed password
        if (user.password !== userProvidedHash) throw new Error("Password is incorrect");

        // Generate and return the token
        const token = createToken(user);
        return token;

    } catch (error) {
        // Re-throw the error so it can be caught in the controller
        throw new Error(error.message);
    }
});

const User = model("user" , userSchema);

module.exports = User;
