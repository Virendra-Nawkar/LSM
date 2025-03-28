import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import MainLayout from './layout/MainLayout'; // Make sure this import is correct
import HeroSection from './pages/student/HeroSection';
import Courses from './pages/student/Courses';
import Login from './pages/Login';
import MyLearning from './pages/student/MyLearning';
import MyProfile from './pages/student/Profile';
import Sidebar from './pages/admin/Sidebar';
import Dashboard from './pages/admin/Dashboard';
import CourseTable from './pages/admin/course/CourseTable';
import AddCourse from './pages/admin/course/AddCourse';
import EditCourses from './pages/admin/course/EditCourses';
import CourseTab from './pages/admin/course/CourseTab';
import CreateLecture from './pages/admin/lecture/CreateLecture';
import Lecture from './pages/admin/lecture/Lecture';
import EditLecture from './pages/admin/lecture/EditLecture';
import CourseDetail from './pages/student/CourseDetail';
import CourseProgress from './pages/student/CourseProgress';
import SearchPage from './pages/student/SearchPage';
import { AdminRoute, AuthenticatedUser, ProtectRoute } from './components/ProtectedRoutes';
import PurchaseCourseProtectedRoute from './components/PurchaseCourseProtectedRoute';
import { ThemeProvider } from './components/ThemeProvider';

const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,  // Navbar will be inside MainLayout
    children: [
      {
        path: "/",
        element: (
          <>
            <HeroSection />
            <Courses />
          </>
        ), // Renders HeroSection and Courses on the homepage
      },
      {
        path: "/my-learning",
        element: <ProtectRoute> <MyLearning /> </ProtectRoute>
      },
      {
        path: "/course/search",
        element: <ProtectRoute>  <SearchPage /> </ProtectRoute>
      },
      {
        path: "/profile",
        element: <ProtectRoute> <MyProfile />  </ProtectRoute>
      },

      {
        path: "/login",
        element: <AuthenticatedUser> <Login /> </AuthenticatedUser>
      },

      {
        path: "/course-detail/:courseId",
        element: <ProtectRoute>  <CourseDetail />  </ProtectRoute> // Login page is separate from MainLayout
      },

      {
        path: "/course-progress/:courseId",
        element: <ProtectRoute>
          <PurchaseCourseProtectedRoute>
            <CourseProgress />
          </PurchaseCourseProtectedRoute>
        </ProtectRoute>
      },


      // amdin router starts here
      {
        path: "/admin",
        element: <AdminRoute> <Sidebar /> </AdminRoute>,
        children: [
          {
            path: "dashboard",
            element: <Dashboard />
          },
          {
            path: "course",
            element: <CourseTable />
          },
          {
            path: "course/create",
            element: <AddCourse />
          },
          {
            path: "course/:courseId",
            element: <EditCourses />
          },
          {
            path: "course/:courseId/lecture",
            element: <CreateLecture />
          },
          {
            path: "course/:courseId/lecture/:lectureId",
            element: <EditLecture />
          }
        ]
      }
    ]
  },

]);

function App() {
  return (
    <main>
      <ThemeProvider>
        <RouterProvider router={appRouter} />
      </ThemeProvider>
    </main>
  );
}

export default App;
