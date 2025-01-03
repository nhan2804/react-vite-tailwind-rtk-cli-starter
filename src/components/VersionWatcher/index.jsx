import CustomModal from "@components/CustomModal";
import useWatchVersion from "@hooks/useWatchVersion";
import { Button, Divider } from "antd";

import React, { useEffect, useRef, useState } from "react";
import { APP_VERSION } from "@defines/version";
const currentVersion = parseInt(APP_VERSION?.replaceAll(".", "")) || undefined;
const VersionWatcher = () => {
  const { data: version, isError } = useWatchVersion();

  const [isForceRefresh, setIsForceRefresh] = useState(false);
  const ref = useRef();
  useEffect(() => {
    if (version && !!currentVersion) {
      const { forceRefresh, version: requireVersion } = version;
      const beVersion = parseInt(requireVersion?.replaceAll(".", "")) || 0;
      setIsForceRefresh(forceRefresh);
      if (beVersion > currentVersion) {
        ref.current?.open();
      } else {
        ref?.current?.close();
      }
    }
  }, [version]);
  const onReload = () => {
    window.location.reload();
  };
  if (isError) {
    throw new Error("Force throw erro");
  }
  return (
    <CustomModal
      closable={!isForceRefresh}
      noButton
      ref={ref}
      footer={false}
      title={"Thông báo"}
    >
      {({ close }) => (
        <div>
          <div
            className="bg-orange-100 border-l-4 border-orange-500 text-orange-700 p-4"
            role="alert"
          >
            <p className="font-bold">Cập nhật</p>
            <p>
              Phiên làm việc của bạn đã quá cũ so với yêu cầu.{" "}
              {isForceRefresh ? (
                <span className="text-red-500 font-semibold">
                  Vui lòng tải lại trang!
                </span>
              ) : (
                <span className="text-yellow-600 font-semibold">
                  Nên tải lại trang để đảm bảo website hoạt động chính xác.
                </span>
              )}
            </p>
          </div>
          {version?.message && (
            <div>
              <Divider></Divider>
              {version?.message}
            </div>
          )}
          <div className="flex justify-end space-x-2 mt-2">
            {!isForceRefresh && (
              <Button onClick={close} type="dashed">
                Đóng
              </Button>
            )}
            <Button type="primary" onClick={onReload}>
              Tải lại trang
            </Button>
          </div>
        </div>
      )}
    </CustomModal>
  );
};

export default VersionWatcher;
