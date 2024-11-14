import { Layout, Menu } from "antd";
import React, { Suspense, useState } from "react";
import { Outlet, useMatch, useParams } from "react-router";
import {
  UserOutlined,
  UnorderedListOutlined,
  PieChartOutlined,
  PicLeftOutlined,
  ContainerOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import { BarLoader } from "react-spinners";
import classNames from "classnames";
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
            top: 72,
            bottom: 0,
          }}
          theme="light"
          // trigger={null}
          collapsible
          onCollapse={(t) => setCollapsed(t)}
          // collapsed={collapsed}
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
              <Link to={`/projects/${projectId}/places`}>Danh sách Đại lý</Link>
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
          </Menu>
        </Sider>
        <Layout className="site-layout">
          <Content
            className={classNames(
              `p-2`,
              !!collapsed ? "ml-[80px]" : "ml-[200px]"
            )}
          >
            <Suspense
              fallback={
                <div className="flex items-center justify-center max-w-lg min-h-full mx-auto h-screen">
                  <BarLoader
                    color={"#31aeb5"}
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
