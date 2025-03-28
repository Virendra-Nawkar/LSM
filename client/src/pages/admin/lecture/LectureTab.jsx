import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { Progress } from "@/components/ui/progress"
import { useEditLectureMutation, useGetLectureByIdQuery, useRemoveLectureMutation } from '@/features/api/courseApi'
import { useParams } from 'react-router-dom'
import { Loader, Loader2 } from 'lucide-react'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

const LectureTab = () => {
    const [lectureTitle, setLectureTitle] = useState("");
    const [uploadVideoInfo, setUploadVideoInfo] = useState(null);
    const [isFree, setIsFree] = useState(false);
    const [mediaProgress, setMediaProgress] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [buttonDisable, setButtonDisable] = useState(true);
    const [openDialog, setOpenDialog] = useState(false);
    const MEDIA_API = "http://localhost:8080/api/v1/media";

    // ✅ Fix: Call useParams() correctly
    const params = useParams();
    const { courseId, lectureId } = params;

    const { data: lectureData } = useGetLectureByIdQuery(lectureId);
    const lecture = lectureData?.lecture;

    useEffect(() => {
        if (lecture) {
            setLectureTitle(lecture.lectureTitle)
            setIsFree(lecture.isPreviewFree)
            setUploadVideoInfo(lecture.videoInfo)
        }
    }, [lecture])


    const fileChangeHander = async (e) => {
        const file = e.target.files[0];
        if (file) {
            const formData = new FormData();
            formData.append("file", file);
            setMediaProgress(true);

            try {
                const res = await axios.post(`${MEDIA_API}/upload-video`, formData, {
                    onUploadProgress: ({ loaded, total }) => {
                        setUploadProgress(Math.round((loaded * 100) / total));
                    }
                });

                if (res.data.success) {
                    console.log(res, "Lecture tab se aaraha hai");
                    setUploadVideoInfo({ videoUrl: res.data.data.url, publicId: res.data.data.publicId });
                    setButtonDisable(false);
                    toast.success(res.data.message);
                }
            } catch (error) {
                console.log(error, "Error from lecture tab");
                toast.error("Video Upload failed");
            } finally {
                setMediaProgress(false);
            }
        }
    };

    const [editLecture, { data, isLoading, error, isSuccess }] = useEditLectureMutation();

    const editLectureHandler = async () => {
        if (!courseId || !lectureId) {
            toast.error("Invalid course or lecture ID");
            return;
        }

        await editLecture({
            lectureTitle,
            videoInfo: uploadVideoInfo,
            isPreviewFree: isFree,
            courseId,
            lectureId
        });
    };

    useEffect(() => {
        if (isSuccess) {
            toast.success(data.message);
        }
        if (error) {
            toast.error(error?.data?.message || "Failed to update lecture");
        }
    }, [isSuccess, error, data]);

    const [removeLecture, { data: removeData, isLoading: removeLoading, isSuccess: removeSuccess }] = useRemoveLectureMutation();

    const handleRemoveLecture = async () => {
        try {
            await removeLecture(lectureId);
            toast.success("Lecture removed successfully");
            setOpenDialog(false);
        } catch (error) {
            toast.error(error?.data?.message || "Failed to remove lecture");
        }
    };

    useEffect(() => {
        if (removeSuccess) {
            toast.success(removeData.message);
        }
    }, [removeSuccess, removeData]);

    return (
        <Card>
            <CardHeader className="flex justify-between">
                <div>
                    <CardTitle>Edit Lecture</CardTitle>
                    <CardDescription>Make changes to your lecture and click on save</CardDescription>
                </div>
                <div className='flex items-center gap-2'>
                    <AlertDialog open={openDialog} onOpenChange={setOpenDialog}>
                        <AlertDialogTrigger asChild>
                            <Button variant="destructive" disabled={removeLoading}>
                                {removeLoading ? <><Loader2 className="animate-spin" />Please Wait</> : "Remove"}
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete the lecture.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={handleRemoveLecture}>
                                    {removeLoading ? <><Loader className='animate-spin mr-2 h-4 w-4' />Removing....</> : "Continue"}
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            </CardHeader>
            <CardContent>
                <div>
                    <Label>Title</Label>
                    <Input
                        type="text"
                        value={lectureTitle}
                        onChange={(e) => setLectureTitle(e.target.value)}
                        placeholder="Enter title here"
                        className="w-fit"
                    />
                </div>

                <div className='my-5'>
                    <Label>Video <span className='text-red-500'>*</span></Label>
                    <Input
                        type="file"
                        accept="video/*"
                        onChange={fileChangeHander}
                        placeholder="Upload video"
                        className="w-fit"
                    />
                </div>

                <div className='flex items-center space-x-2 my-5'>
                    <Switch
                        id="airplane-mode"
                        checked={isFree}
                        onCheckedChange={() => setIsFree(!isFree)}
                    />
                    <Label htmlFor="airplane-mode">Is Video Free</Label>
                </div>

                {mediaProgress && (
                    <div className='my-4'>
                        <Progress value={uploadProgress} />
                        <p>{uploadProgress}% uploaded</p>
                    </div>
                )}

                <div className='mt-5'>
                    <Button onClick={editLectureHandler}  >
                        {isLoading ? <><Loader2 className='animate-spin mr-2 h-4 w-4' />Please Wait</> : "Update Lecture"}
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}

export default LectureTab;
