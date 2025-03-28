import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useCreateLectureMutation, useGetCourseLectureQuery } from '@/features/api/courseApi'

import { Loader2, MoveLeft } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import Lecture from './Lecture'

const CreateLecture = () => {
    const params = useParams();
    const courseId = params.courseId;
    const [lectureTitle, setLectureTitle] = useState("")
    // const isLoading = false;
    const navigate = useNavigate();

    const [createLecture, { data, error, isLoading, isSuccess }] = useCreateLectureMutation();

    const createLectureHandler = async () => {
        await createLecture({ lectureTitle, courseId });
    }

    useEffect(() => {
        if (isSuccess) {
            toast.success(data.message || "Success - CreateLec"),
            refetch();
        }
        if (error) {
            toast.error(error.data.message || "Error -creatre lec")
        }
    }, [isSuccess, error])

    const { data: lectureData, isLoading: lectureLoading, error: lectureError, refetch } = useGetCourseLectureQuery(courseId)

    console.log(lectureData);

    return (
        <div className='flex-1  mx-10' >
            <div className='mb-4'>
                <h1 className='font-bold text-xl'>Add Lecture and Basic details to Lecture </h1>
                <p className='text-sm'>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Harum, tempore.</p>
            </div>
            <div className='space-y-4'>
                <div>
                    <Label>Title</Label>
                    <Input type="text"
                        value={lectureTitle}
                        onChange={(e) => setLectureTitle(e.target.value)}
                        name="lectureTitle" placeholder="Your lecture Title" className="w-1/2" />
                </div>


                <div className='flex gap-2 items-center'>
                    <Button variant="outline"
                        onClick={() => navigate(`/admin/course/${courseId}`)
                        }>
                        <MoveLeft /> Back to Course
                    </Button>
                    <Button disabled={isLoading} onClick={createLectureHandler} >{
                        isLoading ? <><Loader2 className=' h-4 w-4 animate-spin' />Please Wait...</> : <>Create Lecture</>

                    }
                    </Button>
                </div>
                <div className='mt-10'>
                    {
                        lectureLoading ? (<p>Lecture Loading...</p>) :
                            lectureError ? (<p>Failed to Load Lectures.</p>) :
                                lectureData.lectures.length === 0 ? (<p>No Lecture Available</p>) :
                                    lectureData.lectures.map((lecture, index) => (
                                        <Lecture key={lecture._id} lecture={lecture} index={index} courseId={courseId}/>
                                    ))
                    }
                </div>
            </div>
        </div>
    )
}

export default CreateLecture
