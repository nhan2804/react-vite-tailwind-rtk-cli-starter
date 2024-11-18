import { IRoute } from "@routes/route.interface";
import { lazy } from "react";

// const GroupQuestion = lazy(() => import("../pages/group-question"));
const ProjectHomePage = lazy(() => import("../pages"));

const projectRoutes: IRoute[] = [
  {
    component: ProjectHomePage,
    isPrivate: true,
    path: "/",
  },
];
export default projectRoutes;
