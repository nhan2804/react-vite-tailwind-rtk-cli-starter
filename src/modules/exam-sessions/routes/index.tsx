import { IRoute } from "@routes/route.interface";
import { lazy } from "react";

// const GroupQuestion = lazy(() => import("../pages/group-question"));
const ExamSessionHomePage = lazy(() => import("../pages"));

const examSessionRoutes: IRoute[] = [
  {
    component: ExamSessionHomePage,
    isPrivate: true,
    path:"/exam-sessions"
  },
];
export default examSessionRoutes;
