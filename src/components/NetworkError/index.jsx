import React from "react";

const NetworkError = ({ error, className = "" }) => {
  return (
    error && (
      <div className={`error ${className}`}>
        {error?.response?.data?.message || error?.message || error}
      </div>
    )
  );
};

export default NetworkError;
