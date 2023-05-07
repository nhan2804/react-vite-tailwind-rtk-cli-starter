import { Layout, Menu } from "antd";
import React, { Suspense, useState } from "react";
import { Outlet, useLocation, useMatch, useParams } from "react-router";
import {
  UserOutlined,
  UnorderedListOutlined,
  PieChartOutlined,
  PicLeftOutlined,
  ContainerOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import { BarLoader } from "react-spinners";
import Paragraph from "antd/es/typography/Paragraph";
const { Sider, Content } = Layout;
const LayoutProject = () => {
  const { projectId } = useParams();
  const [collapsed, setCollapsed] = useState(false);
  const match = useMatch("/projects/:projectId/:page");
  // console.log(location);
  return (
    <div>
      <Layout>
        <Sider
          style={{
            overflow: "auto",
            height: "100vh",
            position: "fixed",
            left: 0,
            top: 54,
            bottom: 0,
          }}
          theme="light"
          trigger={null}
          collapsible
          collapsed={collapsed}
        >
          <div className="logo" />
          <Menu
            theme="light"
            mode="inline"
            selectedKeys={[match?.params?.page]}
          >
            <Menu.Item icon={<UnorderedListOutlined />} key={"options"}>
              <Link to={`/projects/${projectId}/options`}>
                Danh sách câu hỏi
              </Link>
            </Menu.Item>

            <Menu.Item icon={<UserOutlined />} key="admins">
              <Link to={`/projects/${projectId}/admins`}>
                Danh sách Manager
              </Link>
            </Menu.Item>

            <Menu.Item icon={<UserOutlined />} key="qcs">
              <Link to={`/projects/${projectId}/qcs`}>Danh sách QC</Link>
            </Menu.Item>

            <Menu.Item icon={<PicLeftOutlined />} key={"places"}>
              <Link to={`/projects/${projectId}/places`}>
                Danh sách địa điểm
              </Link>
            </Menu.Item>

            <Menu.Item icon={<ContainerOutlined />} key={"submits"}>
              <Link to={`/projects/${projectId}/submits`}>
                Danh sách Submit
              </Link>
            </Menu.Item>
            <Menu.Item icon={<PieChartOutlined />} key={"overview"}>
              <Link to={`/projects/${projectId}/overview`}>
                Chart & Thống kê
              </Link>
            </Menu.Item>
            <Menu.Item icon={<PieChartOutlined />} key={"export"}>
              <Link to={`/projects/${projectId}/export`}>Export Excel</Link>
            </Menu.Item>
            <Menu.Item key={"k"}>
              <Paragraph
                copyable={{
                  text:
                    window.location.origin +
                    "/project/" +
                    projectId +
                    "/login/",
                }}
              >
                Copy link project
              </Paragraph>
            </Menu.Item>
          </Menu>
        </Sider>
        <Layout className="site-layout">
          <Content className="p-2 ml-[200px]">
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
              <Outlet />
            </Suspense>
          </Content>
        </Layout>
      </Layout>
      <div></div>
    </div>
  );
};

export default LayoutProject;
