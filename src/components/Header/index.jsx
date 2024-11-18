/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import useGetProfile from "@modules/auth/hooks/useGetProfile";
import { useAppSelector } from "@hooks/reduxHook";
import useLogout from "@modules/auth/hooks/useLogout";
import { Button, Dropdown, Input, Space, version } from "antd";
import { DownOutlined, FileOutlined, HistoryOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { useMatch, useParams } from "react-router";
import logo from "@assets/logo.jpg";
import useShowProject from "@modules/projects/hooks/query/useShowProject";
import {
  UserOutlined,
  LogoutOutlined,
  ProjectOutlined,
  FileProtectOutlined,
} from "@ant-design/icons";
const Header = () => {
  const { data: u } = useGetProfile();
  const user = useAppSelector((s) => s?.auth?.user);
  const { mutate: logout } = useLogout();
  const match = useMatch("/projects/:projectId/*");
  const projectId = match?.params?.projectId;
  // const logout=()=>{

  // }
  // {user?.type === "SUPER_ADMIN" && (
  //   <li>
  //     <Link to={"/projects"}>Project</Link>
  //   </li>
  // )}
  // {user?.type === "QC" && (
  //   <li>
  //     <Link to={`/project-submit/${user?.projectId}`}>
  //       Đổi địa điểm
  //     </Link>
  //   </li>
  // )}

  const items = [
    {
      key: "-1",
      label: <Link to={"/profile/info"}>Thông tin cá nhân</Link>,
      icon: <UserOutlined></UserOutlined>,
    },
    {
      key: "0",
      label: <Link to={"/auth-sessions"}>Quản lý phiên đăng nhập</Link>,
      icon: <FileProtectOutlined></FileProtectOutlined>,
    },
    {
      key: "ê",
      label: <Link to={"/profile/logs"}>Lịch sử hoạt động</Link>,
      icon: <HistoryOutlined></HistoryOutlined>,
    },
    user?.type === "SUPER_ADMIN"
      ? {
          key: "2",
          label: <Link to={"/projects"}>Dự án</Link>,
          icon: <ProjectOutlined></ProjectOutlined>,
        }
      : null,
    user?.type === "QC"
      ? {
          key: "3",
          label: (
            <Link to={`/project-submit/${user?.projectId}`}>Đổi địa điểm</Link>
          ),
        }
      : null,
    {
      key: "1",
      icon: <LogoutOutlined></LogoutOutlined>,
      label: (
        <div className="text-red-400" aria-hidden type="text" onClick={logout}>
          Đăng xuất
        </div>
      ),
    },
  ].filter((e) => !!e);
  console.log({ items });
  const { data: project } = useShowProject(projectId);
  return (
    <header className="sticky top-0 z-50 p-3 bg-white shadow-sm">
      <nav class=" lg:px-6 dark:bg-gray-800">
        <div class="flex flex-wrap justify-between items-center">
          <Link to={"/"} class="flex items-center">
            <img
              src={
                "https://tier4marketing.com/wp-content/uploads/2015/10/Client-Logo-Placeholder.png"
              }
              class="mr-3 h-12 sm:h-12"
              alt="Flowbite Logo"
            />
            {/* <span class="self-center text-xl font-semibold whitespace-nowrap dark:text-white">
              Name
            </span> */}
          </Link>
          {project && (
            <div className="text-2xl font-bold uppercase text-[#135dac] overflow-hidden flex-shrink lg:w-[300px] w-48">
              <span className="line-clamp-1"> {project?.title}</span>
            </div>
          )}

          <div class="flex items-center lg:order-2 cursor-pointer">
            {user && (
              <Dropdown
                menu={{
                  items,
                }}
              >
                <Space>
                  <img
                    className="w-6 h-6 rounded-full"
                    alt="avatar"
                    src={
                      user?.avatar ||
                      "https://w7.pngwing.com/pngs/256/355/png-transparent-computer-icons-female-jewelry-head-silhouette-avatar.png"
                    }
                  ></img>
                  {user?.fullName}
                  <DownOutlined />
                </Space>
              </Dropdown>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
