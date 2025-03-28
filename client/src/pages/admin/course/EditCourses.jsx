import { Button } from '@/components/ui/button'
import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import CourseTab from './CourseTab';




const EditCourses = () => {
    const navigate = useNavigate();
  return (
    <div className='flex-1'>
        <div className='flex items-center justify-between mb-5'>
            <h1 className='font-bold  text-xl '>Add Details Information regarding course</h1>
            <Link  to="lecture">
            <Button variant="outline">Go to Lecture Page</Button>
            </Link>
        </div>
        <CourseTab/>
    </div>
  )
}

export default EditCourses