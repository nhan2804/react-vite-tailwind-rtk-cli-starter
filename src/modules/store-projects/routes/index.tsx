import { IRoute } from "@routes/route.interface";
import { lazy } from "react";

// const GroupQuestion = lazy(() => import("../pages/group-question"));
const StoreProjectHomePage = lazy(() => import("../pages"));

const storeProjectRoutes: IRoute[] = [
  {
    component: StoreProjectHomePage,
    // isPrivate: true,
    path: "/store-projects",
  },
];
export default storeProjectRoutes;
