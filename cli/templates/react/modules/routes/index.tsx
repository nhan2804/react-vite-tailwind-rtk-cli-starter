import { IRoute } from "@routes/route.interface";
import { lazy } from "react";

// const GroupQuestion = lazy(() => import("../pages/group-question"));
const __name__(pascalCase)HomePage = lazy(() => import("../pages"));

const __name__(camelCase)Routes: IRoute[] = [
  {
    component: __name__(pascalCase)HomePage,
    isPrivate: true,
    path:"/__name__s"
  },
];
export default __name__(camelCase)Routes;
