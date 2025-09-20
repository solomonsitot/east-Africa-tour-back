const path = require("path");
const express = require("express");
const {
  Login,
  logout,
  getLoginStatus,
  getAllBlogs,
  createBlog,
  updateBlog,
  getBlogById,
  deleteBlog,
  getBlogByCat,
  //   signup,
  // getAllClasses,
  // getSingleClass,
  // getClassStudents,
  // addStudent,
  // createClass,
  // saveAttendance,
  // getClassAttendance,
  // getAttendanceDetail,
  // getAllAttendance,
  // completeClass,
  // getAllStudent,
  // createHlg,
  // getAllHLGs,
  // getSingleHlg,
  // getCompletedCultureClass,
  // getPassedStudentsofClass,
  // assignStudentToHLG,
  // getHlgMembers,
  // removeStudentFromHLG,
  // createServing,
  // getAllServings,
  // getSingleServing,
  // getServingMembers,
  // getCompletedServiceClass,
  // assignStudentToServing,
  // removeStudentFromServing,
  //   changePassword,
  //   userInfo,
  //   verifyUser,
  //   banUser,
  //   forgotPassword,
  //   resetPassword,
  //   searchHotel,
  //   getSingleHotel,
  //   getAllUsers,
  //   getSingleUser,
  //   getLoginStatus,
  //   getCounts,
  //   searchAgent,
} = require("../controller/adminController");
const auth_mw = require("../middleware/auth_mw");
const { upload } = require("../middleware/multer");

const router = express.Router();

router.post("/login", Login);
router.get("/logout", logout);
router.get("/get-user-status", getLoginStatus);
router.get("/get-all-blogs", getAllBlogs);
router.get("/get-blog/:id", getBlogById);
router.get("/get-blog-by-cat/:cat/:id", getBlogByCat);
router.post("/create-blogs", auth_mw, upload.single("blogImage"), createBlog);
router.put("/update-blog/:id", auth_mw, upload.single("blogImage"), updateBlog);
router.delete("/delete-blog/:id", deleteBlog);

// router.get("/get-all-classes", getAllClasses);
// router.get("/get-single-class/:classId", auth_mw, getSingleClass);
// router.get("/get-class/:classId/students", auth_mw, getClassStudents);
// router.post("/add-student-to/:classId", auth_mw, addStudent);
// router.post("/classes/create", auth_mw, createClass);
// router.post("/save-attendance/:classId", saveAttendance);
// router.get("/get-class/:classId/attendance", auth_mw, getClassAttendance);
// router.get(
//   "/get-attendance-detail/:attendanceId",
//   auth_mw,
//   getAttendanceDetail
// );
// router.get("/get-all-attendances", getAllAttendance);
// router.get("/get-all-students", getAllStudent);
// router.post("/complete-class/:classId", completeClass);
// router.post("/hlgs/create", auth_mw, createHlg);
// router.get("/get-all-hlgs", getAllHLGs);
// router.get("/get-single-hlg/:hlgId", auth_mw, getSingleHlg);
// router.get("/get-completed-classes", getCompletedCultureClass);
// router.get(
//   "/get-class/:selectedClassId/passed-students",
//   getPassedStudentsofClass
// );
// router.post("/hlg/:hlgId/assign-student", assignStudentToHLG);
// router.get("/get-hlg/:hlgId/members", getHlgMembers);
// router.post("/hlg/:hlgId/remove-student", removeStudentFromHLG);
// router.post("/servings/create", auth_mw, createServing);
// router.get("/get-all-servings", getAllServings);
// router.get("/get-single-serving/:sId", auth_mw, getSingleServing);
// router.get("/get-serving/:sId/members", auth_mw, getServingMembers);
// router.get("/get-completed-serving-classes", getCompletedServiceClass);
// router.post("/serving/:sId/assign-student", assignStudentToServing);
// router.post("/serving/:sId/remove-student", removeStudentFromServing);
// router.post("/change-password", auth_mw,changePassword);
// router.post("/forgot-password", forgotPassword);
// router.put("/reset-password/:resetToken", resetPassword);
// router.get("/search-hotel/:key?", searchHotel);
// router.get("/search-agent/:key?", searchAgent);
// router.get("/get-user-status", getLoginStatus);
// router.get("/get-single-hotel/:id?", getSingleHotel);
// router.get("/get-all-users/", auth_mw, getAllUsers);
// router.get("/get-single-user", auth_mw, getSingleUser);
// router.get("/get-user-info", auth_mw, userInfo);
// // router.put("/verify-user/:id",  verifyUser);
// // router.put("/ban-user/:id",  banUser);
// router.put("/verify-user/", auth_mw, verifyUser);
// router.put("/ban-user", auth_mw, banUser);

module.exports = router;
