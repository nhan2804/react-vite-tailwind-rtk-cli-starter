import { IRoute } from "@routes/route.interface";
import { lazy } from "react";

// const GroupQuestion = lazy(() => import("../pages/group-question"));
const TicketHomePage = lazy(() => import("../pages"));

const ticketRoutes: IRoute[] = [
  {
    component: TicketHomePage,
    isPrivate: true,
    path: "/tickets",
  },
];
export default ticketRoutes;
