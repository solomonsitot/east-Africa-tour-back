const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const adminSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

// This middleware will run before saving the document
adminSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next(); // Only hash password if it's modified

  try {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(this.password, saltRounds);
    this.password = hashedPassword; // Set the password to the hashed value
    next();
  } catch (err) {
    next(err);
  }
});

const Admin = mongoose.model("Admin", adminSchema);
module.exports = Admin;