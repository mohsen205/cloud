import React, { useEffect, useReducer, useState } from "react";
import { Container } from "@mui/material";
import PropTypes from "prop-types";
import { DeleteFunction, EditFunction } from "./";
import { TanstackTable } from "../../ui/table";
import { useFunctionColumns } from "../../columns";
import { ErrorMessage, NoDataMessage } from "../../ui/informative";
import useWebSocket from "../../../utils/Hooks/useWebSocket";
import constant from "../../../../constant";

const { websocketEndpoint } = constant;

const initialState = {
  isEditFunctionDrawerOpen: false,
  editedFunctionId: "",
  isDeleteFunctionModalOpen: false,
  deletedFunctionId: "",
};

const reducer = (state, action) => {
  switch (action.type) {
    case "SET_EDIT_FUNCTION_DRAWER_OPEN":
      return { ...state, isEditFunctionDrawerOpen: action.payload };
    case "SET_EDITED_FUNCTION_ID":
      return { ...state, editedFunctionId: action.payload };
    case "SET_DELETE_FUNCTION_MODAL_OPEN":
      return { ...state, isDeleteFunctionModalOpen: action.payload };
    case "SET_DELETED_FUNCTION_ID":
      return { ...state, deletedFunctionId: action.payload };
    default:
      return state;
  }
};

const ListFunction = ({ searchValue, sortBy }) => {
  const [fetchDataOptions, setFetchDataOptions] = useState({
    pageIndex: 1,
    pageSize: 10,
  });

  const { loading, data, error, sendData } = useWebSocket(
    `${websocketEndpoint}?method=GET_FUNCTIONS_DATA`,
  );

  const [state, dispatch] = useReducer(reducer, initialState);

  const handleOpenEditFunctionDrawer = id => {
    dispatch({ type: "SET_EDITED_FUNCTION_ID", payload: id });
    dispatch({ type: "SET_EDIT_FUNCTION_DRAWER_OPEN", payload: true });
  };

  const handleOpenDeleteFunctionModal = id => {
    dispatch({ type: "SET_DELETED_FUNCTION_ID", payload: id });
    dispatch({ type: "SET_DELETE_FUNCTION_MODAL_OPEN", payload: true });
  };

  const columns = useFunctionColumns(
    handleOpenEditFunctionDrawer,
    handleOpenDeleteFunctionModal,
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
      ) : data && data?.functions.length === 0 ? (
        <NoDataMessage />
      ) : (
        <TanstackTable
          data={data?.functions}
          columns={columns}
          isLoading={loading}
          pageCount={data?.totalCount}
          manualPagination={true}
          setFetchDataOptions={setFetchDataOptions}
        />
      )}
      <EditFunction
        id={state.editedFunctionId}
        open={state.isEditFunctionDrawerOpen}
        setOpen={value =>
          dispatch({ type: "SET_EDIT_FUNCTION_DRAWER_OPEN", payload: value })
        }
      />
      <DeleteFunction
        id={state.deletedFunctionId}
        open={state.isDeleteFunctionModalOpen}
        setOpen={value =>
          dispatch({ type: "SET_DELETE_FUNCTION_MODAL_OPEN", payload: value })
        }
      />
    </Container>
  );
};

export default ListFunction;

ListFunction.propTypes = {
  searchValue: PropTypes.string,
  sortBy: PropTypes.object,
};
