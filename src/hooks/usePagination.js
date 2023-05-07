/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import useQueryString2 from "./useQueryString";
import qs_v2 from "query-string";
import qs from "qs";
import { array2Object } from "@helper/array2Obj";

const usePagination = ({ reset } = { reset: [] }) => {
  const rs = reset ? [...reset] : [];
  const querystring = useQueryString2();
  const [current, setCurrent] = useState(1);
  const [perPage, setPerPage] = useState(20);
  const qsParsed = querystring?.qsParsed2;
  const qsSort = qsParsed?.sort;
  const [sort, setSort] = useState(qsSort || []);

  const nav = useNavigate();
  const onChange = (page, pageSize) => {
    setCurrent(page);
    setPerPage(pageSize);
  };

  useEffect(() => {
    setCurrent(1);
    return () => {};
  }, [...rs, perPage]);

  const onChangeTable = (_, __, sort) => {
    let newSort = Array.isArray(sort)
      ? sort?.map((e) => ({ order: e?.order, field: e?.field }))
      : [{ order: sort?.order, field: sort?.field }];
    newSort = newSort?.filter((e) => !!e?.order);
    setSort((o) => newSort);

    const queryParams = qs_v2.parse(window.location.search);

    for (const key in queryParams) {
      if (key.startsWith("sort")) delete queryParams[key];
    }
    const newQueries = { ...queryParams, sort: newSort };
    // qs.append("tab", t);
    nav({
      search: qs.stringify(newQueries, {
        encode: false,
      }),
    });
  };
  const tableSortOrder = array2Object(sort, "field");
  return {
    current,
    onChange,
    pageSize: perPage,
    // sortObj: sort,
    onChangeTable,
    sort: { sort },
    tableSortOrder,
  };
};

export default usePagination;
