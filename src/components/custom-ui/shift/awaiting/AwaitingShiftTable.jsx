import React, { useEffect, useReducer, useState } from "react";
import PropTypes from "prop-types";
import { Container } from "@mui/material";
import { ErrorMessage, NoDataMessage } from "../../../ui/informative";
import { TanstackTable } from "../../../ui/table";
import { DeleteShift, AllocateShift } from ".";
import { useAwaitingShiftColumns } from "../../../columns";
import useWebSocket from "../../../../utils/Hooks/useWebSocket";
import constant from "../../../../../constant";

const { websocketEndpoint } = constant;

const initialState = {
  isAllocateShiftModalOpen: false,
  allocatedShiftId: "",

  isDeleteShiftModalOpen: false,
  deletedShiftId: "",
};

const reducer = (state, action) => {
  switch (action.type) {
    case "SET_ALLOCATE_SHIFT_MODAL_OPEN":
      return { ...state, isAllocateShiftModalOpen: action.payload };
    case "SET_ALLOCATED_SHIFT_ID":
      return { ...state, allocatedShiftId: action.payload };
    case "SET_DELETE_SHIFT_MODAL_OPEN":
      return { ...state, isDeleteShiftModalOpen: action.payload };
    case "SET_DELETED_SHIFT_ID":
      return { ...state, deletedShiftId: action.payload };
    default:
      return state;
  }
};

const AwaitingShiftTable = ({ searchValue, sortBy }) => {
  const [fetchDataOptions, setFetchDataOptions] = useState({
    pageIndex: 1,
    pageSize: 10,
  });
  const { loading, data, error, sendData } = useWebSocket(
    `${websocketEndpoint}?method=GET_SHIFTS_DATA&status=pending`,
  );

  const [state, dispatch] = useReducer(reducer, initialState);

  const handleOpenDeleteModal = id => {
    dispatch({ type: "SET_DELETED_SHIFT_ID", payload: id });
    dispatch({ type: "SET_DELETE_SHIFT_MODAL_OPEN", payload: true });
  };

  const handleOpenAllocateModal = id => {
    dispatch({ type: "SET_ALLOCATED_SHIFT_ID", payload: id });
    dispatch({ type: "SET_ALLOCATE_SHIFT_MODAL_OPEN", payload: true });
  };

  const columns = useAwaitingShiftColumns(
    handleOpenAllocateModal,
    handleOpenDeleteModal,
  );

  useEffect(() => {
    if (searchValue !== "") {
      sendData({
        searchQuery: {
          globalSearch: searchValue,
        },
      });
    }
    if (sortBy.field !== "" && sortBy.order !== 0) {
      sendData({
        sortBy: sortBy,
      });
    }
  }, [searchValue, sortBy]);

  useEffect(() => {
    sendData({
      page: fetchDataOptions.pageIndex + 1,
    });
  }, [fetchDataOptions.pageIndex]);

  useEffect(() => {
    sendData({
      pageSize: fetchDataOptions.pageSize + 1,
    });
  }, [fetchDataOptions.pageSize]);

  return (
    <Container>
      {error || data?.error ? (
        <ErrorMessage />
      ) : data && data?.shifts.length === 0 ? (
        <NoDataMessage />
      ) : (
        <TanstackTable
          data={data?.shifts}
          columns={columns}
          isLoading={loading}
          pageCount={data?.totalCount}
          manualPagination={true}
          setFetchDataOptions={setFetchDataOptions}
        />
      )}

      <AllocateShift
        id={state.allocatedShiftId}
        open={state.isAllocateShiftModalOpen}
        setOpen={value =>
          dispatch({ type: "SET_ALLOCATE_SHIFT_MODAL_OPEN", payload: value })
        }
      />

      <DeleteShift
        id={state.deletedShiftId}
        open={state.isDeleteShiftModalOpen}
        status="not-published"
        setOpen={value =>
          dispatch({ type: "SET_DELETE_SHIFT_MODAL_OPEN", payload: value })
        }
      />
    </Container>
  );
};

export default AwaitingShiftTable;

AwaitingShiftTable.propTypes = {
  searchValue: PropTypes.string,
  sortBy: PropTypes.object,
};
