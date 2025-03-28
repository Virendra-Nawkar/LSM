import { Button } from '@/components/ui/button'
import { ArrowLeft, Divide } from 'lucide-react'
import React from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import LectureTab from './LectureTab'

const EditLecture = () => {
    const params = useParams();
    const courseId = params.courseId;
    return (
        <div>
            <div className='flex items-center justify-between mb-5' >
                <div className='flex gap-2 items-center'>
                    <Link to={`/admin/course/${courseId}/lecture`}>
                        <Button size='icon' variant="outline"
                            className="rounded-full">
                            <ArrowLeft size={16} />
                        </Button>
                    </Link>
                    <h1 className='font-bold text-xl'>Update your Lecture</h1>
                </div>
            </div>
            <LectureTab />
        </div>
    )
}

export default EditLecture
