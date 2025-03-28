import Navbar from '@/components/Navbar';
import { Outlet } from 'react-router-dom';
 // Import your Navbar

const MainLayout = () => {
  return (
    <div className='flex  flex-col min-h-screen'>
      <Navbar />  {/* The Navbar is rendered on all pages using this layout */}
      <main className='flex-1 mt-16'>
        <Outlet /> {/* This will render the content of the current route */}
      </main>
    </div>
  );
};

export default MainLayout;
