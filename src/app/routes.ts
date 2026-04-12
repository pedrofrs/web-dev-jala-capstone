import { createBrowserRouter } from "react-router";
import Root from "./pages/Root";
import Dashboard from "./pages/Dashboard";
import BookDetails from "./pages/BookDetails";
import MyLibrary from "./pages/MyLibrary";
import Wishlist from "./pages/Wishlist";
import Settings from "./pages/Settings";
import StudyRooms from "./pages/StudyRooms";
import ResearchDatabases from "./pages/ResearchDatabases";
import FormPage from "./pages/FormPage";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";

export const router = createBrowserRouter([
  {
    path: "/login",
    Component: Login,
  },
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: Dashboard },
      { path: "book/:id", Component: BookDetails },
      { path: "my-library", Component: MyLibrary },
      { path: "wishlist", Component: Wishlist },
      { path: "study-rooms", Component: StudyRooms },
      { path: "databases", Component: ResearchDatabases },
      { path: "settings", Component: Settings },
      { path: "form", Component: FormPage },
      { path: "*", Component: NotFound },
    ],
  },
]);