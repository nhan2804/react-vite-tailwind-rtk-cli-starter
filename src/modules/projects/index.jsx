import { PlusCircleOutlined } from "@ant-design/icons";
import { Layout, theme } from "antd";
import { useEffect, useRef, useState } from "react";

// import { projectBaseAPI, ProjectClient } from "../../../clients/ProjectClient";

import useGetProject from "./hooks/query/useGetProject";
import CustomDrawer from "@components/CustomDrawer";
import FormEditProject from "./components/FormEditProject";
import useCreateProject from "./hooks/mutate/useCreateProject";
import useUpdateProject from "./hooks/mutate/useUpdateProject";
import useDeleteProject from "./hooks/mutate/useDeleteProject";
import CardProject from "./components/CardProject";
import classNames from "classnames";
import { useAppSelector } from "@hooks/reduxHook";
import { useNavigate } from "react-router";
import CustomPageHeader from "@components/CustomPageHeader";

const { Content } = Layout;
const { useToken } = theme;

const ProjectPage = () => {
  const { token } = useToken();

  const user = useAppSelector((s) => s?.auth?.user);
  const nav = useNavigate();
  useEffect(() => {
    if (user) {
      if (user?.type === "ADMIN") {
        nav(`/projects/${user?.projectId}/places`);
      }
      if (user?.type === "QC") {
        nav(`/project-submit/${user?.projectId}`);
      }
    }
  }, [nav, user]);

  const refDrawerFormProject = useRef();
  const [selectedProject, setSelectedProject] = useState();

  const { mutate: create, isLoading: isLoadingCreate } = useCreateProject();
  const { data: projects } = useGetProject();
  const { mutate: update, isLoading: loadingUpdate } = useUpdateProject();
  const { mutate: deleteP, isLoading: loadingDelete } = useDeleteProject();
  const handleModify = (action, data) => {
    const _id = selectedProject?._id;
    if (action === "UPDATE") {
      update({ _id, formData: data });
    } else if (action === "DELETE") {
      deleteP({ _id });
    }

    refDrawerFormProject?.current?.close();
  };

  return (
    <div class="p-2">
      <CustomPageHeader title="Dự án" />
      <div className="grid grid-cols-5 gap-2">
        <div className="flex justify-center items-center">
          <div
            aria-hidden
            onClick={() => {
              create({
                xid: "sss",
                name: "_",
                title: "_title",
                description: "_description",
              });
            }}
            className={classNames(
              "text-2xl border-dotted border-[1px] p-4 rounded-lg cursor-pointer",
              isLoadingCreate && "disabled"
            )}
          >
            <PlusCircleOutlined spin={isLoadingCreate} size="large" />
            Tạo mới
          </div>
        </div>
        {projects?.payload.map((e, i) => (
          <CardProject
            key={e._id}
            title={e.title}
            desc={e.description}
            {...e}
            onEdit={() => {
              console.log({ r: refDrawerFormProject?.current });
              refDrawerFormProject?.current?.open();
              setSelectedProject(e);
            }}
          />
        ))}
      </div>

      <CustomDrawer
        title={selectedProject?.title}
        // key={selectedProject?.id + selectedProject?.updatedAt}
        ref={refDrawerFormProject}
        noButton={true}
      >
        {() => (
          <FormEditProject
            loadingDelete={loadingDelete}
            loadingUpdate={loadingUpdate}
            handleActions={handleModify}
            source={selectedProject}
          />
        )}
      </CustomDrawer>
    </div>
  );
};

export default ProjectPage;
