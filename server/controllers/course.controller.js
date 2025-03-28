import { json } from "express";
import { Course } from "../models/course.model.js";
import { Lecture } from "../models/lecture.model.js";
import { deleteMediaFromCloudinary, deleteVideoFromCloudinary, uploadMedia } from "../utils/cloudinary.js"

export const createCourse = async (req, res) => {
    try {
        const { courseTitle, category } = req.body;

        // Corrected Validation Check
        if (!courseTitle || !category) {
            return res.status(400).json({
                message: "courseTitle and Category are required",
                success: false,
            });
        }

        const course = await Course.create({
            courseTitle,
            category,
            creator: req.user?.id || "Unknown"  // Ensure `req.user.id` exists
        });

        return res.status(201).json({
            message: "Course Created Successfully",
            success: true,
            course
        });
    } catch (error) {
        console.error("Error from createCourse:", error);
        return res.status(500).json({
            message: "Failed to Create Course",
            success: false,
        });
    }
};

// export const getPublishedCourse = async (_,res) => {
//     try {
//         const courses = await Course.find({isPublished:true}).populate({path:"creator", select:"name photoUrl"});
//         if(!courses){
//             return res.status(404).json({
//                 message:"Course not found"
//             })
//         }
//         return res.status(200).json({
//             courses,
//         })
//     } catch (error) {
//         console.log(error);
//         return res.status(500).json({
//             message:"Failed to get published courses"
//         })
//     }
// }

// ✅ Add this function to fix the error

export const searchCourse = async (req,res) => {
    try {
        const {query = "", categories = [], sortByPrice =""} = req.query;
        console.log(categories);
        
        // create search query
        const searchCriteria = {
            isPublished:true,
            $or:[
                {courseTitle: {$regex:query, $options:"i"}},
                {subTitle: {$regex:query, $options:"i"}},
                {category: {$regex:query, $options:"i"}},
            ]
        }

        // if categories selected
        if(categories.length > 0) {
            searchCriteria.category = {$in: categories};
        }

        // define sorting order
        const sortOptions = {};
        if(sortByPrice === "low"){
            sortOptions.coursePrice = 1;//sort by price in ascending
        }else if(sortByPrice === "high"){
            sortOptions.coursePrice = -1; // descending
        }

        let courses = await Course.find(searchCriteria).populate({path:"creator", select:"name photoUrl"}).sort(sortOptions);

        return res.status(200).json({
            success:true,
            courses: courses || []
        });

    } catch (error) {
        console.log(error);
        
    }
}

export const getPublishedCourse = async (_, res) => {
    try {
        const courses = await Course.find({ isPublished: true })
            .select("courseTitle coursePrice courseLevel instructor instructorImage courseThumbnail") // Include required fields
            .populate({ path: "creator", select: "name photoUrl" });

        if (!courses || courses.length === 0) {
            return res.status(404).json({
                message: "No published courses found",
                success: false,
            });
        }

        return res.status(200).json({
            courses,
            message: "Courses fetched successfully",
            success: true,
        });
    } catch (error) {
        console.error("Error fetching published courses:", error);
        return res.status(500).json({
            message: "Failed to get published courses",
            success: false,
        });
    }
};



export const getCreatorCourse = async (req, res) => {
    try {
        const courses = await Course.find({ creator: req.user?.id });

        return res.status(200).json({
            message: "Courses fetched successfully",
            success: true,
            courses
        });
    } catch (error) {
        console.error("Error fetching courses:", error);
        return res.status(500).json({
            message: "Failed to fetch courses",
            success: false,
        });
    }
};

export const editCourse = async (req, res) => {
    try {
        const courseId = req.params.courseId;
        const { courseTitle, subTitle, description, category, courseLevel, coursePrice } = req.body
        const thumbnail = req.file;

        let course = await Course.findById(courseId)
        if (!course) {
            return res.status(404).json({
                message: "Couese not Found",
                success: false,
            })
        }

        let courseThumbnail;
        if (thumbnail) {
            if (course.courseThumbnail) {
                const publicId = course.courseThumbnail.split("/").pop().split(".")[0];
                await deleteMediaFromCloudinary(publicId);   //delete old img
            }
            // upload a thumbnail on cloudinary
            courseThumbnail = await uploadMedia(thumbnail.path);
        }
        // updated data
        const updateData = { courseTitle, subTitle, description, category, courseLevel, coursePrice, courseThumbnail: courseThumbnail?.secure_url }

        course = await Course.findByIdAndUpdate(courseId, updateData, { new: true });

        return res.status(200).json({
            course,
            message: "Course Updated Successfully"
        })

    } catch (error) {
        console.error("Error Editing courses:", error);
        return res.status(500).json({
            message: "Failed to Edit courses",
            success: false,
        });
    }
}

export const getCourseById = async (req, res) => {
    try {
        const { courseId } = req.params;

        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({
                message: "Course not found",
                status: false
            })
        }
        return res.status(200).json({
            course,
            success: true,
        })
    } catch (error) {
        return res.status(500).json({
            message: "Failed to get data by ID",
            success: false,
        });
    }
}

export const creatreLecture = async (req, res) => {
    try {
        const { lectureTitle } = req.body;
        const { courseId } = req.params;

        if (!lectureTitle || !courseId) {
            return res.status(400).json({
                message: "Lecture and courseID are required ",
                status: false
            });
        }
        // create lec
        const lecture = await Lecture.create({ lectureTitle })
        const course = await Course.findById(courseId);
        if (course) {
            course.lectures.push(lecture._id);
            await course.save();
        }

        return res.status(201).json({
            lecture,
            Message: "Lecture Created successfully",
            success: true
        })

    } catch (error) {
        return res.status(500).json({
            message: "Failed to Create Lecture",
            success: false,
        });
    }
}

export const getCourseLecture = async (req, res) => {
    try {
        const { courseId } = req.params;
        const course = await Course.findById(courseId).populate("lectures");
        if (!course) {
            return res.status(404).json({
                message: "Course not Found",
                status: false
            });
        }
        return res.status(200).json({
            lectures: course.lectures,
            status: true,
            message: "Lecture found"
        })

    } catch (error) {
        return res.status(500).json({
            message: "Failed to Get Lecture",
            success: false,
        });
    }
}

export const editLecture = async (req, res) => {
    try {
        const { lectureTitle, videoInfo, isPreviewFree } = req.body;
        const { courseId, lectureId } = req.params;
        const lecture = await Lecture.findById(lectureId);
        if (!lecture) {
            return res.status(404).json({
                message: "Lecture not Found",
                success: true,
            })
        }
        // update lecture 
        if (lectureTitle) lecture.lectureTitle = lectureTitle;
        if (videoInfo?.videoUrl) lecture.videoUrl = videoInfo.videoUrl;
        if (videoInfo?.publicId) lecture.publicId = videoInfo.publicId;
        if (isPreviewFree) lecture.isPreviewFree = isPreviewFree;

        await lecture.save();

        // ensure the couse still has the lecture id if it was not already added
        const course = await Course.findById(courseId);
        if (course && !course.lectures.includes(lecture._id)) {
            course.lectures.push(lecture._id)
            await course.save()
        }
        return res.status(200).json({
            success: true,
            message: "Lecture updated Successfully",
            lecture
        })
    } catch (error) {
        return res.status(500).json({
            message: "Failed to Edit Lecture",
            success: false,
        });
    }
}

export const removeLecture = async (req, res) => {
    try {
        const { lectureId } = req.params;
        const lecture = await Lecture.findByIdAndDelete(lectureId);
        if (!lecture) {
            return res.status(404).json({
                message: "Lecture not found!"
            });
        }
        // delete the lecture from couldinary as well
        if (lecture.publicId) {
            await deleteVideoFromCloudinary(lecture.publicId);
        }

        // Remove the lecture reference from the associated course
        await Course.updateOne(
            { lectures: lectureId }, // find the course that contains the lecture
            { $pull: { lectures: lectureId } } // Remove the lectures id from the lectures array
        );

        return res.status(200).json({
            message: "Lecture removed successfully."
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Failed to remove lecture"
        })
    }
}

export const getLectureById = async (req, res) => {
    try {
        const { lectureId } = req.params;
        const lecture = await Lecture.findById(lectureId);
        if (!lecture) {
            return res.status(404).json({
                message: "Lecture not found!"
            });
        }
        return res.status(200).json({
            lecture
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Failed to get lecture by id"
        })
    }
}

// publish and unplush course logic
export const tooglePublishCourse = async (req, res) => {
    try {
        const { courseId } = req.params;
        const { publish } = req.query;  //true and false 
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({
                message: "Course not found"
            });
        }

        // publish status based on qurry parameter 
        course.isPublished = publish === "true";
        await course.save();
        const statusMessage = course.isPublished ? "Published" : "Unpublished";
        return res.status(200).json({
            message: `Course is ${statusMessage}`
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Failed to publish course, update stauts"
        })
    }
}