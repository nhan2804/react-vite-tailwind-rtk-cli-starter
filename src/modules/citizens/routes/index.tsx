import { IRoute } from "@routes/route.interface";
import { lazy } from "react";

// const GroupQuestion = lazy(() => import("../pages/group-question"));
const CitizenHomePage = lazy(() => import("../pages"));

const citizenRoutes: IRoute[] = [
  {
    component: CitizenHomePage,
    isPrivate: true,
    path:"/citizens"
  },
];
export default citizenRoutes;
