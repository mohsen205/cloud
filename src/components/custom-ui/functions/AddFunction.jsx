import React, { useState } from "react";
import {
  IconButton,
  Typography,
  Box,
  Container,
  FormControl,
  InputLabel,
  Stack,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { LoadingButton } from "@mui/lab";
import PropTypes from "prop-types";
import { BSTextField, BSTextarea } from "../../ui/input";
import constant from "../../../../constant.js";
import { BSSnackbar } from "../../ui/informative";
import { BSDrawer } from "../../ui/control";
import api from "../../../utils/api";

const { httpsEndpoint } = constant;

const initialValues = {
  functionName: "",
  comment: "",
};

const validationSchema = Yup.object({
  functionName: Yup.string().required("Le titre de la fonction est requis"),
  comment: Yup.string(),
});

const AddFunction = ({ open, setOpen }) => {
  const [handleOpenSnackbar, setHandleOpenSnackbar] = useState({
    open: false,
    severity: "error",
    message: "",
  });

  const closeDrawer = () => {
    setOpen(false);
  };

  const onSubmit = (values, actions) => {
    const { setFieldError, setSubmitting, setValues } = actions;
    const { functionName, comment } = values;

    api
      .post(
        `${httpsEndpoint}/function`,
        {
          functionName,
          comment,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("id-token")}`,
          },
        },
      )
      .then(() => {
        setHandleOpenSnackbar({
          open: true,
          severity: "success",
          message: "Le Fonction a été ajouté avec succès",
        });

        setValues(initialValues);

        closeDrawer();
      })
      .catch(({ response }) => {
        const { error } = response.data;
        if (error === "The Function already exists.") {
          setFieldError("functionName", "Le nom de la fonction existe déjà");
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

      <BSDrawer open={open} setOpen={setOpen}>
        <Container sx={{ pb: 1 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography variant="h6" color="initial">
              Ajouter Function
            </Typography>
            <IconButton onClick={closeDrawer}>
              <CloseIcon />
            </IconButton>
          </Box>
          <Box>
            <Formik
              initialValues={initialValues}
              onSubmit={onSubmit}
              validationSchema={validationSchema}
            >
              {({ isSubmitting }) => {
                return (
                  <Form>
                    <Stack gap={1}>
                      <FormControl variant="standard">
                        <InputLabel shrink htmlFor="functionName">
                          Titre de la fonction
                        </InputLabel>
                        <BSTextField
                          placeholder="Titre de la fonction"
                          name="functionName"
                        />
                      </FormControl>

                      {/* Comment */}
                      <FormControl variant="standard">
                        <InputLabel shrink htmlFor="comment">
                          Commentaire
                        </InputLabel>
                        <BSTextarea name="comment" />
                      </FormControl>
                      <LoadingButton
                        type="submit"
                        variant="contained"
                        size="medium"
                        fullWidth={true}
                        loading={isSubmitting}
                        disabled={isSubmitting}
                      >
                        Ajouter une Fonction
                      </LoadingButton>
                    </Stack>
                  </Form>
                );
              }}
            </Formik>
          </Box>
        </Container>
      </BSDrawer>
    </>
  );
};

export default AddFunction;

AddFunction.propTypes = {
  setOpen: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
};
