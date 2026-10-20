import { IRoute } from "@routes/route.interface";
import { lazy } from "react";

// const GroupQuestion = lazy(() => import("../pages/group-question"));
const AuditLogHomePage = lazy(() => import("../pages"));

const auditLogRoutes: IRoute[] = [
  {
    component: AuditLogHomePage,
    isPrivate: true,
    path:"/audit-logs"
  },
];
export default auditLogRoutes;
