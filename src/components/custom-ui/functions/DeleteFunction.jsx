import React, { useState, useCallback } from "react";
import { Typography, Box, styled, Button } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import api from "../../../utils/api";
import PropTypes from "prop-types";
import constant from "../../../../constant.js";
import { BSSnackbar } from "../../ui/informative/index.js";
import { BSModal } from "../../ui/content/index.js";

const { httpsEndpoint } = constant;

const ButtonBox = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "flex-end",
  marginTop: theme.spacing(2),
}));

const DeleteFunction = ({ open, setOpen, id }) => {
  const [isSubmitting, setSubmitting] = useState(false);
  const [handleOpenSnackbar, setHandleOpenSnackbar] = useState({
    open: false,
    severity: "error",
    message: "",
  });

  const handleClose = useCallback(() => {
    setOpen(false);
  }, [setOpen]);

  const handleConfirm = () => {
    setSubmitting(true);
    api
      .delete(`${httpsEndpoint}/function/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("id-token")}`,
        },
      })
      .then(_ => {
        setHandleOpenSnackbar({
          open: true,
          severity: "success",
          message: "La fonction a été supprimée avec succès .",
        });

        const closeModal = setTimeout(() => {
          setOpen(false);
        }, 1500);

        return () => clearTimeout(closeModal);
      })
      .catch(({ response }) => {
        const { error } = response.data;
        if (
          error ===
          "Cannot delete this function because it is referenced in user details."
        ) {
          setHandleOpenSnackbar({
            open: true,
            severity: "error",
            message:
              "Impossible de supprimer cette fonction car elle est référencée dans les détails d'utilisateur.",
          });
        } else {
          setHandleOpenSnackbar({
            open: true,
            severity: "error",
            message: "Quelque chose s'il vous plaît réessayer plus tard",
          });
        }
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
      <BSModal open={open} onClose={handleClose}>
        <Typography variant="h6" component="h2">
          Êtes-vous sûr(e) de vouloir supprimer cette fonction ?
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

export default DeleteFunction;

DeleteFunction.propTypes = {
  id: PropTypes.string.isRequired,
  setOpen: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
};
