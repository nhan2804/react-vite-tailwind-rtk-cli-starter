import { IRoute } from "@routes/route.interface";
import { lazy } from "react";

// const GroupQuestion = lazy(() => import("../pages/group-question"));
const __name__(sentenceCase)HomePage = lazy(() => import(".."));

const __name__Routes: IRoute[] = [
  {
    component: __name__(sentenceCase)HomePage,
    isPrivate: true,
    path:"/__name__s"
  },
];
export default __name__Routes;
