import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import React, { useEffect, useState } from 'react'
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useEditCourseMutation, useGetCourseByIdQuery, usePublishCourseMutation } from '@/features/api/courseApi';
import { toast } from 'sonner';
import { to } from 'react-spring';

const CourseTab = () => {
    const params = useParams();
    const courseId = params.courseId;
    const [publishCourse, { }] = usePublishCourseMutation();

    const [previewThumbnail, setPreviewThumbnail] = useState("")
    const [input, setInput] = useState({
        courseTitle: "",
        subTitle: "",
        description: "",
        category: "",
        courseLevel: "",
        coursePrice: "",
        courseThumbnail: ""
    });

    const { data: courseByIdData, isLoading: courseByIdIsLoading, refetch } = useGetCourseByIdQuery(courseId, { refetchOnMountOrArgChange: true });

    useEffect(() => {
        if (courseByIdData?.course) {
            const course = courseByIdData?.course
            setInput({
                courseTitle: course.courseTitle,
                subTitle: course.subTitle,
                description: course.description,
                category: course.category,
                courseLevel: course.courseLevel,
                coursePrice: course.coursePrice,
                courseThumbnail: course.courseThumbnail
            })
        }
    }, [courseByIdData])




    const [editCourse, { data, isLoading, isSuccess, error }] = useEditCourseMutation();
    const changeEventHandler = (e) => {
        const { name, value } = e.target;
        setInput({
            ...input,  // Spread the previous state
            [name]: value,  // Update the specific field with the new value
        });
    };

    const selectCategory = (value) => {
        setInput({ ...input, category: value });
    }

    const selectCourseLevel = (value) => {
        setInput({ ...input, courseLevel: value });
    }

    const selectThumbnail = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setInput({ ...input, courseThumbnail: file })
            const fileReader = new FileReader();
            fileReader.onloadend = () => setPreviewThumbnail(fileReader.result)
            fileReader.readAsDataURL(file);

        }
    }

    const updateCourseHandler = async () => {
        const formData = new FormData()
        formData.append("courseTitle", input.courseTitle)
        formData.append("subTitle", input.subTitle)
        formData.append("description", input.description)
        formData.append("category", input.category)
        formData.append("courseLevel", input.courseLevel)
        formData.append("coursePrice", input.coursePrice)
        formData.append("courseThumbnail", input.courseThumbnail)

        await editCourse({ courseId, formData }); // Pass an object containing courseId and formData
    }


    useEffect(() => {
        if (isSuccess) {
            toast.success(data.message || "Course Updated");
        }
        if (error) {
            toast.error(error.message || "Falied to Update Course")
        }
    }, [isSuccess, error])


    // usePublishCourseMutation
    const publishStatusHandler = async (action) => {
        try {
            const response = await publishCourse({ courseId, query: action });
            if (response.data) {
                refetch();
                toast.success(response.data.message || "message from course tab 107")
            }
        } catch (error) {
            toast.error("Failed to Publish or Unpublish Course")
        }
    }
    const navigate = useNavigate()
    return (
        <Card>
            <CardHeader className="flex flex-row justify-between">
                <div>
                    <CardTitle>Basic Course Information</CardTitle>
                    <CardDescription>Make Changes to your course here and click save when you are done</CardDescription>
                </div>
                <div className='space-x-2'>
                    {/* <Button variant="outline" disabled={courseByIdData?.course.lectures.length === 0} onClick={() => publishStatusHandler(courseByIdData?.course.isPublished ? "false" : "true")}>
                        {
                            courseByIdData?.course.isPublished ? "Unpublish" : "Publish"
                        }
                    </Button> */}
                    <div className="relative group">
                        <Button
                            variant="outline"
                            disabled={courseByIdData?.course.lectures.length === 0}
                            onClick={() => publishStatusHandler(courseByIdData?.course.isPublished ? "false" : "true")}
                            className="dark:bg-gray-800 dark:text-white dark:border-gray-700 cursor-pointer disabled:cursor-not-allowed"
                        >
                            {courseByIdData?.course.isPublished ? "Unpublish" : "Publish"}
                        </Button>
                        {/* {courseByIdData?.course.lectures.length === 0 && (
                            <div className="absolute left-0 mt-2 hidden w-max bg-gray-800 text-white text-sm px-2 py-1 rounded-md group-hover:block dark:bg-gray-700">
                                Add lectures to publish the course
                            </div>
                        )} */}
                        <Button>Remove Course</Button>
                    </div>


                </div>
            </CardHeader>
            <CardContent>
                <div className='space-y-4 mt-5'>
                    <div>
                        <Label>Title</Label>
                        <Input
                            type="text"
                            value={input.courseTitle}
                            onChange={changeEventHandler}
                            name="courseTitle"
                            placeholder="Enter your course Title" />
                    </div>

                    <div>
                        <Label>Course Subtitle</Label>
                        <Input
                            type="text"
                            name="subTitle"
                            value={input.subTitle}
                            onChange={changeEventHandler}
                            placeholder="Enter your course Subtitle" />
                    </div>

                    <div>
                        <Label>Description</Label>
                        <Textarea
                            value={input.description}
                            onChange={changeEventHandler}
                            name="description" // Add name attribute
                        />
                    </div>

                    <div className='flex items-center gap-5'>
                        <div>
                            <Label>Category</Label>
                            <Select onValueChange={selectCategory}>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Select a Category " />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Category</SelectLabel>
                                        <SelectItem value="Next JS">Next JS</SelectItem>
                                        <SelectItem value="Data Science">Data Science</SelectItem>
                                        <SelectItem value="Frontend Development">Frontend Development</SelectItem>
                                        <SelectItem value="Fullstack Development">Fullstack Development</SelectItem>
                                        <SelectItem value="MERN Stack Development">MERN Stack Development</SelectItem>
                                        <SelectItem value="Javascript">Javascript</SelectItem>
                                        <SelectItem value="Python">Python</SelectItem>
                                        <SelectItem value="Docker">Docker</SelectItem>
                                        <SelectItem value="MongoDB">MongoDB</SelectItem>
                                        <SelectItem value="HTML">HTML</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <Label>Course Level</Label>
                            <Select onValueChange={selectCourseLevel}>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Select Level " />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Category</SelectLabel>
                                        <SelectItem value="Begineer">Begineer</SelectItem>
                                        <SelectItem value="Medium">Medium</SelectItem>
                                        <SelectItem value="Advance">Advance</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <Label>Price</Label>
                            <Input
                                type="number"
                                name="coursePrice"
                                value={input.coursePrice}
                                onChange={changeEventHandler}
                                placeholder="Price in INR ₹"
                                className="w-fit"
                            />
                        </div>
                    </div>

                    <div>
                        <Label>Course Thumbnail</Label>
                        <Input
                            type="file"
                            onChange={selectThumbnail}
                            accept="image/*"
                            className="w-fit"
                        />{
                            previewThumbnail && (
                                <img src={previewThumbnail} className='my-2 h-50 w-90 object-cover'
                                    alt='courseThumbnail'
                                />
                            )
                        }
                    </div>

                    <div>
                        <Button onClick={() => navigate("/admin/course")} variant="outline" className=" ">Cancel</Button>
                        <Button disabled={isLoading} onClick={updateCourseHandler}>{
                            isLoading ? <><Loader2 className='animate-spin mr-2 h-4 w-4' />Please Wait</> : "Save"
                        }</Button>
                    </div>

                </div>
            </CardContent>
        </Card>
    );
};

export default CourseTab;
