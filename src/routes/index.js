import authRoute from "@modules/auth/routes";
import projectsRoutes from "@modules/projects/routes";
const routes = [
  ///////////////////////////////for cli insert
  ...authRoute,
  ...projectsRoutes,
];
export default routes;
