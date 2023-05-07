import React from "react";
import { Skeleton } from "antd";
const CustomSkeleton = ({
  row = 1,
  isLoading,
  paragraph = 1,
  avatar,
  block = true,
}) => {
  return (
    <div>
      {isLoading &&
        [...Array(row)].map((e) => (
          <Skeleton
            block={block}
            // {...rest}
            avatar={avatar}
            paragraph={{ rows: paragraph }}
            active
          />
        ))}
    </div>
  );
};

export default CustomSkeleton;
