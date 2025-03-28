import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/generateToken.js";
import { deleteMediaFromCloudinary, uploadMedia } from "../utils/cloudinary.js";
// import { CourseDB } from "../models/Course.js"; // ✅ Import Course model
// import { Lecture } from "../models/Lecture.js"; // ✅ Import Lecture model

export const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }
        const user = await User.findOne({ email })
        if (user) {
            return res.status(400).json({
                success: false,
                message: "User already exists"
            });
        }

        const hasedPassword = await bcrypt.hash(password, 10);
        await User.create({
            // why you now wriite name : name becuse when the both name are samae it 
            // automatcially make changes and put required value in it
            name,
            email,
            password: hasedPassword
        });
        return res.status(201).json({
            success: true,
            message: "Account created successfully"
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to Register"
        })
    }
}


export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Incorect Email or  Password"
            });
        }

        const isPasswordMatched = await bcrypt.compare(password, user.password);
        if (!isPasswordMatched) {
            return res.status(400).json({
                success: false,
                message: "Incorect Email or  Password"
            });
        }

        generateToken(res, user, `Welcome back ${user.name}`);

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: "Failed to Login"
        })
    }
}

export const logout = async (_, res) => {
    try {
        return res.status(200).cookie("token", "", { maxAge: 0 }).json({
            message: "Logout success",
            success: true,
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: "Failed to Logout"
        })
    }
}

// export const getUserProfile = async (req, res) => {
//     const userId = req.id;
//     const user = await User.findOne(userId).select("-password").populate("enrolledCourses");
//     // try {
//     //     if (!req.user) {
//     //         return res.status(404).json({
//     //             success: false,
//     //             message: "Profile not found"
//     //         });
//     //     }

//     //     return res.status(200).json({
//     //         success: true,
//     //         message: "Profile found",
//     //         user: req.user  // ✅ Ensure user data is included
//     //     });
        
//     // } catch (error) {
//     //     console.error("Error in getUserProfile:", error);
//     //     return res.status(500).json({
//     //         success: false,
//     //         message: "Failed to load user"
//     //     });

//         try {
//         if (!req.user) {
//             return res.status(404).json({
//                 success: false,
//                 message: "Profile not found"
//             });
//         }

//         return res.status(200).json({
//             success: true,
//             message: "Profile found",
//             user: req.user  // ✅ Ensure user data is included
//         });
        
//     } catch (error) {
//         console.error("Error in getUserProfile:", error);
//         return res.status(500).json({
//             success: false,
//             message: "Failed to load user"
//         });
//     }
// };

// chatgpt code
// export const getUserProfile = async (req, res) => {
//     const userId = req.user._id;  // Assuming you're using `req.user` for authentication
//     const user = await User.findOne({ _id: userId })
//       .select("-password") // Exclude password field
//       .populate("enrolledCourses"); // Populate enrolled courses, if necessary
//     try {
  
//       if (!user) {
//         return res.status(404).json({
//           success: false,
//           message: "Profile not found",
//         });
//       }
  
//       return res.status(200).json({
//         success: true,
//         message: "Profile found",
//         user,  // Returning the user object
//       });
//     } catch (error) {
//       console.error("Error in getUserProfile:", error);
//       return res.status(500).json({
//         success: false,
//         message: "Failed to load user",
//       });
//     }
//   };
  
export const getUserProfile = async (req, res) => {
    try {
      const userId = req.user._id;  // Assuming you're using `req.user` for authentication
      const user = await User.findOne({ _id: userId })
        .select("-password") // Exclude password field
        .populate("enrolledCourses"); // Populate enrolled courses, if necessary
  
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "Profile not found",
        });
      }
  
      // Extract the profileUrl and creatorName from the user object
      const profileUrl = user.photoUrl;  // From the user object
      const creatorName = user.name;     // From the user object
  
      return res.status(200).json({
        success: true,
        message: "Profile found",
        user,  // Returning the user object
        profileUrl,  // Sending the profile URL
        creatorName,  // Sending the creator name
      });
    } catch (error) {
      console.error("Error in getUserProfile:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to load user",
      });
    }
  };
  
  




export const updateProfile = async (req, res) => {
    try {
        console.log("File uploaded:", req.file); // Check if file is being uploaded
        const userId = req.user.id;
        const { name, email } = req.body;
        const profilePhoto = req.file ? req.file.path : null; // Ensure file upload is working

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // Only update fields if new data is provided
        user.name = name || user.name;
        user.email = email || user.email;

        if (profilePhoto) {
            // Delete the old profile photo if exists in Cloudinary
            if (user.photoUrl) {
                const publicId = user.photoUrl.split("/").pop().split(".")[0]; // Extract public ID
                console.log("Deleting old photo from Cloudinary:", publicId); // Debugging line
                await deleteMediaFromCloudinary(publicId);
            }

            // Upload the new profile photo to Cloudinary
            console.log("Uploading new profile photo to Cloudinary:", profilePhoto); // Debugging line
            const cloudResponse = await uploadMedia(profilePhoto);
            console.log("Cloudinary upload response:", cloudResponse); // Debugging line
            user.photoUrl = cloudResponse.secure_url;
        }

        // Save updated user
        await user.save();

        return res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            user,
        });

    } catch (error) {
        console.error("Error updating profile:", error); // Log the actual error
        return res.status(500).json({ success: false, message: "Failed to update profile", error: error.message });
    }
};
