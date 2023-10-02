import React, { useState } from "react";
import { Box, IconButton, styled, Button, FormHelperText } from "@mui/material";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import { LoadingButton } from "@mui/lab";
import PropTypes from "prop-types";
import { BSModal, HeaderTitle } from "../../../ui/content";
import {
  BSSnackbar,
  ErrorMessage,
  NoDataMessage,
} from "../../../ui/informative";
import constant from "../../../../../constant";
import useWebSocket from "../../../../utils/Hooks/useWebSocket";
import { checkboxUserColumn } from "../../../columns";
import { TanstackSelectedRowTable } from "../../../ui/table";
import api from "../../../../utils/api";

const { httpsEndpoint, websocketEndpoint } = constant;

const ButtonBox = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "flex-end",
  marginTop: theme.spacing(2),
}));

const AllocateShift = ({ id, setOpen, open }) => {
  if (id === "") return null;

  const [selectedValues, setSelectedValues] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedValuesError, setSelectedValuesError] = useState(false);
  const [handleOpenSnackbar, setHandleOpenSnackbar] = useState({
    open: false,
    severity: "error",
    message: "",
  });

  const { loading, data, error } = useWebSocket(
    `${websocketEndpoint}?method=GET_SHIFT_DATA&id=${id}`,
  );

  const handleConfirm = () => {
    setIsSubmitting(true);
    if (selectedValues.length === 0) {
      setSelectedValuesError(true);
      setIsSubmitting(false);
      return;
    }

    api
      .put(
        `${httpsEndpoint}/shift/${id}/assign-user`,
        {
          usersIds: selectedValues.map(row => row.original._id),
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("id-token")}`,
          },
        },
      )
      .then(_ => {
        setHandleOpenSnackbar({
          open: true,
          severity: "success",
          message: "Le planificateur de quart de travail avec succès",
        });

        const closeModal = setTimeout(() => {
          setOpen(false);
        }, 1500);

        return () => clearTimeout(closeModal);
      })
      .catch(_ => {
        setHandleOpenSnackbar({
          open: true,
          severity: "error",
          message: "Quelque chose s'il vous plaît réessayer plus tard",
        });
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  return (
    <>
      <BSSnackbar
        open={handleOpenSnackbar.open}
        severity={handleOpenSnackbar.severity}
        setOpen={setHandleOpenSnackbar}
        message={handleOpenSnackbar.message}
      />
      <BSModal open={open}>
        <HeaderTitle title="Travailleurs intéressé">
          <IconButton onClick={() => setOpen(false)}>
            <CloseOutlinedIcon />
          </IconButton>
        </HeaderTitle>
        <Box sx={{ overflowY: "auto", maxHeight: "75vh" }}>
          {error || data?.error ? (
            <ErrorMessage />
          ) : data && data?.userConfirmations.length === 0 ? (
            <NoDataMessage />
          ) : (
            <TanstackSelectedRowTable
              data={data?.userConfirmations}
              columns={checkboxUserColumn}
              isLoading={loading}
              pageCount={!loading && data?.userConfirmations.length}
              getSelectedValues={setSelectedValues}
            />
          )}
          <FormHelperText sx={{ color: "error.main" }}>
            {selectedValuesError &&
              "Vous devez sélectionner au moins un travailleur."}
          </FormHelperText>
        </Box>

        <ButtonBox>
          <Button
            color="secondary"
            onClick={() => setOpen(false)}
            sx={{ mr: 1, width: 150 }}
          >
            Annuler
          </Button>
          <LoadingButton
            variant="contained"
            onClick={handleConfirm}
            loading={isSubmitting}
            disabled={isSubmitting}
            sx={{ width: 150 }}
          >
            Assigner
          </LoadingButton>
        </ButtonBox>
      </BSModal>
    </>
  );
};

export default AllocateShift;

AllocateShift.propTypes = {
  id: PropTypes.string.isRequired,
  setOpen: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
};
