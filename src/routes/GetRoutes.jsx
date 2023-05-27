import ProtectedRoute from "@components/ProtectedRoute";
import React, { memo, Suspense } from "react";
import { useRoutes } from "react-router";
import BarLoader from "react-spinners/BarLoader";
import DecalreRoutes from "./index";
function GetRoutes() {
  const routeTransfer = (_route) => {
    return _route?.map((route, indx) => {
      const {
        path,
        component: Component,
        isPrivate = false,
        role,
        exact,
        match,
        container,
        ...rest
      } = route;
      return {
        element: (
          <ProtectedRoute
            key={path}
            path={path}
            exact={exact}
            // component={component}
            isPrivate={isPrivate}
            accessRole={role}
            match={match}
            {...rest}
          >
            <Suspense
              fallback={
                <div className="flex items-center justify-center max-w-lg min-h-full mx-auto">
                  <BarLoader
                    color={"#00B649"}
                    width={300}
                    height={6}
                    loading={true}
                    size={60}
                  />
                </div>
              }
            >
              <Component />
            </Suspense>
          </ProtectedRoute>
        ),
        path: path,
      };
    });
  };
  const routing = useRoutes(
    DecalreRoutes.map((route, indx) => {
      const {
        path,
        component: Component,
        isPrivate = false,
        role,
        exact,
        children,
        match,
      } = route;
      // return <Route key={indx} path={path} exact={true} component={component} />;
      return {
        element: (
          <ProtectedRoute
            key={path}
            path={path}
            exact={exact}
            // component={component}
            isPrivate={isPrivate}
            accessRole={role}
            match={match}
          >
            <Component />
          </ProtectedRoute>
        ),
        path: path,
        children: routeTransfer(children || []),
      };
    })
  );
  return (
    <div className="h-full">
      <Suspense
        fallback={
          <div className="flex items-center justify-center max-w-lg min-h-full mx-auto h-screen">
            <BarLoader
              color={"#00B649"}
              width={300}
              height={6}
              loading={true}
              size={60}
            />
          </div>
        }
      >
        {routing}
      </Suspense>
    </div>
  );
}

export default memo(GetRoutes);
