import React from 'react'
import CourseSkeleton from './CourseSkeleton';
import Course from './Course';
import { useLoadUserQuery } from '@/features/api/authApi';


const MyLearning = () => {
    // const isLoading = false;
    const myLearningCouses = [];
    const { data, isLoading } = useLoadUserQuery();
    const myLearning = data?.user.enrolledCourses || [];
    return (
        <div className='max-w-4xl m-auto my-4 px-4 md:px-2 '>
            <h1 className='font-bold text-2xl '>My Learning</h1>
            <div className='my-5'>
                {
                    isLoading ? <CourseSkeleton /> : myLearning.length == 0 ? <p>No Courses Enrolled</p> :
                        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5'>
                            {myLearning.map((course, index) => <Course key={index} course={course} />)}
                        </div>
                    // solve the error : 4:12
                }
            </div>
        </div>
    )
}

export default MyLearning