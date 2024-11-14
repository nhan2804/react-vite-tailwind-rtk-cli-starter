import { IRoute } from "@routes/route.interface";
import { lazy } from "react";
// import LayoutProject from "src/layouts/LayoutProject.jsx";
const AuthSessionHomePage = lazy(
  () => import("@modules/auth-sessions/pages/index.jsx")
);
const ProjectPage = lazy(() => import("../index.jsx"));
// const ProjectPage = () => <div>dd</div>;
// const LayoutProject = lazy(() => import("../../..//layouts/LayoutProject"));
const LayoutProject = lazy(() => import("@layouts/LayoutProject.jsx"));

const type = {
  ADMIN: "ADMIN",
  SUPER_ADMIN: "SUPER_ADMIN",
  QC: "QC",
};
const projectsRoutes: IRoute[] = [
  {
    component: ProjectPage,
    path: "/projects",
    isPrivate: true,
    exact: true,
    accessRole: [type.SUPER_ADMIN],
  },
  {
    component: ProjectPage,
    path: "/",
    isPrivate: true,
    exact: true,
    // accessRole: [type.SUPER_ADMIN],
  },

  {
    component: LayoutProject,
    path: "/projects/:projectId",
    isPrivate: true,
    exact: true,
    accessRole: [type.SUPER_ADMIN, type.ADMIN],
    children: [
      {
        component: AuthSessionHomePage,
        path: "test",
        isPrivate: true,
        exact: true,
      },
    ],
  },
];
export default projectsRoutes;
