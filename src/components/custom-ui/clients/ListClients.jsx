import React, { useEffect, useReducer, useState } from "react";
import { Container } from "@mui/material";
import PropTypes from "prop-types";
import { NoDataMessage, ErrorMessage } from "../../ui/informative";
import { TanstackTable } from "../../ui/table";
import { DeleteClient, EditClient, ArchiveClient } from "./";
import { useClientColumn } from "../../columns";
import useWebSocket from "../../../utils/Hooks/useWebSocket";
import constant from "../../../../constant";

const { websocketEndpoint } = constant;

const initialState = {
  isEditClientModalOpen: false,
  editedClientId: "",
  isDeleteClientModalOpen: false,
  deletedClientId: "",
  isArchiveClientModalOpen: false,
  archiveClientId: "",
};

const reducer = (state, action) => {
  switch (action.type) {
    case "SET_EDIT_CLIENT_MODAL_OPEN":
      return { ...state, isEditClientModalOpen: action.payload };
    case "SET_EDITED_CLIENT_ID":
      return { ...state, editedClientId: action.payload };
    case "SET_DELETE_CLIENT_MODAL_OPEN":
      return { ...state, isDeleteClientModalOpen: action.payload };
    case "SET_DELETED_CLIENT_ID":
      return { ...state, deletedClientId: action.payload };
    case "SET_ARCHIVE_CLIENT_MODAL_OPEN":
      return { ...state, isArchiveClientModalOpen: action.payload };
    case "SET_ARCHIVE_CLIENT_ID":
      return { ...state, archiveClientId: action.payload };
    default:
      return state;
  }
};

const ListClients = ({ searchValue, sortBy }) => {
  const [fetchDataOptions, setFetchDataOptions] = useState({
    pageIndex: 1,
    pageSize: 10,
  });

  const { loading, data, error, sendData } = useWebSocket(
    `${websocketEndpoint}?method=GET_CLIENTS_DATA`,
  );

  const [state, dispatch] = useReducer(reducer, initialState);

  const handleOpenEditClient = id => {
    dispatch({ type: "SET_EDITED_CLIENT_ID", payload: id });
    dispatch({ type: "SET_EDIT_CLIENT_MODAL_OPEN", payload: true });
  };

  const handleOpenDeleteClient = id => {
    dispatch({ type: "SET_DELETED_CLIENT_ID", payload: id });
    dispatch({ type: "SET_DELETE_CLIENT_MODAL_OPEN", payload: true });
  };

  const handleOpenArchiveClient = id => {
    dispatch({ type: "SET_ARCHIVE_CLIENT_ID", payload: id });
    dispatch({ type: "SET_ARCHIVE_CLIENT_MODAL_OPEN", payload: true });
  };

  const columns = useClientColumn(
    handleOpenEditClient,
    handleOpenDeleteClient,
    handleOpenArchiveClient,
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
      ) : data && data?.clients.length === 0 ? (
        <NoDataMessage />
      ) : (
        <TanstackTable
          data={data?.clients}
          columns={columns}
          isLoading={loading}
          pageCount={data?.totalCount}
          manualPagination={true}
          setFetchDataOptions={setFetchDataOptions}
        />
      )}

      <EditClient
        id={state.editedClientId}
        open={state.isEditClientModalOpen}
        setOpen={value =>
          dispatch({ type: "SET_EDIT_CLIENT_MODAL_OPEN", payload: value })
        }
      />

      <DeleteClient
        id={state.deletedClientId}
        open={state.isDeleteClientModalOpen}
        setOpen={value =>
          dispatch({ type: "SET_DELETE_CLIENT_MODAL_OPEN", payload: value })
        }
      />

      <ArchiveClient
        id={state.archiveClientId}
        open={state.isArchiveClientModalOpen}
        setOpen={value =>
          dispatch({ type: "SET_ARCHIVE_CLIENT_MODAL_OPEN", payload: value })
        }
      />
    </Container>
  );
};

export default ListClients;

ListClients.propTypes = {
  searchValue: PropTypes.string,
  sortBy: PropTypes.object,
};
