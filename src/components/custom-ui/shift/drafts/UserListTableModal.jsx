import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Box, styled, Button } from "@mui/material";
import { NoDataMessage, ErrorMessage } from "../../../ui/informative";
import { BSModal } from "../../../ui/content";
import { checkboxUserColumn } from "../../../columns";
import { TanstackSelectedRowTable } from "../../../ui/table";

const ButtonBox = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "flex-end",
  marginTop: theme.spacing(2),
}));

const UserListTableModal = ({
  open,
  setOpen,
  data,
  isLoading,
  isError,
  contextValues,
}) => {
  const [selectedValues, setSelectedValues] = useState([]);

  const { setFieldValue } = contextValues;

  useEffect(() => {
    setFieldValue(
      "selectedPublicationTargets",
      selectedValues.map(row => ({
        _id: row.original._id,
        displayName: row.original.displayName,
        email: row.original.email,
        phoneNumber: row.original.phoneNumber,
      })),
    );
  }, [selectedValues]);

  return (
    <BSModal open={open} setOpen={setOpen}>
      <Box sx={{ overflowY: "auto", maxHeight: "75vh" }}>
        {isError ? (
          <ErrorMessage />
        ) : data && data.length === 0 ? (
          <NoDataMessage />
        ) : (
          <TanstackSelectedRowTable
            data={data}
            columns={checkboxUserColumn}
            isLoading={isLoading}
            pageCount={!isLoading && data?.length}
            getSelectedValues={setSelectedValues}
          />
        )}
      </Box>
      <ButtonBox>
        <Button
          color="secondary"
          onClick={() => setOpen(false)}
          sx={{ mr: 1, width: 150 }}
        >
          Annuler
        </Button>
        <Button
          variant="contained"
          onClick={() => setOpen(false)}
          sx={{ width: 150 }}
        >
          Confirmer
        </Button>
      </ButtonBox>
    </BSModal>
  );
};

export default UserListTableModal;

UserListTableModal.propTypes = {
  open: PropTypes.bool.isRequired,
  setOpen: PropTypes.func.isRequired,
  data: PropTypes.arrayOf(PropTypes.object),
  isLoading: PropTypes.bool.isRequired,
  isError: PropTypes.bool.isRequired,
  setData: PropTypes.func,
  contextValues: PropTypes.object.isRequired,
};
