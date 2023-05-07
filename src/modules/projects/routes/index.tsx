import { IRoute } from "@routes/route.interface";
import React, { lazy } from "react";
const Login = lazy(() => import("@modules/auth/pages/login"));
const ProjectPage = lazy(() => import("../index.jsx"));
// const ProjectPage = () => <div>dd</div>;
const LayoutProject = lazy(() => import("../layouts/LayoutProject"));

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
    // isPrivate: true,
    exact: true,
    // accessRole: [type.SUPER_ADMIN],
  },

  {
    component: LayoutProject,
    path: "/projects/:projectId",
    isPrivate: true,
    exact: true,
    accessRole: [type.SUPER_ADMIN, type.ADMIN],
    children: [],
  },
];
export default projectsRoutes;
