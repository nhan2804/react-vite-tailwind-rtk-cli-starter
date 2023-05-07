export const array2Object = (arr, key, value_only) => {
  return arr?.reduce((all, cur) => {
    all[cur?.[key]] = value_only ? cur?.[value_only] || 0 : cur;
    return all;
  }, {});
};
