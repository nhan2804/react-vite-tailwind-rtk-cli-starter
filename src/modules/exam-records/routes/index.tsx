import { IRoute } from "@routes/route.interface";
import { lazy } from "react";

const ExamRecordHomePage = lazy(() => import("../pages"));
const CitizenDetailPage = lazy(() => import("../pages/detail"));
const AdminManagementPage = lazy(() => import("../pages/admin"));

const examRecordRoutes: IRoute[] = [
  {
    component: ExamRecordHomePage,
    isPrivate: true,
    path: "/",
  },
  {
    component: ExamRecordHomePage,
    isPrivate: true,
    path: "/exam-records",
  },
  {
    component: CitizenDetailPage,
    isPrivate: true,
    path: "/records/:id",
  },
  {
    component: AdminManagementPage,
    isPrivate: true,
    path: "/admin",
  },
];

export default examRecordRoutes;
