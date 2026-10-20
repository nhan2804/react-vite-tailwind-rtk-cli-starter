import authSessionRoutes from "@modules/auth-sessions/routes";
import authRoute from "@modules/auth/routes";
import projectsRoutes from "@modules/projects/routes";
import examRecordRoutes from "@modules/exam-records/routes";

const routes = [
  ...examRecordRoutes,
  ...authRoute,
  ...projectsRoutes,
  ...authSessionRoutes,
];

export default routes;
