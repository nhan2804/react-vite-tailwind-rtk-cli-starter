import authRoute from "@modules/auth/routes";
import projectsRoutes from "@modules/projects/routes";
import ticketsRoutes from "@modules/tickets/routes";
const routes = [
  ///////////////////////////////for cli insert
  ...authRoute,
  ...projectsRoutes,
...ticketsRoutes,
];
export default routes;
