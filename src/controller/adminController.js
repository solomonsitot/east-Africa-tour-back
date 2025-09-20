require("dotenv").config();
// const crypto = require("crypto");
const _ = require("lodash");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Admin = require("../models/adminModel");
const Blogs = require("../models/blogModel");
// const Serving = require("../models/servingModel");
// const Classroom = require("../models/classModel");
// const Student = require("../models/studentModel");
// const Attendance = require("../models/attendanceModel");
// const HLG = require("../models/hlgModel");
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const cloudinary = require("../utils/cloudinary");
module.exports.Login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "all fields are required" });
    }
    const admin = await Admin.find({ email: email });
    if (!admin) {
      return res.status(400).json({ message: "invalids email or password" });
    }
    const valid = await bcrypt.compare(password, admin[0].password);
    if (!valid) {
      return res.status(400).json({ message: "invalid email or password" });
    }
    const token = await jwt.sign(
      { id: admin._id },
      process.env.PRIVATE_SECERET_TOKEN
    );
    res
      .cookie("token", token, {
        path: "/",
        httpOnly: true,
        sameSite: "none",
        secure: true,
      })
      .json({ message: "loggedin successfully", body: admin })
      .status(200);
  } catch (err) {
    res.json({ message: err.message });
    console.log(err);
  }
};
module.exports.logout = async (req, res) => {
  res.cookie("token", "", {
    path: "/",
    httpOnly: true,
    expires: new Date(0), // Setting expiration date to past
    sameSite: "none",
    secure: true,
  });
  res.status(200).json({
    message: "logged out successfully",
  });
};
module.exports.getLoginStatus = async (req, res) => {
  const token = req.cookies.token;
  if (!token) {
    return res.json(false);
  }
  const verified = jwt.verify(token, process.env.PRIVATE_SECERET_TOKEN);
  if (verified) {
    return res.json(true);
  }
  return res.json(false);
};

// Create a new blog
module.exports.createBlog = async (req, res) => {
  try {
    const {
      blog_title,
      // blog_image,
      blog_description,
      blog_read_time,
      blog_category,
    } = req.body;
    console.log(req.file);
    // Upload profile image to Cloudinary
    const blogUpload = await cloudinary.uploader.upload(req.file.path);
    const blogImageUrl = blogUpload.secure_url;

    // Create new blog
    const newBlog = new Blogs({
      blog_title,
      blog_image: blogImageUrl,
      blog_description,
      blog_read_time,
      blog_date: new Date(),
      blog_category: blog_category || "General",
      featured: req.body.featured || false,
    });

    const savedBlog = await newBlog.save();

    res.status(201).json({
      message: "Blog created successfully",
      blog: savedBlog,
    });
  } catch (err) {
    console.error("Create blog error:", err);
    res.status(500).json({
      message: "Server error while creating blog",
      error: err.message,
    });
  }
};

module.exports.getAllBlogs = async (req, res) => {
  try {
    // Get blogs with pagination
    const blogs = await Blogs.find({}).sort({ blog_date: -1 }); // Sort by date descending (newest first)

    res.status(200).json({
      message: "Blogs retrieved successfully",
      blogs,
    });
  } catch (err) {
    console.error("Get all blogs error:", err);
    res.status(500).json({
      message: "Server error while fetching blogs",
      error: err.message,
    });
  }
};

module.exports.getBlogById = async (req, res) => {
  try {
    const { id } = req.params;

    const blog = await Blogs.findById(id);

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    res.status(200).json({
      message: "Blog retrieved successfully",
      blog,
    });
  } catch (err) {
    console.error("Get blog by ID error:", err);
    res.status(500).json({
      message: "Server error while fetching blog",
      error: err.message,
    });
  }
};
module.exports.getBlogByCat = async (req, res) => {
  try {
    const { cat, id } = req.params;

    const blog = await Blogs.find({
      blog_category: cat,
      _id: { $ne: id },
    });

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    res.status(200).json({
      message: "Blog retrieved successfully",
      blog,
    });
  } catch (err) {
    console.error("Get blog by ID error:", err);
    res.status(500).json({
      message: "Server error while fetching blog",
      error: err.message,
    });
  }
};

module.exports.updateBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Check if blog exists
    const existingBlog = await Blogs.findById(id);
    if (!existingBlog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    let uploadedImageUrl;
    if (req.file && req.file.path) {
      const blogUpload = await cloudinary.uploader.upload(req.file.path);
      uploadedImageUrl = blogUpload.secure_url;
    }

    // Update blog
    const updatedBlog = await Blogs.findByIdAndUpdate(
      id,
      { ...updates, blog_date: new Date() }, // Update date when modified
      { new: true, runValidators: true }
    );
    if (uploadedImageUrl) {
      await Blogs.findByIdAndUpdate(
        id,
        { blog_image: uploadedImageUrl },
        { new: true, upsert: true }
      );
    }
    res.status(200).json({
      message: "Blog updated successfully",
      blog: updatedBlog,
    });
  } catch (err) {
    console.error("Update blog error:", err);
    res.status(500).json({
      message: "Server error while updating blog",
      error: err.message,
    });
  }
};

module.exports.deleteBlog = async (req, res) => {
  try {
    const { id } = req.params;

    const blog = await Blogs.findByIdAndDelete(id);

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    res.status(200).json({
      message: "Blog deleted successfully",
      blog,
    });
  } catch (err) {
    console.error("Delete blog error:", err);
    res.status(500).json({
      message: "Server error while deleting blog",
      error: err.message,
    });
  }
};

// module.exports.getAllClasses = async (req, res) => {
//   try {
//     const classes = await Classroom.find({});
//     if (!classes) {
//       return res.json({ message: "no class found" });
//     }
//     return res.json(classes);
//   } catch (err) {
//     res.json({ message: err.message });
//   }
// };
// module.exports.getSingleClass = async (req, res) => {
//   try {
//     const { classId } = req.params;
//     const classroom = await Classroom.findById(classId);
//     if (!classroom) {
//       return res.json({ message: "no classroom found" });
//     }
//     return res.json(classroom);
//   } catch (err) {
//     res.json({ message: err.message });
//   }
// };

// module.exports.getClassStudents = async (req, res) => {
//   try {
//     const { classId } = req.params;
//     const students = await Student.find({ classroom: classId });
//     if (!students) {
//       return res.json({ message: "no classroom found" });
//     }
//     return res.json(students);
//   } catch (err) {
//     res.json({ message: err.message });
//   }
// };

// module.exports.createClass = async (req, res) => {
//   try {
//     const { name, description, type } = req.body;
//     // console.log(req.body);
//     if (!name || !description) {
//       return res.json({ message: "all fields are required" }).satus(400);
//     }
//     const classroom = {
//       class_name: name,
//       class_description: description,
//       class_type: type,
//     };
//     await Classroom.create(classroom);
//     res
//       .json({ message: "class created sucessfully", body: classroom })
//       .status(200);
//   } catch (err) {
//     res.json({ message: err.message });
//   }
// };

// module.exports.addStudent = async (req, res) => {
//   try {
//     const { fullName, gender, city, subCity, area, phoneNumber } = req.body;
//     const { classId } = req.params;
//     if (!fullName || !gender || !city || !subCity || !area || !phoneNumber) {
//       return res.json({ message: "all fields are required" }).satus(400);
//     }
//     const student = {
//       classroom: classId,
//       full_name: fullName,
//       gender: gender,
//       city: city,
//       sub_city: subCity,
//       area: area,
//       phone_number: phoneNumber,
//     };
//     await Student.create(student);
//     res
//       .json({ message: "student added sucessfully", body: student })
//       .status(200);
//   } catch (err) {
//     res.json({ message: err.message });
//   }
// };
// module.exports.saveAttendance = async (req, res) => {
//   const { classId } = req.params;
//   const { instructorName, lessonTitle, attendanceDate, attendanceData } =
//     req.body;

//   try {
//     const newAttendance = {
//       classId,
//       instructorName,
//       lessonTitle,
//       attendanceDate,
//       attendanceData,
//     };

//     await Attendance.create(newAttendance);
//     res.status(201).json({ message: "Attendance saved successfully." });
//   } catch (error) {
//     console.error("Error saving attendance:", error);
//     res.status(500).json({ message: "Failed to save attendance." });
//   }
// };

// module.exports.getAllAttendance = async (req, res) => {
//    try {
//     const attendances = await Attendance.find()
//       .populate({
//         path: 'classId',
//         select: 'status class_name'
//       });

//     const formattedAttendances = attendances.map(attendance => ({
//       ...attendance.toObject(),
//       classStatus: attendance.classId.status,
//       className: attendance.classId.class_name
//     }));

//     res.json(formattedAttendances);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };
// module.exports.getClassAttendance = async (req, res) => {
//   try {
//     const { classId } = req.params;
//     const attendances = await Attendance.find({ classId: classId });
//     if (!attendances) {
//       return res.json({ message: "no attendances found" });
//     }
//     return res.json(attendances);
//   } catch (err) {
//     res.json({ message: err.message });
//   }
// };

// module.exports.getAttendanceDetail = async (req, res) => {
//   try {
//     const attendanceId = req.params.attendanceId;

//     const attendance = await Attendance.findById(attendanceId)
//       .populate("attendanceData.studentId", "full_name gender phone_number")
//       .exec();

//     if (!attendance) {
//       return res.status(404).json({ message: "Attendance not found" });
//     }

//     res.json(attendance);
//   } catch (error) {
//     console.error("Error fetching attendance details:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// };
// module.exports.completeClass = async (req, res) => {
//   try {
//     const { classId } = req.params;

//     const students = await Student.find({ classroom: classId });

//     for (const student of students) {
//       const absentCount = await Attendance.aggregate([
//         { $match: { classId: student.classroom } },
//         { $unwind: "$attendanceData" },
//         {
//           $match: {
//             "attendanceData.studentId": student._id,
//             "attendanceData.status": "Absent",
//           },
//         },
//         { $count: "absentTotal" },
//       ]);

//       const totalAbsents = absentCount[0]?.absentTotal || 0;
//       const newStatus = totalAbsents >= 3 ? "not completed" : "completed";

//       // Update student absents and status if necessary
//       student.absents = totalAbsents;
//       student.status = newStatus;

//       await student.save();
//     }

//     // Update class status to COMPLETED
//     await Classroom.findByIdAndUpdate(classId, { status: "COMPLETED" });

//     return res.status(200).json({
//       message:
//         "Student absents, statuses, and class status updated successfully.",
//     });
//   } catch (error) {
//     console.error("Error updating student/class statuses:", error);
//     return res.status(500).json({ message: "Server error." });
//   }
// };

// module.exports.getAllStudent = async (req, res) => {
//   try {
//     const student = await Student.find({});
//     if (!student) {
//       return res.json({ message: "no student found" });
//     }
//     return res.json(student);
//   } catch (err) {
//     res.json({ message: err.message });
//   }
// };
// module.exports.createHlg = async (req, res) => {
//   try {
//     const { name, description } = req.body;
//     // console.log(req.body);
//     if (!name || !description) {
//       return res.json({ message: "all fields are required" }).satus(400);
//     }
//     const hlg = {
//       hlg_name: name,
//       hlg_description: description,
//     };
//     await HLG.create(hlg);
//     res.json({ message: "HLG created sucessfully", body: hlg }).status(200);
//   } catch (err) {
//     res.json({ message: err.message });
//   }
// };
// module.exports.createServing = async (req, res) => {
//   try {
//     const { name, description } = req.body;
//     // console.log(req.body);
//     if (!name || !description) {
//       return res.json({ message: "all fields are required" }).satus(400);
//     }
//     const serving = {
//       serving_name: name,
//       serving_description: description,
//     };
//     await Serving.create(serving);
//     res
//       .json({ message: "serving created sucessfully", body: serving })
//       .status(200);
//   } catch (err) {
//     res.json({ message: err.message });
//   }
// };

// module.exports.getAllHLGs = async (req, res) => {
//   try {
//     const hlgs = await HLG.find({});
//     if (!hlgs) {
//       return res.json({ message: "no hlg found" });
//     }
//     return res.json(hlgs);
//   } catch (err) {
//     res.json({ message: err.message });
//   }
// };
// module.exports.getAllServings = async (req, res) => {
//   try {
//     const servings = await Serving.find({});
//     if (!servings) {
//       return res.json({ message: "no serving found" });
//     }
//     return res.json(servings);
//   } catch (err) {
//     res.json({ message: err.message });
//   }
// };

// module.exports.getSingleHlg = async (req, res) => {
//   try {
//     const { hlgId } = req.params;
//     const hlg = await HLG.findById(hlgId);
//     if (!hlg) {
//       return res.json({ message: "no hlg found" });
//     }
//     return res.json(hlg);
//   } catch (err) {
//     res.json({ message: err.message });
//   }
// };
// module.exports.getSingleServing = async (req, res) => {
//   try {
//     const { sId } = req.params;
//     const serving = await Serving.findById(sId);
//     if (!serving) {
//       return res.json({ message: "no serving found" });
//     }
//     return res.json(serving);
//   } catch (err) {
//     res.json({ message: err.message });
//   }
// };
// module.exports.getCompletedCultureClass = async (req, res) => {
//   try {
//     const classroom = await Classroom.find({
//       class_type: "CULTURE",
//       status: "COMPLETED",
//     });
//     if (!classroom) {
//       return res.json({ message: "no classroom found" });
//     }
//     return res.json(classroom);
//   } catch (err) {
//     res.json({ message: err.message });
//   }
// };
// module.exports.getCompletedServiceClass = async (req, res) => {
//   try {
//     const classroom = await Classroom.find({
//       class_type: "SERVICE",
//       status: "COMPLETED",
//     });
//     if (!classroom) {
//       return res.json({ message: "no classroom found" });
//     }
//     return res.json(classroom);
//   } catch (err) {
//     res.json({ message: err.message });
//   }
// };
// module.exports.getPassedStudentsofClass = async (req, res) => {
//   const { selectedClassId } = req.params;
//   // console.log(object)
//   try {
//     const passedStudents = await Student.find({
//       classroom: selectedClassId,
//       status: "Pass",
//     });

//     res.status(200).json(passedStudents);
//   } catch (error) {
//     console.error("Error fetching passed students:", error);
//     res.status(500).json({ message: "Failed to fetch passed students" });
//   }
// };
// module.exports.assignStudentToHLG = async (req, res) => {
//   const { hlgId } = req.params;
//   const { studentId } = req.body;

//   try {
//     // Check if student exists
//     const studentExists = await Student.findById(studentId);
//     if (!studentExists) {
//       return res.status(404).json({ message: "Student not found" });
//     }

//     // Find the HLG and update
//     const updatedHLG = await HLG.findByIdAndUpdate(
//       hlgId,
//       {
//         $addToSet: { members: studentId }, // prevents duplicates
//       },
//       { new: true }
//     ).populate("members");

//     if (!updatedHLG) {
//       return res.status(404).json({ message: "HLG not found" });
//     }

//     res.status(200).json({
//       message: "Student assigned to HLG successfully",
//       hlg: updatedHLG,
//     });
//   } catch (error) {
//     console.error("Error assigning student to HLG:", error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// };
// module.exports.assignStudentToServing = async (req, res) => {
//   const { sId } = req.params;
//   const { studentId } = req.body;

//   try {
//     // Check if student exists
//     const studentExists = await Student.findById(studentId);
//     if (!studentExists) {
//       return res.status(404).json({ message: "Student not found" });
//     }

//     // Find the HLG and update
//     const updatedServing = await Serving.findByIdAndUpdate(
//       sId,
//       {
//         $addToSet: { members: studentId }, // prevents duplicates
//       },
//       { new: true }
//     ).populate("members");

//     if (!updatedServing) {
//       return res.status(404).json({ message: "serving not found" });
//     }

//     res.status(200).json({
//       message: "Student assigned to serving successfully",
//       serving: updatedServing,
//     });
//   } catch (error) {
//     console.error("Error assigning student to serving:", error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// };
// module.exports.removeStudentFromHLG = async (req, res) => {
//   const { hlgId } = req.params;
//   const { studentId } = req.body;

//   try {
//     const updatedHLG = await HLG.findByIdAndUpdate(
//       hlgId,
//       {
//         $pull: { members: studentId },
//       },
//       { new: true }
//     ).populate("members");

//     if (!updatedHLG) {
//       return res.status(404).json({ message: "HLG not found" });
//     }

//     res.status(200).json({
//       message: "Student removed from HLG successfully",
//       hlg: updatedHLG,
//     });
//   } catch (error) {
//     console.error("Error removing student from HLG:", error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// };
// module.exports.removeStudentFromServing = async (req, res) => {
//   const { sId } = req.params;
//   const { studentId } = req.body;

//   try {
//     const updatedServing = await Serving.findByIdAndUpdate(
//       sId,
//       {
//         $pull: { members: studentId },
//       },
//       { new: true }
//     ).populate("members");

//     if (!updatedServing) {
//       return res.status(404).json({ message: "Serving not found" });
//     }

//     res.status(200).json({
//       message: "Student removed from Serving successfully",
//       serving: updatedServing,
//     });
//   } catch (error) {
//     console.error("Error removing student from Serving:", error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// };
// module.exports.getHlgMembers = async (req, res) => {
//   const { hlgId } = req.params;

//   try {
//     const hlg = await HLG.findById(hlgId).populate("members");

//     if (!hlg) {
//       return res.status(404).json({ message: "HLG not found" });
//     }

//     res.status(200).json(hlg.members);
//   } catch (err) {
//     console.error("Error fetching HLG members:", err);
//     res.status(500).json({ message: "Server error fetching HLG members" });
//   }
// };
// module.exports.getServingMembers = async (req, res) => {
//   const { sId } = req.params;

//   try {
//     const serving = await Serving.findById(sId).populate("members");

//     if (!serving) {
//       return res.status(404).json({ message: "serving not found" });
//     }

//     res.status(200).json(serving.members);
//   } catch (err) {
//     console.error("Error fetching serving members:", err);
//     res.status(500).json({ message: "Server error fetching serving members" });
//   }
// };
