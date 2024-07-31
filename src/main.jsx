import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import SignInPage from './templates/auth/sign-in/index.jsx'
import Home from './templates/home/index.jsx'
import Dashboard from './templates/dashboard/index.jsx'
import { ClerkProvider } from '@clerk/clerk-react'
import EditResume from './templates/dashboard/resume/[resumeid]/edit/index.jsx'
import ViewResume from './templates/my-resume/[resumeid]/view/index.jsx'

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

const router = createBrowserRouter([
  {
    element:<App></App>,
    children:[
      {
        path:'/dashboard',
        element:<Dashboard></Dashboard>
      },
      {
        path:'/dashboard/resume/:resumeid/edit',
        element:<EditResume></EditResume>
      }
    ]
  },
  {
    path:'/',
    element:<Home></Home>
  },
  {
    path:'/auth/sign-in',
    element:<SignInPage></SignInPage>
  },
  {
    path:'/my-resume/:resumeid/view',
    element: <ViewResume></ViewResume>
  }
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <RouterProvider router = {router}/>
    </ClerkProvider>
  </React.StrictMode>,
)
