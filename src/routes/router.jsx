import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import DashboardLayout from "../layouts/DashboardLayout";
import PrivateRoute from "./PrivateRoute";
import AdminRoute from "./AdminRoute";

// Pages
import Home from "../pages/Home/Home";
import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";
import PublicLessons from "../pages/Lessons/PublicLessons";
import LessonDetails from "../pages/Lessons/LessonDetails";
import Pricing from "../pages/Pricing/Pricing";
import PaymentSuccess from "../pages/Payment/Success";
import PaymentCancel from "../pages/Payment/Cancel";
import NotFound from "../pages/NotFound";

// User Dashboard
import DashboardHome from "../pages/Dashboard/User/DashboardHome";
import AddLesson from "../pages/Dashboard/User/AddLesson";
import MyLessons from "../pages/Dashboard/User/MyLessons";
import MyFavorites from "../pages/Dashboard/User/MyFavorites";
import UserProfile from "../pages/Dashboard/User/Profile";

// Admin Dashboard
import AdminHome from "../pages/Dashboard/Admin/AdminHome";
import ManageUsers from "../pages/Dashboard/Admin/ManageUsers";
import ManageLessons from "../pages/Dashboard/Admin/ManageLessons";
import ReportedLessons from "../pages/Dashboard/Admin/ReportedLessons";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/login", element: <Login /> },
      { path: "/register", element: <Register /> },
      { path: "/public-lessons", element: <PublicLessons /> },
      {
        path: "/lessons/:id",
        element: <PrivateRoute><LessonDetails /></PrivateRoute>,
      },
      {
        path: "/pricing",
        element: <PrivateRoute><Pricing /></PrivateRoute>,
      },
      { path: "/payment/success", element: <PaymentSuccess /> },
      { path: "/payment/cancel", element: <PaymentCancel /> },
    ],
  },
  {
    path: "/dashboard",
    element: <PrivateRoute><DashboardLayout /></PrivateRoute>,
    children: [
      { index: true, element: <DashboardHome /> },
      { path: "add-lesson", element: <AddLesson /> },
      { path: "my-lessons", element: <MyLessons /> },
      { path: "my-favorites", element: <MyFavorites /> },
      { path: "profile", element: <UserProfile /> },
      // Admin routes
      {
        path: "admin",
        element: <AdminRoute><AdminHome /></AdminRoute>,
      },
      {
        path: "admin/manage-users",
        element: <AdminRoute><ManageUsers /></AdminRoute>,
      },
      {
        path: "admin/manage-lessons",
        element: <AdminRoute><ManageLessons /></AdminRoute>,
      },
      {
        path: "admin/reported-lessons",
        element: <AdminRoute><ReportedLessons /></AdminRoute>,
      },
    ],
  },
  { path: "*", element: <NotFound /> },
]);

export default router;