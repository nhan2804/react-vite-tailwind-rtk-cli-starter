import { IRoute } from "@routes/route.interface";
import { lazy } from "react";

// const GroupQuestion = lazy(() => import("../pages/group-question"));
const LogHomePage = lazy(() => import("../pages"));

const logRoutes: IRoute[] = [
  {
    component: LogHomePage,
    isPrivate: true,
    path:"/logs"
  },
];
export default logRoutes;
