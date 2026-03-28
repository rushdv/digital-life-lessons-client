import { createBrowserRouter } from 'react-router-dom'
import MainLayout from '../layouts/MainLayout'
import DashboardLayout from '../layouts/DashboardLayout'
import PrivateRoute from './PrivateRoute'
import AdminRoute from './AdminRoute'

import Home from '../pages/Home/Home'
import Login from '../pages/Auth/Login'
import Register from '../pages/Auth/Register'
import PublicLessons from '../pages/Lessons/PublicLessons'
import LessonDetails from '../pages/Lessons/LessonDetails'
import Pricing from '../pages/Pricing/Pricing'
import Success from '../pages/Payment/Success'
import Cancel from '../pages/Payment/Cancel'
import NotFound from '../pages/NotFound'

import DashboardHome from '../pages/Dashboard/User/DashboardHome'
import AddLesson from '../pages/Dashboard/User/AddLesson'
import MyLessons from '../pages/Dashboard/User/MyLessons'
import MyFavorites from '../pages/Dashboard/User/MyFavorites'
import Profile from '../pages/Dashboard/User/Profile'
import UpdateLesson from '../pages/Dashboard/User/UpdateLesson'

import AdminHome from '../pages/Dashboard/Admin/AdminHome'
import ManageUsers from '../pages/Dashboard/Admin/ManageUsers'
import ManageLessons from '../pages/Dashboard/Admin/ManageLessons'
import ReportedLessons from '../pages/Dashboard/Admin/ReportedLessons'
import AdminProfile from '../pages/Dashboard/Admin/AdminProfile'

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'login', element: <Login /> },
      { path: 'register', element: <Register /> },
      { path: 'lessons', element: <PublicLessons /> },
      {
        path: 'lessons/:id',
        element: <PrivateRoute><LessonDetails /></PrivateRoute>,
      },
      {
        path: 'pricing',
        element: <PrivateRoute><Pricing /></PrivateRoute>,
      },
      { path: 'payment/success', element: <Success /> },
      { path: 'payment/cancel', element: <Cancel /> },
    ],
  },
  {
    path: '/dashboard',
    element: <PrivateRoute><DashboardLayout /></PrivateRoute>,
    children: [
      { index: true, element: <DashboardHome /> },
      { path: 'add-lesson', element: <AddLesson /> },
      { path: 'my-lessons', element: <MyLessons /> },
      { path: 'update-lesson/:id', element: <UpdateLesson /> },
      { path: 'my-favorites', element: <MyFavorites /> },
      { path: 'profile', element: <Profile /> },
      {
        path: 'admin',
        element: <AdminRoute><AdminHome /></AdminRoute>,
      },
      {
        path: 'admin/manage-users',
        element: <AdminRoute><ManageUsers /></AdminRoute>,
      },
      {
        path: 'admin/manage-lessons',
        element: <AdminRoute><ManageLessons /></AdminRoute>,
      },
      {
        path: 'admin/reported-lessons',
        element: <AdminRoute><ReportedLessons /></AdminRoute>,
      },
      {
        path: 'admin/profile',
        element: <AdminRoute><AdminProfile /></AdminRoute>,
      },
    ],
  },
  { path: '*', element: <NotFound /> },
])

export default router
