import { Children, StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Provider } from 'react-redux'
import { appStore } from './app/store'
import { Toaster } from 'sonner'
import { useLoadUserQuery } from './features/api/authApi'
import LoadingSpinner from './components/ui/LoadingSpinner'

const Custom = ({ children }) => {
  const { isLoading } = useLoadUserQuery();
  return (
    <>
      {
        // isLoading ? <LoadingSpinner/> : <>{children}</>
        isLoading ? <><div className="p-6">

        {/* Header Skeleton */}
        <div className="h-10 w-48 bg-gray-300 rounded animate-pulse mb-4"></div>
        <div className="h-6 w-64 bg-gray-300 rounded animate-pulse mb-6"></div>
        
        {/* Search Bar Skeleton */}
        <div className="flex space-x-2 mb-6">
          <div className="h-10 w-72 bg-gray-300 rounded animate-pulse"></div>
          <div className="h-10 w-20 bg-gray-400 rounded animate-pulse"></div>
        </div>
        
        {/* Button Skeleton */}
        <div className="h-10 w-40 bg-gray-400 rounded animate-pulse mb-6"></div>
        
        {/* Course Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array(4).fill(0).map((_, index) => (
            <div key={index} className="p-4 border rounded-lg shadow-md bg-white">
              <div className="h-40 bg-gray-300 rounded animate-pulse mb-4"></div>
              <div className="h-6 w-3/4 bg-gray-300 rounded animate-pulse mb-2"></div>
              <div className="h-6 w-1/2 bg-gray-300 rounded animate-pulse mb-4"></div>
              <div className="flex items-center space-x-2">
                <div className="h-8 w-8 bg-gray-300 rounded-full animate-pulse"></div>
                <div className="h-6 w-24 bg-gray-300 rounded animate-pulse"></div>
              </div>
            </div>
          ))}
        </div>
      </div></> : <>{children}</>
      }
    </>
  )
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={appStore}>
      <Custom>
        <App />
        <Toaster />
      </Custom>
    </Provider>
  </StrictMode>,
)
