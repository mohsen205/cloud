import React, { useState } from "react";
import { Typography, Box, styled, Button } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import PropTypes from "prop-types";
import constant from "../../../../../constant";
import { BSSnackbar } from "../../../ui/informative";
import { BSModal } from "../../../ui/content";
import api from "../../../../utils/api";

const { httpsEndpoint } = constant;

const ButtonBox = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "flex-end",
  marginTop: theme.spacing(2),
}));

const ArchiveShift = ({ open, setOpen, id, refetch = null }) => {
  const [isSubmitting, setSubmitting] = useState(false);

  const [handleOpenSnackbar, setHandleOpenSnackbar] = useState({
    open: false,
    severity: "error",
    message: "",
  });

  const handleConfirm = () => {
    setSubmitting(true);
    api
      .put(`${httpsEndpoint}/shift/${id}/archive`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("id-token")}`,
        },
      })
      .then(_ => {
        setHandleOpenSnackbar({
          open: true,
          severity: "success",
          message: "Le shift a été archivée avec succès .",
        });

        const closeModal = setTimeout(() => {
          setOpen(false);
          refetch !== null && refetch();
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
        setSubmitting(false);
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
      <BSModal open={open} onClose={() => setOpen(false)}>
        <Typography variant="h6" component="h2">
          Êtes-vous sûr(e) de vouloir archiver cette shift ?
        </Typography>
        <Typography variant="caption" color="error">
          Cette action ne peut pas être annulée.
        </Typography>
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
            Confirmer
          </LoadingButton>
        </ButtonBox>
      </BSModal>
    </>
  );
};

export default ArchiveShift;

ArchiveShift.propTypes = {
  id: PropTypes.string.isRequired,
  setOpen: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  refetch: PropTypes.func,
};
