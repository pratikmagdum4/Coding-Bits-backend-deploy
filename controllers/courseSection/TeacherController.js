import Course from "../../models/courseSection/course.js";
import Teacher from "../../models/courseSection/teacher.js";
import userModel from "../../models/userModel.js";
import Student from "../../models/courseSection/student.js";


const addCourseByTeacher = async (req, res) => {
  const { title, description, price, duration, image, category, type, liveDetails, recordings } = req.body;
  const teacherId = req.user.id;

  try {
    if (!title || !description || !price || !duration || !image || !category || !type) {
      return res.status(400).json({ message: "All fields are required." });
    }
    const updatedcategory = Array.isArray(category) ? category : [];


    const teacher = await Teacher.findById(teacherId);
    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found." });
    }

    const newCourse = new Course({
      title,
      description,
      instructor: teacher.name,
      price,
      duration,
      image,
      category: updatedcategory,
      type,
      liveDetails: type === "Live" ? liveDetails : null,
      recordings: type === "Recorded" ? recordings : [],
      isPublished: false,
      creatorId: teacherId
    });

    const savedCourse = await newCourse.save();

    teacher.courses.push(savedCourse._id);
    await teacher.save();

    res.status(201).json({
      message: "Course created successfully!",
      course: savedCourse,
    });
  } catch (error) {
    console.error("Error creating course:", error);
    res.status(500).json({ message: "Failed to create course." });
  }
};


// Controller to update a course
const updateCourse = async (req, res) => {
  const { id } = req.params; // Course ID
  const { title, description, price, duration, image, category, type, liveDetails, recordings, isPublished } = req.body;
  const teacherId = req.user._id;
  const updatedcategory = Array.isArray(category) ? category : [];

  try {
    const course = await Course.findById(id);
    if (!course) {
      return res.status(404).json({ message: "Course not found." });
    }

    // if (course.instructor !== req.user.name) {
    //   return res.status(403).json({ message: "You are not authorized to update this course." });
    // }

    course.title = title || course.title;
    course.description = description || course.description;
    course.price = price || course.price;
    course.duration = duration || course.duration;
    course.image = image || course.image;
    course.category = updatedcategory || course.category;
    course.type = type || course.type;
    course.liveDetails = type === "Live" ? liveDetails : null;
    course.recordings = type === "Recorded" ? recordings : [];
    course.isPublished = isPublished || course.isPublished;
    const updatedCourse = await course.save();

    res.status(200).json({
      message: "Course updated successfully!",
      course: updatedCourse,
    });
  } catch (error) {
    console.error("Error updating course:", error);
    res.status(500).json({ message: "Failed to update course." });
  }
};



 const getAllCoursesByTeacher = async (req, res) => {
  try {
    const id = req.user.id;
    const courses = await Course.find({ creatorId: id });
    if (!courses) {
      return res.status(404).json({ msg: "No courses found" })
    }
    res.status(200).json(courses);
  } catch (error) {
    console.error("Error fetching courses:", error);
    res.status(500).json({ message: "Failed to fetch courses." });
  }
};


const getCourseById = async (req, res) => {
  const { id } = req.params;

  try {
    const course = await Course.findById(id);
    if (!course) {
      return res.status(404).json({ message: "Course not found." });
    }

    res.status(200).json(course);
  } catch (error) {
    console.error("Error fetching course:", error);
    res.status(500).json({ message: "Failed to fetch course." });
  }
};




const deleteCourse = async (req, res) => {
  const { id } = req.params;
  const teacherId = req.user._id;

  try {
    const course = await Course.findById(id);
    if (!course) {
      return res.status(404).json({ message: "Course not found." });
    }

    // if (course.instructor !== req.user.name) {
    //   return res.status(403).json({ message: "You are not authorized to delete this course." });
    // }

    const teacher = await Teacher.findById(teacherId);
    if (teacher) {
      teacher.courses = teacher.courses.filter(
        (courseId) => courseId.toString() !== id
      );
      await teacher.save();
    }

    await Course.findByIdAndDelete(id);

    res.status(200).json({ message: "Course deleted successfully!" });
  } catch (error) {
    console.error("Error deleting course:", error);
    res.status(500).json({ message: "Failed to delete course." });
  }
};


const AddUpdateTeacherProfile = async (req, res) => {
  try {
    const { name, email, password, bio, courses } = req.body;
    const id = req.user.id;
    const user = await userModel.findById(id);
    const pass = user.password;
    const updatedCourses = Array.isArray(courses) ? courses : [];

    let teacher = await Teacher.findById(id);

    if (!teacher) {
      teacher = new Teacher({
        _id: id,
        name,
        email,
        password: pass,
        bio,
        courses: updatedCourses,
      });
    } else {
      teacher.name = name || teacher.name;
      teacher.email = email || teacher.email;
      teacher.password = password || teacher.password;
      teacher.bio = bio || teacher.bio;
      teacher.courses = updatedCourses.length > 0 ? updatedCourses : teacher.courses;
    }

    await teacher.save();

    res.status(200).json({
      msg: "Teacher profile updated successfully",
      teacher: {
        _id: teacher._id,
        name: teacher.name,
        email: teacher.email,
        bio: teacher.bio,
        courses: teacher.courses,
        ratings: teacher.ratings,
        createdAt: teacher.createdAt,
        updatedAt: teacher.updatedAt,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Internal Server error" });
  }
};
const getTeacherProfile = async (req, res) => {
  try {
    const id = req.user.id;

    const teacher = await Teacher.findOne({ _id: id });
    if (!teacher) {
      return res.status(404).json({ msg: "Teacher not found" })
    }
    res.status(200).json(teacher);
  } catch (error) {
    console.error(err);
    res.status(500).json({ msg: "Internal Server error" });
  }
}

const getEnrolledStudents = async (req, res) => {
  try {
    const { courseId } = req.params;
    const students = await Student.find({ enrolledCourses: courseId }).select(
      "name email progress"
    );
    res.status(200).json(students);
  } catch (error) {
    console.error("Error fetching enrolled students:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
export { addCourseByTeacher, AddUpdateTeacherProfile, getTeacherProfile, getEnrolledStudents, getAllCoursesByTeacher, deleteCourse, getCourseById, updateCourse }