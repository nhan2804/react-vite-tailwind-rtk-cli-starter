import authRoute from "@modules/auth/routes";
import projectsRoutes from "@modules/projects/routes";
import storeProjectRoutes from "@modules/store-projects/routes";
const routes = [
  ///////////////////////////////for cli insert
  ...authRoute,
  ...projectsRoutes,
  ...storeProjectRoutes,
];
export default routes;
