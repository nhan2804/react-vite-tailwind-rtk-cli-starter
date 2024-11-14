import { IRoute } from "@routes/route.interface";
import { lazy } from "react";

// const GroupQuestion = lazy(() => import("../pages/group-question"));
const AuthSessionHomePage = lazy(() => import("../pages"));

const authSessionRoutes: IRoute[] = [
  {
    component: AuthSessionHomePage,
    isPrivate: true,
    path: "/auth-sessions",
  },
];
export default authSessionRoutes;
