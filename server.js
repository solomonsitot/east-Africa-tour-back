require("dotenv").config();
const DBconnection = require("./src/config/db_con");
const adminRoute = require("./src/routes/adminRoute");
// const profileRoute = require("./src/routes/profileRoutes");
// const destinationRoute = require("./src/routes/destinationRoutes");
// const roomRoute = require("./src/routes/hotelRoomRoutes");
// const blogRoute = require("./src/routes/blogsRoute");
// const reservationRoute = require("./src/routes/reservationRoute");
// const purchaseRoute = require("./src/routes/purchaseRoute");
// const subscribeRoute = require("./src/routes/subscriptionRoute");
// const productRoute = require("./src/routes/productRoute");
// const tourRoute = require("./src/routes/tourPackageRoute");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");
const express = require("express");

const app = express();

app.use(cookieParser());
app.use(
  cors({
    origin: (origin, callback) => {
      const allowedOrigins = ["http://localhost:5173","https://east-africa-tour-operator.vercel.app","https://www.eastafricatouroperator.net"];
      if (allowedOrigins.includes(origin) || !origin) {
        callback(null, true); // Allow the origin
      } else {
        callback(new Error("Not allowed by CORS")); // Deny the origin
      }
    },
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/admin", adminRoute);


const Admin = require("./src/models/adminModel"); // Adjust the path as necessary

// const createAdmin = async (email, password) => {
//  try {
//    const admin = new Admin({ email, password });
//    await admin.save(); // The password will be automatically hashed before saving
//    console.log("Admin created successfully");
//    } catch (err) {
//     console.error("Error creating admin:", err.message);
//  } };

// //  Example usage
// createAdmin("admin@gmail.com", "admin123");




const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`running on port ${port}`);
});