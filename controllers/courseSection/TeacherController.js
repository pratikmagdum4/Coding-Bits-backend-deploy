import Course from "../../models/courseSection/course";
import Teacher from "../../models/courseSection/teacher.js";


 const addCourseByTeacher = async (req, res) => {
  const { title, description, price, duration, image, category, type, liveDetails, recordings } = req.body;
  const teacherId = req.user.id; // Assuming teacher ID is available in the request (from authentication middleware)

  try {
    // Validate required fields
    if (!title || !description || !price || !duration || !image || !category || !type) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // Check if the teacher exists
    const teacher = await Teacher.findById(teacherId);
    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found." });
    }

    // Create a new course
    const newCourse = new Course({
      title,
      description,
      instructor: teacher.name, // Use the teacher's name as the instructor
      price,
      duration,
      image,
      category: category.split(","), // Convert category string to array
      type,
      liveDetails: type === "Live" ? liveDetails : null, // Only include liveDetails if type is "Live"
      recordings: type === "Recorded" ? recordings : [], // Only include recordings if type is "Recorded"
      isPublished: false, // Default to unpublished
    });

    // Save the course to the database
    const savedCourse = await newCourse.save();

    // Associate the course with the teacher
    teacher.courses.push(savedCourse._id); // Add the course ID to the teacher's courses array
    await teacher.save();

    // Return the created course
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
export const updateCourse = async (req, res) => {
  const { id } = req.params; // Course ID
  const { title, description, price, duration, image, category, type, liveDetails, recordings } = req.body;
  const teacherId = req.user._id; // Teacher ID from authentication

  try {
    // Find the course
    const course = await Course.findById(id);
    if (!course) {
      return res.status(404).json({ message: "Course not found." });
    }

    // Check if the teacher is the instructor of the course
    if (course.instructor !== req.user.name) {
      return res.status(403).json({ message: "You are not authorized to update this course." });
    }

    // Update course fields
    course.title = title || course.title;
    course.description = description || course.description;
    course.price = price || course.price;
    course.duration = duration || course.duration;
    course.image = image || course.image;
    course.category = category ? category.split(",") : course.category;
    course.type = type || course.type;
    course.liveDetails = type === "Live" ? liveDetails : null;
    course.recordings = type === "Recorded" ? recordings : [];

    // Save the updated course
    const updatedCourse = await course.save();

    // Return the updated course
    res.status(200).json({
      message: "Course updated successfully!",
      course: updatedCourse,
    });
  } catch (error) {
    console.error("Error updating course:", error);
    res.status(500).json({ message: "Failed to update course." });
  }
};



// Controller to get all courses
export const getAllCourses = async (req, res) => {
  try {
    // Fetch all courses
    const courses = await Course.find();

    // Return the courses
    res.status(200).json(courses);
  } catch (error) {
    console.error("Error fetching courses:", error);
    res.status(500).json({ message: "Failed to fetch courses." });
  }
};


// Controller to get a course by ID
export const getCourseById = async (req, res) => {
  const { id } = req.params; // Course ID

  try {
    // Find the course by ID
    const course = await Course.findById(id);
    if (!course) {
      return res.status(404).json({ message: "Course not found." });
    }

    // Return the course
    res.status(200).json(course);
  } catch (error) {
    console.error("Error fetching course:", error);
    res.status(500).json({ message: "Failed to fetch course." });
  }
};




// Controller to delete a course
export const deleteCourse = async (req, res) => {
  const { id } = req.params; // Course ID
  const teacherId = req.user._id; // Teacher ID from authentication

  try {
    // Find the course
    const course = await Course.findById(id);
    if (!course) {
      return res.status(404).json({ message: "Course not found." });
    }

    // Check if the teacher is the instructor of the course
    if (course.instructor !== req.user.name) {
      return res.status(403).json({ message: "You are not authorized to delete this course." });
    }

    // Remove the course from the teacher's courses array
    const teacher = await Teacher.findById(teacherId);
    if (teacher) {
      teacher.courses = teacher.courses.filter(
        (courseId) => courseId.toString() !== id
      );
      await teacher.save();
    }

    // Delete the course
    await Course.findByIdAndDelete(id);

    // Return success message
    res.status(200).json({ message: "Course deleted successfully!" });
  } catch (error) {
    console.error("Error deleting course:", error);
    res.status(500).json({ message: "Failed to delete course." });
  }
};