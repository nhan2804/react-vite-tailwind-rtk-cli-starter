const extractColumnSchema = (inputString) => {
  if (!inputString?.trim()) {
    return "";
  }
  const columns = inputString?.split(",")?.map((e) => e?.trim());
  return columns?.map((e) => {
    const c = e
      ?.split(":")
      ?.map((e) => e?.trim())
      ?.filter((e) => !!e);

    const colum = {
      title: c?.[0],
      key: c?.[1],
      dataIndex: c?.[1],
      ...(!!c?.[2] ? { searchType: c?.[2] } : {}),
    };

    return colum;
  });
};
module.exports = {
  extractColumnSchema,
};
