import React, { useState } from "react";
import PropTypes from "prop-types";
import { Button, Box } from "@mui/material";
import { BSModal } from "../../../ui/content";
import { NoDataMessage, ErrorMessage } from "../../../ui/informative";
import { TanstackTable } from "../../../ui/table";
import { ShiftApprovalModal, ReplaceOrAddUser } from "./";

import { useApprovalShiftColumns } from "../../../columns";
import { useSelector } from "react-redux";

const PresentedUserListDisplay = ({ loading, data, error }) => {
  const [openReplaceOrAddUser, setOpenReplaceOrAddUser] = useState(false);
  const [approvalPhotoUrl, setApprovalPhotoUrl] = useState("");
  const [openApprovalPhotoModal, setOpenApprovalPhotoModal] = useState(false);
  const [openAprroveModal, setOpenAprroveModal] = useState(false);
  const [userId, setUserId] = useState("");

  const state = useSelector(state => state.sasToken);

  const resizeConfirmationImage = url => {
    setApprovalPhotoUrl(url);
    setOpenApprovalPhotoModal(true);
  };

  const handleAprroveModal = id => {
    setUserId(id);
    setOpenAprroveModal(true);
  };

  const columns = useApprovalShiftColumns(
    resizeConfirmationImage,
    handleAprroveModal,
  );

  return (
    <>
      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
        <Button
          variant="contained"
          onClick={() => setOpenReplaceOrAddUser(true)}
        >
          ajouter un travailleur
        </Button>
      </Box>

      <ReplaceOrAddUser
        id={data._id}
        shiftData={data}
        open={openReplaceOrAddUser}
        setOpen={setOpenReplaceOrAddUser}
      />

      {error ? (
        <ErrorMessage />
      ) : data && data?.clockInRecords.length === 0 ? (
        <NoDataMessage />
      ) : (
        <TanstackTable
          data={data?.clockInRecords}
          columns={columns}
          isLoading={loading}
          pageCount={loading && data?.clockInRecords.length}
        />
      )}

      <BSModal
        open={openApprovalPhotoModal}
        setOpen={setOpenApprovalPhotoModal}
      >
        <Box
          component="img"
          src={
            state?.error
              ? null
              : `${approvalPhotoUrl}?${state?.sasTokens.fileStorage}`
          }
          sx={{ maxWidth: "auto", maxHeight: "80vh" }}
          alt="Photo de confirmation"
        />
      </BSModal>

      <ShiftApprovalModal
        setOpen={setOpenAprroveModal}
        open={openAprroveModal}
        shiftId={data._id}
        userId={userId}
      />
    </>
  );
};

export default PresentedUserListDisplay;

PresentedUserListDisplay.propTypes = {
  error: PropTypes.bool.isRequired,
  loading: PropTypes.bool.isRequired,
  data: PropTypes.object,
};
