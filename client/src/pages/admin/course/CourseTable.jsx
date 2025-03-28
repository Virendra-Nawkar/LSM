import { Button } from '@/components/ui/button';
import React, { useEffect } from 'react';
import { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useNavigate } from 'react-router-dom';
import { useGetCreatorCourseQuery } from '@/features/api/courseApi.js';
import { Badge } from '@/components/ui/badge';
import { Edit, Edit2 } from 'lucide-react';
import { toast } from 'sonner';

const CourseTable = () => {
    // ✅ Hooks must be at the top level
    const { data, isLoading, isSuccess, error } = useGetCreatorCourseQuery();
    const navigate = useNavigate();

    if (isLoading) return <h1 className='text-7xl'>Loading...</h1>;
    
    

    return (
        <div>
            <Button onClick={() => navigate('/admin/course/create')}>
                Create a New Course
            </Button>

            <Table>
        <TableCaption>A list of your recent courses.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Price</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Title</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data?.courses.map((course) => (
            <TableRow key={course._id}>
              <TableCell className="font-medium">{course?.coursePrice || "NA"}</TableCell>
              <TableCell> <Badge>{course.isPublished ? "Published" : "Draft"}</Badge> </TableCell>
              <TableCell>{course.courseTitle}</TableCell>
              <TableCell className="text-right">
                 <Button size='sm' variant='ghost' onClick={() => navigate(`${course._id}`)}><Edit2/></Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default CourseTable;
