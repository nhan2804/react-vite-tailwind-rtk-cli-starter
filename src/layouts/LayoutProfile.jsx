import { Layout, Menu } from "antd";
import React, { Suspense, useEffect, useState } from "react";
import { Outlet, useMatch, useParams } from "react-router";
import { UserOutlined, UnorderedListOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { BarLoader } from "react-spinners";
import classNames from "classnames";
import useGetProfile from "@modules/auth/hooks/useGetProfile";
const { Sider, Content } = Layout;
const LayoutProfile = () => {
  const { projectId } = useParams();
  const [collapsed, setCollapsed] = useState(false);
  const match = useMatch("/profile/:page");

  // console.log(location);
  return (
    <div className="h-full">
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
            <Menu.Item icon={<UserOutlined />} key="info">
              <Link to={`/profile/info`}>Thông tin</Link>
            </Menu.Item>
            <Menu.Item icon={<UnorderedListOutlined />} key={"change-password"}>
              <Link to={`/profile/change-password`}>Đổi mật khẩu</Link>
            </Menu.Item>
          </Menu>
        </Sider>
        <Layout className="site-layout h-full">
          <Content
            className={classNames(
              `p-2 layout h-full`,
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
              <div className="bg-white w-full">
                <Outlet />
              </div>
            </Suspense>
          </Content>
        </Layout>
      </Layout>
      <div></div>
    </div>
  );
};

export default LayoutProfile;
