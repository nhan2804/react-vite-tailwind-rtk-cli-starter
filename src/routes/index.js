import authSessionRoutes from "@modules/auth-sessions/routes";
import authRoute from "@modules/auth/routes";
import projectsRoutes from "@modules/projects/routes";
const routes = [
  ///////////////////////////////for cli insert
  ...authRoute,
  ...projectsRoutes,
  ...authSessionRoutes,
];
export default routes;
