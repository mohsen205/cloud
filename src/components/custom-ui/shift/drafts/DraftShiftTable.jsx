import React, { useEffect, useReducer, useState } from "react";
import PropTypes from "prop-types";
import { Container } from "@mui/material";
import { useDraftShiftColumns } from "../../../columns/shifts-columns/index";
import { ErrorMessage, NoDataMessage } from "../../../ui/informative";
import { TanstackTable } from "../../../ui/table";
import { DeleteShift, EditShift, PublishShift } from ".";
import useWebSocket from "../../../../utils/Hooks/useWebSocket";
import constant from "../../../../../constant";
import { ArchiveShift } from "../common-ui";

const { websocketEndpoint } = constant;

const initialState = {
  isEditShiftModalOpen: false,
  editedShiftId: "",

  isDeleteShiftModalOpen: false,
  deletedShiftId: "",

  isPublishShiftModalOpen: false,
  publishedShiftId: "",

  isArchiveShiftModalOpen: false,
  archivedShiftId: "",
};

const reducer = (state, action) => {
  switch (action.type) {
    case "SET_EDIT_SHIFT_MODAL_OPEN":
      return { ...state, isEditShiftModalOpen: action.payload };
    case "SET_EDITED_SHIFT_ID":
      return { ...state, editedShiftId: action.payload };
    case "SET_DELETE_SHIFT_MODAL_OPEN":
      return { ...state, isDeleteShiftModalOpen: action.payload };
    case "SET_DELETED_SHIFT_ID":
      return { ...state, deletedShiftId: action.payload };
    case "SET_PUBLISH_SHIFT_MODAL_OPEN":
      return { ...state, isPublishShiftModalOpen: action.payload };
    case "SET_PUBLISHED_SHIFT_ID":
      return { ...state, publishedShiftId: action.payload };
    case "SET_ARCHIVE_SHIFT_MODAL_OPEN":
      return { ...state, isArchiveShiftModalOpen: action.payload };
    case "SET_ARCHIVED_SHIFT_ID":
      return { ...state, archivedShiftId: action.payload };
    default:
      return state;
  }
};

const DraftShiftTable = ({ searchValue, sortBy }) => {
  const [fetchDataOptions, setFetchDataOptions] = useState({
    pageIndex: 1,
    pageSize: 10,
  });
  const { loading, data, error, sendData } = useWebSocket(
    `${websocketEndpoint}?method=GET_SHIFTS_DATA&status=not-published`,
  );

  const [state, dispatch] = useReducer(reducer, initialState);

  const handleOpenDeleteModal = id => {
    dispatch({ type: "SET_DELETED_SHIFT_ID", payload: id });
    dispatch({ type: "SET_DELETE_SHIFT_MODAL_OPEN", payload: true });
  };

  const handleOpenEditDrawer = id => {
    dispatch({ type: "SET_EDITED_SHIFT_ID", payload: id });
    dispatch({ type: "SET_EDIT_SHIFT_MODAL_OPEN", payload: true });
  };

  const handleOpenPublishModal = id => {
    dispatch({ type: "SET_PUBLISHED_SHIFT_ID", payload: id });
    dispatch({ type: "SET_PUBLISH_SHIFT_MODAL_OPEN", payload: true });
  };

  const handleOpenArchiveModal = id => {
    dispatch({ type: "SET_ARCHIVED_SHIFT_ID", payload: id });
    dispatch({ type: "SET_ARCHIVE_SHIFT_MODAL_OPEN", payload: true });
  };

  const columns = useDraftShiftColumns(
    handleOpenEditDrawer,
    handleOpenDeleteModal,
    handleOpenPublishModal,
    handleOpenArchiveModal,
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

      <PublishShift
        id={state.publishedShiftId}
        open={state.isPublishShiftModalOpen}
        setOpen={value =>
          dispatch({ type: "SET_PUBLISH_SHIFT_MODAL_OPEN", payload: value })
        }
      />

      <EditShift
        id={state.editedShiftId}
        open={state.isEditShiftModalOpen}
        setOpen={value =>
          dispatch({ type: "SET_EDIT_SHIFT_MODAL_OPEN", payload: value })
        }
      />

      <DeleteShift
        id={state.deletedShiftId}
        open={state.isDeleteShiftModalOpen}
        setOpen={value =>
          dispatch({ type: "SET_DELETE_SHIFT_MODAL_OPEN", payload: value })
        }
      />

      <ArchiveShift
        id={state.archivedShiftId}
        open={state.isArchiveShiftModalOpen}
        setOpen={value =>
          dispatch({ type: "SET_ARCHIVE_SHIFT_MODAL_OPEN", payload: value })
        }
      />
    </Container>
  );
};

export default DraftShiftTable;

DraftShiftTable.propTypes = {
  searchValue: PropTypes.string,
  sortBy: PropTypes.object,
};
