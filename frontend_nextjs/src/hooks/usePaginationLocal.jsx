import EmptyContentTable from "app/components/Atoms/EmptyContentTable";
import { pick } from "opLodash";
import React, { useState } from "react";
import { useQuery } from "react-query";

const DEFAULT_DATA = {
  content: [],
  total: 0,
};

const DEFAULT_PAGE_SIZE = 10;

const getExtraParams = (filterLocal, extra) => pick(filterLocal, extra);
const getExtraParamslocation = (filterLocation, extra) =>
  pick(filterLocation, extra);

export default function usePaginationLocal(
  callFn,
  extra = [],
  defaultParams = {},
  keyQuery = "",
  queryConfig = {},
  rowKey
) {
  const [filterLocal, setFilterLocal] = useState({
    ...defaultParams,
    page: 1,
    size: defaultParams.pageSize || DEFAULT_PAGE_SIZE,
    count: 0,
  });

  const [filterLocation, setFilterLocation] = useState({
    ...defaultParams,
    page: 1,
    size: defaultParams.pageSize || DEFAULT_PAGE_SIZE,
    count: 0,
  });

  const [filterExtra, setFilterExtra] = useState({});

  const { page, size } = filterLocal;
  const sort = filterLocal.sort || defaultParams.sort;
  const {
    data,
    error,
    isLoading,
    isFetching,
    refetch: refetchList,
  } = useQuery(
    [`usePagination.${keyQuery}`, filterLocal.count, filterLocation.count],
    async () => {
      try {
        const res = await callFn({
          ...filterLocal,
          page: page - 1,
          size,
          sort: sort || null,
          ...getExtraParams(filterLocal, extra),
          ...getExtraParamslocation(filterLocation, extra),
          count: null,
        });

        return res;
      } catch (e) {
        return DEFAULT_DATA;
      }
    },
    {
      initialData: DEFAULT_DATA,
      keepPreviousData: true,
      ...queryConfig,
    }
  );

  const regexId = (value) => {
    if (value !== null) {
      const arr = value.split("/");
      const id = parseInt(arr[0], 10);
      // const code = arr.length > 1 ? arr[1] : '';
      return id;
    }
    return "";
  };

  function onChangeParams(params, resetPage = true) {
    if (resetPage) {
      filterLocal.page = 1;
    }
    Object.keys(params).forEach((key) => {
      if (params[key] === undefined) {
        filterLocal[key] = null;
      } else {
        filterLocal[key] = params[key];
      }
    });
    setFilterLocal({ ...filterLocal, count: filterLocal.count + 1 });
  }

  function onChangeParamsLocation(params, resetPage = true) {
    if (resetPage) {
      filterLocation.page = 1;
    }
    Object.keys(params).forEach((key) => {
      if (params[key] === undefined) {
        filterLocation[key] = null;
      } else {
        filterLocation[key] = regexId(params[key]);
        filterExtra[key] = params[key];
      }
    });
    setFilterLocation({ ...filterLocation, count: filterLocation.count + 1 });
    setFilterExtra({ ...filterExtra });
  }

  const onChangeOneParamLocation =
    (param, resetPage = true) =>
    (value) =>
      onChangeParamsLocation({ [param]: value }, resetPage);

  const onChangeOneParam =
    (param, resetPage = true) =>
    (value) =>
      onChangeParams({ [param]: value }, resetPage);

  function onPageChange(newPage, newPageSize) {
    onChangeParams({
      page: newPage,
      size: newPageSize,
    });
  }

  function onChangeTable(pagination, filters, sorter, { action }) {
    if (action === "paginate") {
      onChangeParams({
        page: pagination.current,
        size: pagination.pageSize,
      });
      onChangeOneParamLocation({
        page: pagination.current,
        size: pagination.pageSize,
      });
      return;
    }
    if (action === "sort") {
      const params = {};
      if (!sorter.order) {
        params.sort = "";
      } else {
        params.sort = `${sorter.field},${sorter.order.slice(0, -3)}`;
      }
      onChangeParams(params);
      onChangeOneParamLocation(params);
    }
  }

  const { content, total } = data;
  const refetch = async () => {
    const { data: dataRs } = await refetchList();
    if ((!dataRs || !dataRs.content || !dataRs.content.length) && page > 1) {
      onChangeParams({
        page: page - 1,
      });
      onChangeOneParamLocation({
        page: page - 1,
      });
    }
  };

  return {
    data,
    error,
    isLoading,
    isFetching,
    onChangeParams,
    onPageChange,
    page,
    pageSize: size,
    content,
    total,
    sort,
    filterLocal,
    setFilterLocal,
    refetch,
    onChangeOneParam,
    configTable: {
      scroll: { x: 800 },
      dataSource: content,
      loading: isFetching,
      rowKey:
        rowKey ||
        ((record) => record.ignoreKey || record.id || record.subscriptionId),
      pagination: {
        current: page,
        pageSize: size,
        total,
        onChange: onPageChange,
        showSizeChanger: total > 0 && !defaultParams.pageSize,
        position: ["bottomCenter"],
        pageSizeOptions: [10, 20, 50],
      },
      onChange: onChangeTable,
      locale: {
        emptyText: <EmptyContentTable />,
      },
    },
    onChangeOneParamLocation,
    filterLocation,
    filterExtra,
  };
}
