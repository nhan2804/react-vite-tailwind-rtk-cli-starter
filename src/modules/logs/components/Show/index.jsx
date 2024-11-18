import React from "react";

const ShowLogs = ({ log }) => {
  const { name, data } = log;
  return (
    <div>
      <h3>{name}</h3>
      <div className="overflow-auto">
        <pre>{JSON.stringify(data, null, 2)}</pre>
      </div>
    </div>
  );
};

export default ShowLogs;
