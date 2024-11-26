import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import Header from "@components/Header";

import { ScrollToTop } from "@components/ScrollToTop";
import GetRoutes from "@routes/GetRoutes";
// import { LazyMotion } from "framer-motion";
import React, { lazy, Suspense } from "react";
import { ReactQueryDevtools } from "react-query/devtools";
import { ToastContainer } from "react-toastify";
import "./helper/utils";
import { useAppSelector } from "@hooks/reduxHook";
// const loadFeatures = () =>
// import("./config/framer-motion").then((res) => res.default);
const VersionWatcher = lazy(() => import("@components/VersionWatcher"));
function App() {
  const darkMode = useAppSelector((state) => state.dark.isDark);

  return (
    <div className={`${darkMode ? "dark" : ""} h-full`}>
      <Suspense fallback={<></>}>
        <VersionWatcher></VersionWatcher>
      </Suspense>
      <div className="dark:bg-[#121212] bg-gray-50 transition-colors h-full">
        {/* <LazyMotion features={loadFeatures} strict> */}
        <div style={{ position: "absolute" }} id="back-to-top-anchor" />
        <div className="flex flex-col flex-auto h-full min-h-0">
          <Header />
          <div className="">
            <GetRoutes />
          </div>
          {/* <Footer /> */}
        </div>
        <ToastContainer />
        <ScrollToTop />
        <ReactQueryDevtools initialIsOpen />
      </div>
    </div>
  );
}

export default App;
