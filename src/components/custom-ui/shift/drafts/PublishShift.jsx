import React, { useState, useCallback } from "react";
import { Typography, Box, styled, Button } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import api from "../../../../utils/api";
import constant from "../../../../../constant.js";
import PropTypes from "prop-types";
import { BSSnackbar } from "../../../ui/informative/index.js";
import { BSModal } from "../../../ui/content/index.js";

const { httpsEndpoint } = constant;

const ButtonBox = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "flex-end",
  marginTop: theme.spacing(2),
}));

const PublishShift = ({ open, setOpen, id }) => {
  const [isSubmitting, setSubmitting] = useState(false);
  const [handleOpenSnackbar, setHandleOpenSnackbar] = useState({
    open: false,
    severity: "error",
    message: "",
  });

  const handleClose = useCallback(() => {
    setOpen(false);
  }, [setOpen]);

  const onSubmit = () => {
    setSubmitting(true);
    api
      .put(
        `${httpsEndpoint}/shift/${id}/publish`,
        {},
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
          message: "Le shift a été publié avec succès.",
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
      <BSModal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Typography variant="h6" component="h2">
          Êtes-vous sûr(e) de vouloir diffuser cette shift ?
        </Typography>
        <Typography variant="caption" color="error">
          Cette action ne peut pas être annulée.
        </Typography>
        <ButtonBox>
          <Button
            color="secondary"
            onClick={handleClose}
            sx={{ mr: 1, width: 150 }}
          >
            Annuler
          </Button>
          <LoadingButton
            variant="contained"
            onClick={onSubmit}
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

export default PublishShift;

PublishShift.propTypes = {
  id: PropTypes.string.isRequired,
  setOpen: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
};
