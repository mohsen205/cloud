import React, { useState } from "react";
import PropTypes from "prop-types";
import { Box, Button, Typography, styled } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { Formik, Form } from "formik";
import constant from "../../../../../constant";
import { BSModal } from "../../../ui/content";
import { BSSnackbar } from "../../../ui/informative";
import { BSRadioGroup } from "../../../ui/input";
import api from "../../../../utils/api";

const { httpsEndpoint } = constant;

const ButtonBox = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "flex-end",
  marginTop: theme.spacing(2),
}));

const ApproveShiftModal = ({ open, setOpen, shiftId, userId }) => {
  const [handleOpenSnackbar, setHandleOpenSnackbar] = useState({
    open: false,
    severity: "error",
    message: "",
  });

  const handleClose = () => {
    setOpen(false);
  };

  const onSubmit = (values, actions) => {
    api
      .put(
        `${httpsEndpoint}/clock-in-record/${shiftId}/approve-and-confirm/${userId}`,
        {
          shiftStatus: values.shiftStatus,
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
          message:
            "Le statut du quart de travail a été mis à jour avec succès.",
        });

        handleClose();
      })
      .catch(_ => {
        setHandleOpenSnackbar({
          open: true,
          severity: "error",
          message: "Quelque chose s'il vous plaît réessayer plus tard",
        });
      })
      .finally(() => {
        actions.setSubmitting(false);
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
      <BSModal open={open} onClose={setOpen}>
        <Box>
          <Typography variant="h6" component="h2">
            Veuillez sélectionner le bon statut de quart de travail pour cet
            employé
          </Typography>
          <Formik
            onSubmit={onSubmit}
            initialValues={{ shiftStatus: "unsuccessful" }}
          >
            {({ isSubmitting }) => {
              return (
                <Form>
                  <BSRadioGroup
                    name="shiftStatus"
                    label=""
                    row
                    options={[
                      { value: "unsuccessful", label: "Échec" },
                      { value: "incomplete", label: "Incomplet" },
                      { value: "successful", label: "Réussite" },
                    ]}
                  />
                  <ButtonBox>
                    <Button
                      type="button"
                      color="secondary"
                      onClick={handleClose}
                      sx={{ mr: 1, width: 150 }}
                    >
                      Annuler
                    </Button>
                    <LoadingButton
                      type="submit"
                      variant="contained"
                      loading={isSubmitting}
                      disabled={isSubmitting}
                      sx={{ width: 150 }}
                    >
                      Confirmer
                    </LoadingButton>
                  </ButtonBox>
                </Form>
              );
            }}
          </Formik>
        </Box>
      </BSModal>
    </>
  );
};

export default ApproveShiftModal;

ApproveShiftModal.propTypes = {
  open: PropTypes.bool.isRequired,
  setOpen: PropTypes.func.isRequired,
  shiftId: PropTypes.string.isRequired,
  userId: PropTypes.string.isRequired,
};
