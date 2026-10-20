/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import useGetProfile from "@modules/auth/hooks/useGetProfile";
import { useAppSelector } from "@hooks/reduxHook";
import useLogout from "@modules/auth/hooks/useLogout";
import { Button, Dropdown, Space } from "antd";
import {
  DownOutlined,
  HistoryOutlined,
  UserOutlined,
  LogoutOutlined,
  FileProtectOutlined,
  SettingOutlined,
  CheckSquareOutlined,
} from "@ant-design/icons";
import { Link, useLocation } from "react-router-dom";

const Header = () => {
  const { data: u } = useGetProfile();
  const user = useAppSelector((s) => s?.auth?.user);
  const { mutate: logout } = useLogout();
  const location = useLocation();

  const items = [
    {
      key: "exam",
      label: <Link to={"/"}>Trang Khám Tuyển (Điểm danh & Ảnh)</Link>,
      icon: <CheckSquareOutlined />,
    },
    {
      key: "admin",
      label: <Link to={"/admin"}>Quản trị & Nhập liệu JSON</Link>,
      icon: <SettingOutlined />,
    },
    {
      type: "divider",
    },
    {
      key: "profile",
      label: <Link to={"/profile/info"}>Thông tin cá nhân</Link>,
      icon: <UserOutlined />,
    },
    {
      key: "sessions",
      label: <Link to={"/auth-sessions"}>Quản lý phiên đăng nhập</Link>,
      icon: <FileProtectOutlined />,
    },
    {
      key: "logs",
      label: <Link to={"/profile/logs"}>Lịch sử hoạt động</Link>,
      icon: <HistoryOutlined />,
    },
    {
      type: "divider",
    },
    {
      key: "logout",
      icon: <LogoutOutlined className="text-red-500" />,
      label: (
        <span className="text-red-500 font-medium" onClick={logout}>
          Đăng xuất
        </span>
      ),
    },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#18392B] text-white shadow-md">
      <nav className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5">
        <div className="flex items-center justify-between">
          {/* Logo & System Title */}
          <Link to={"/"} className="flex items-center gap-2 sm:gap-3">
            <img
              src="https://upload.wikimedia.org/wikipedia/vi/d/dd/Vietnam_People%27s_Army_insignia.png"
              className="h-8 sm:h-9 w-auto"
              alt="Huy hiệu QĐNDVN"
            />
            <div className="flex flex-col">
              <span className="text-xs sm:text-sm font-bold uppercase tracking-wide text-amber-300 line-clamp-1">
                Hệ thống khám tuyển
              </span>
              <span className="text-[10px] text-gray-200 uppercase line-clamp-1">
                Nghĩa vụ Quân sự & Công an
              </span>
            </div>
          </Link>

          {/* Quick Nav Links on Desktop / Tablet */}
          <div className="hidden sm:flex items-center gap-2">
            <Link to="/">
              <Button
                type={location.pathname === "/" ? "primary" : "text"}
                size="small"
                icon={<CheckSquareOutlined />}
                className={
                  location.pathname === "/"
                    ? "bg-amber-500 text-gray-900 font-bold border-none"
                    : "text-white hover:text-amber-300"
                }
              >
                Khám tuyển
              </Button>
            </Link>

            <Link to="/admin">
              <Button
                type={location.pathname === "/admin" ? "primary" : "text"}
                size="small"
                icon={<SettingOutlined />}
                className={
                  location.pathname === "/admin"
                    ? "bg-amber-500 text-gray-900 font-bold border-none"
                    : "text-white hover:text-amber-300"
                }
              >
                Quản trị & Import
              </Button>
            </Link>
          </div>

          {/* User Profile Dropdown */}
          <div className="flex items-center cursor-pointer">
            {user ? (
              <Dropdown menu={{ items }} trigger={["click", "hover"]}>
                <Space className="text-white hover:text-amber-200 transition-colors">
                  <div className="w-7 h-7 rounded-full bg-amber-400 text-gray-900 font-bold flex items-center justify-center text-xs shadow-inner">
                    {user?.fullName ? user.fullName[0].toUpperCase() : "U"}
                  </div>
                  <span className="text-xs font-semibold max-w-[100px] truncate hidden sm:inline">
                    {user?.fullName || user?.username}
                  </span>
                  <DownOutlined className="text-[10px]" />
                </Space>
              </Dropdown>
            ) : (
              <Link to="/login">
                <Button size="small" type="primary" className="bg-amber-500 text-gray-900 font-bold border-none">
                  Đăng nhập
                </Button>
              </Link>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
