import React, { useState } from "react";
import {
  IconButton,
  Typography,
  Box,
  Container,
  FormControl,
  InputLabel,
  Stack,
  InputAdornment,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { Formik, Form } from "formik";
import { BSTextField } from "../../ui/input";
import * as Yup from "yup";
import PropTypes from "prop-types";
import { LoadingButton } from "@mui/lab";
import { BSSnackbar } from "../../ui/informative";
import constant from "../../../../constant";
import { BSDrawer } from "../../ui/control";
import api from "../../../utils/api";

const initialValues = {
  email: "",
  clientName: "",
  responsible: "",
  address: "",
  phoneNumber: "",
  website: "",
};

const validationSchema = Yup.object({
  email: Yup.string()
    .email("addresse e-mail invalide")
    .required("Veuillez saisir votre addresse e-mail"),
  clientName: Yup.string().required(
    "Veuillez saisir le nom de l'établissement",
  ),
  responsible: Yup.string().required("Veuillez saisir le premier responsible"),
  address: Yup.string().required("Veuillez saisir une addresse valide"),
  phoneNumber: Yup.number()
    .typeError("Le numéro de téléphone doit être un nombre.")
    .test("len", "Le numéro de téléphone doit avoir 10 chiffres.", val => {
      if (val) {
        return val.toString().length === 10;
      }
      return true;
    })
    .required("Veuillez saisir votre numéro de téléphone"),
  website: Yup.string()
    .required("Veuillez saisir le site web de votre client")
    .matches(
      /^(http(s)?:\/\/)?([w]{3}\.)?[a-zA-Z0-9-]+(\.[a-zA-Z]{2,}){1,}$/i,
      "format URL invalide ",
    ),
});

const { httpsEndpoint } = constant;

const AddClient = ({ open, setOpen }) => {
  const [handleOpenSnackbar, setHandleOpenSnackbar] = useState({
    open: false,
    severity: "error",
    message: "",
  });

  const onSubmit = (values, actions) => {
    const { setSubmitting, setValues, setFieldError } = actions;
    const { address, clientName, phoneNumber, responsible, website, email } =
      values;

    api
      .post(
        `${httpsEndpoint}/client`,
        {
          address,
          clientName,
          phoneNumber: `+1${phoneNumber}`,
          responsible,
          website,
          email,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("id-token")}`,
          },
        },
      )
      .then(response => {
        if (response.data.message) {
          setHandleOpenSnackbar({
            open: true,
            severity: "success",
            message: "Le client a été ajouté avec succès.",
          });

          setValues(initialValues);

          setOpen(false);
        }
      })
      .catch(({ response }) => {
        const { error } = response.data;
        if (error === "The email already exists.") {
          setFieldError("email", "Se Addresse Mail existe déjà.");
        } else if (error === "The phone number already exists.") {
          setFieldError("phoneNumber", "Le numéro de téléphone existe déjà.");
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
        <Container sx={{ my: 2 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography variant="h6" color="initial">
              Ajouter Client
            </Typography>
            <IconButton onClick={() => setOpen(false)}>
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
                        <InputLabel shrink htmlFor="clientName">
                          Nom Company
                        </InputLabel>
                        <BSTextField
                          name="clientName"
                          type="text"
                          placeholder="Nom Company"
                        />
                      </FormControl>

                      <FormControl variant="standard">
                        <InputLabel shrink htmlFor="website">
                          Site Web
                        </InputLabel>
                        <BSTextField
                          name="website"
                          type="url"
                          placeholder="Site Web"
                        />
                      </FormControl>

                      <FormControl variant="standard">
                        <InputLabel shrink htmlFor="phoneNumber">
                          Numéro de téléphone
                          <Typography
                            component="span"
                            variant="body1"
                            color="error.main"
                          >
                            *
                          </Typography>
                        </InputLabel>
                        <BSTextField
                          type="tel"
                          placeholder="Numéro de téléphone"
                          name="phoneNumber"
                          startAdornment={
                            <InputAdornment position="start">+1</InputAdornment>
                          }
                        />
                      </FormControl>

                      <FormControl variant="standard">
                        <InputLabel shrink htmlFor="responsible">
                          Premier responsible
                        </InputLabel>
                        <BSTextField
                          name="responsible"
                          type="text"
                          placeholder="Premier responsible"
                        />
                      </FormControl>

                      <FormControl variant="standard">
                        <InputLabel shrink htmlFor="email">
                          Addresse Mail
                        </InputLabel>
                        <BSTextField
                          name="email"
                          type="email"
                          placeholder="Email"
                        />
                      </FormControl>

                      <FormControl variant="standard">
                        <InputLabel shrink htmlFor="address">
                          addresse
                        </InputLabel>
                        <BSTextField
                          name="address"
                          type="text"
                          placeholder="Suite 21A 1175 boulevard Charest Ouest. Québec,QC, G1N2C9"
                        />
                      </FormControl>
                      <LoadingButton
                        type="submit"
                        variant="contained"
                        size="medium"
                        fullWidth={true}
                        loading={isSubmitting}
                        disabled={isSubmitting}
                      >
                        Ajouter un client
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

export default AddClient;

AddClient.propTypes = {
  setOpen: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
};
