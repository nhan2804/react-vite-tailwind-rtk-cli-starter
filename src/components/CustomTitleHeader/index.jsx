import React from "react";
import { Helmet } from "react-helmet";
const CustomTitleHeader = ({ title, desc, child }) => {
  return (
    <Helmet>
      <title>{title} - Livechat168</title>
      <meta name="description" content={desc} />
      {child}
    </Helmet>
  );
};

export default CustomTitleHeader;
