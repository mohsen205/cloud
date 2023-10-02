import React, { useEffect, useReducer, useState } from "react";
import { Container } from "@mui/material";
import PropTypes from "prop-types";
import { NoDataMessage, ErrorMessage } from "../../ui/informative";
import { TanstackTable } from "../../ui/table";
import { DeleteUser, EditUser, DisplayUserDetails, ArchiveUser } from "./";
import { useUserColumn } from "../../columns";
import useWebSocket from "../../../utils/Hooks/useWebSocket";
import constant from "../../../../constant";

const { websocketEndpoint } = constant;

const initialState = {
  isEditUserModalOpen: false,
  editedUserId: "",
  isDisplayUserDrawerOpen: false,
  displayUserId: "",
  isDeleteUserModalOpen: false,
  deletedUserId: "",
  isArchiveUserModalOpen: false,
  archiveUserId: "",
  isExcelUserModalOpen: false,
  excelUserId: "",
  excelUserName: "",
};

const reducer = (state, action) => {
  switch (action.type) {
    case "SET_EDIT_USER_MODAL_OPEN":
      return { ...state, isEditUserModalOpen: action.payload };
    case "SET_EDITED_USER_ID":
      return { ...state, editedUserId: action.payload };
    case "SET_DISPLAY_USER_DRAWER_OPEN":
      return { ...state, isDisplayUserDrawerOpen: action.payload };
    case "SET_DISPLAY_USER_ID":
      return { ...state, displayUserId: action.payload };
    case "SET_DELETE_USER_MODAL_OPEN":
      return { ...state, isDeleteUserModalOpen: action.payload };
    case "SET_DELETED_USER_ID":
      return { ...state, deletedUserId: action.payload };
    case "SET_ARCHIVE_USER_MODAL_OPEN":
      return { ...state, isArchiveUserModalOpen: action.payload };
    case "SET_ARCHIVE_USER_ID":
      return { ...state, archiveUserId: action.payload };
    default:
      return state;
  }
};

const ListUsers = ({ searchValue, sortBy }) => {
  const [fetchDataOptions, setFetchDataOptions] = useState({
    pageIndex: 1,
    pageSize: 10,
  });

  const { loading, data, error, sendData } = useWebSocket(
    `${websocketEndpoint}?method=GET_USERS_DATA`,
  );

  const [state, dispatch] = useReducer(reducer, initialState);

  const handleOpenEditUser = id => {
    dispatch({ type: "SET_EDITED_USER_ID", payload: id });
    dispatch({ type: "SET_EDIT_USER_MODAL_OPEN", payload: true });
  };

  const handleOpenDeleteUser = id => {
    dispatch({ type: "SET_DELETED_USER_ID", payload: id });
    dispatch({ type: "SET_DELETE_USER_MODAL_OPEN", payload: true });
  };

  const handleOpenDisplayUserDrawer = id => {
    dispatch({ type: "SET_DISPLAY_USER_ID", payload: id });
    dispatch({ type: "SET_DISPLAY_USER_DRAWER_OPEN", payload: true });
  };

  const handleOpenArchiveUser = id => {
    dispatch({ type: "SET_ARCHIVE_USER_ID", payload: id });
    dispatch({ type: "SET_ARCHIVE_USER_MODAL_OPEN", payload: true });
  };

  const columns = useUserColumn(
    handleOpenDisplayUserDrawer,
    handleOpenEditUser,
    handleOpenDeleteUser,
    handleOpenArchiveUser,
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
      ) : data && data?.users.length === 0 ? (
        <NoDataMessage />
      ) : (
        <TanstackTable
          data={data?.users}
          columns={columns}
          isLoading={loading}
          pageCount={data?.totalCount}
          manualPagination={true}
          setFetchDataOptions={setFetchDataOptions}
        />
      )}

      <EditUser
        id={state.editedUserId}
        open={state.isEditUserModalOpen}
        setOpen={value =>
          dispatch({ type: "SET_EDIT_USER_MODAL_OPEN", payload: value })
        }
      />

      <DisplayUserDetails
        id={state.displayUserId}
        open={state.isDisplayUserDrawerOpen}
        setOpen={value =>
          dispatch({ type: "SET_DISPLAY_USER_DRAWER_OPEN", payload: value })
        }
      />

      <DeleteUser
        id={state.deletedUserId}
        open={state.isDeleteUserModalOpen}
        setOpen={value =>
          dispatch({ type: "SET_DELETE_USER_MODAL_OPEN", payload: value })
        }
      />

      <ArchiveUser
        id={state.archiveUserId}
        open={state.isArchiveUserModalOpen}
        setOpen={value =>
          dispatch({ type: "SET_ARCHIVE_USER_MODAL_OPEN", payload: value })
        }
      />
    </Container>
  );
};

export default ListUsers;

ListUsers.propTypes = {
  searchValue: PropTypes.string,
  sortBy: PropTypes.object,
};
