import express from 'express';
import isAuthenticated from '../middlewares/isAuthenticated.js';
import {
    createCourse, creatreLecture, editCourse, editLecture, getCourseById,
    getCourseLecture, getCreatorCourse, getLectureById, getPublishedCourse, removeLecture,
    searchCourse,
    tooglePublishCourse
} from '../controllers/course.controller.js';
import upload from "../utils/multer.js";

const router = express.Router();

router.route("/").post(isAuthenticated, createCourse);
router.route("/search").get(isAuthenticated, searchCourse);
router.route("/published-courses").get( getPublishedCourse);
router.route("/").get(isAuthenticated, getCreatorCourse);
router.route("/:courseId").put(isAuthenticated, upload.single("courseThumbnail"), editCourse);
router.route("/:courseId").get(isAuthenticated, getCourseById);
router.route("/:courseId/lecture").post(isAuthenticated, creatreLecture);
router.route("/:courseId/lecture").get(isAuthenticated, getCourseLecture);
router.route("/:courseId/lecture/:lectureId").post(isAuthenticated, editLecture);
router.route("/lecture/:lectureId").delete(isAuthenticated, removeLecture);
router.route("/lecture/:lectureId").get(isAuthenticated, getLectureById);
router.route("/:courseId").patch(isAuthenticated, tooglePublishCourse);

export default router;
