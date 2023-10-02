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
import {
  BSTextField,
  BSTextarea,
  FileUpload,
  BSFieldArray,
} from "../../ui/input";
import * as Yup from "yup";

import { LoadingButton } from "@mui/lab";
import PropTypes from "prop-types";
import constant from "../../../../constant.js";
import { BSSnackbar } from "../../ui/informative";
import { BSDrawer } from "../../ui/control";
import { FSelectMenu, MFSelectMenu } from "../../ui/input/costum-input";
import api from "../../../utils/api";

const { httpsEndpoint } = constant;

const initialValues = {
  userPhoto: "",
  firstName: "",
  lastName: "",
  email: "",
  mainFunction: "",
  subFunctions: [],
  phoneNumber: "",
  birthdayDate: "",
  address: "",
  comment: "",
  attachmentFiles: [{ fileDescription: "", file: {} }],
};

const validationSchema = Yup.object({
  userPhoto: Yup.mixed()
    .test(
      "file-size",
      "La taille de l'image est trop grande (max 1MB)",
      value => {
        return !value || (value && value.size <= 1000000);
      },
    )
    .test(
      "file-min-size",
      "La taille de l'image est trop petite (min 200KB)",
      value => {
        return !value || (value && value.size >= 200000);
      },
    ),
  email: Yup.string()
    .email("Adresse e-mail invalide")
    .required("Veuillez saisir votre adresse e-mail"),
  phoneNumber: Yup.number()
    .typeError("Le numéro de téléphone doit être un nombre.")
    .test("len", "Le numéro de téléphone doit avoir 10 chiffres.", val => {
      if (val) {
        return val.toString().length === 10;
      }
      return true;
    })
    .required("Veuillez saisir votre numéro de téléphone"),
  firstName: Yup.string().required("Veuillez saisir votre prénom"),
  lastName: Yup.string().required("Veuillez saisir votre nom de famille"),
  mainFunction: Yup.string().required("Veuillez saisir une fonction"),
  birthdayDate: Yup.date()
    .nullable()
    .max(new Date(), "Date invalide")
    .required("Veuillez saisir votre date de naissance"),
  address: Yup.string().required("Veuillez saisir votre adresse"),
  comment: Yup.string(),
});

const AddUser = ({ open, setOpen }) => {
  const [handleOpenSnackbar, setHandleOpenSnackbar] = useState({
    open: false,
    severity: "error",
    message: "",
  });

  const onSubmit = (values, actions) => {
    const { setFieldError, setSubmitting, setValues } = actions;

    const subFunctionsIds =
      values.subFunctions.length === 0
        ? []
        : values.subFunctions.map(fn => fn._id);

    const formData = new FormData();
    formData.append("userPhoto", values.userPhoto);
    formData.append("firstName", values.firstName);
    formData.append("lastName", values.lastName);
    formData.append("email", values.email);
    formData.append("mainFunction", values.mainFunction);
    formData.append("subFunctions", `[${subFunctionsIds}]`);
    formData.append("phoneNumber", `+1${values.phoneNumber}`);
    formData.append("birthdayDate", values.birthdayDate);
    formData.append("address", values.address);
    formData.append("comment", values.comment);

    for (let i = 0; i < values.attachmentFiles.length; i++) {
      formData.append(
        `fileDescription${i}`,
        values.attachmentFiles[i].fileDescription,
      );
      formData.append(`attachment${i}`, values.attachmentFiles[i].file);
    }

    api
      .post(`${httpsEndpoint}/user`, formData, {
        headers: {
          "Content-Type": "multipart/data",
          Authorization: `Bearer ${localStorage.getItem("id-token")}`,
        },
      })
      .then(_ => {
        setHandleOpenSnackbar({
          open: true,
          severity: "success",
          message: "Le utilisateur a été ajouté avec succès",
        });

        setValues(initialValues);
        setOpen(false);
      })
      .catch(({ response }) => {
        const { error } = response.data;
        if (error === "Email address is already in use.") {
          setFieldError(
            "email",
            "L'adresse e-mail est déjà utilisée par un autre compte.",
          );
        } else if (error === "Phone number is already in use.") {
          setFieldError(
            "phoneNumber",
            "L'utilisateur avec le numéro de téléphone fourni existe déjà.",
          );
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

      <BSDrawer
        open={open}
        setOpen={setOpen}
        sx={{
          width: "670px",
          "& .MuiDrawer-paper": {
            width: "670px",
          },
        }}
      >
        <Container sx={{ pb: 1 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography variant="h6" color="initial">
              Ajouter Travailleur
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
                  <Form encType="multipart/form-data">
                    <Stack gap={1}>
                      <FormControl variant="standard">
                        <FileUpload
                          name="userPhoto"
                          accept={{ "image/*": [".png", ".jpeg", ".jpg"] }}
                          previewSize={150}
                        />
                      </FormControl>
                      <Stack flexDirection="row" gap={2}>
                        {/* first name */}
                        <FormControl variant="standard">
                          <InputLabel shrink htmlFor="firstName">
                            Prénom
                          </InputLabel>
                          <BSTextField
                            type="text"
                            placeholder="Prénom"
                            name="firstName"
                          />
                        </FormControl>
                        {/* last name */}
                        <FormControl variant="standard">
                          <InputLabel shrink htmlFor="lastName">
                            Nom
                          </InputLabel>
                          <BSTextField
                            type="text"
                            placeholder="Nom"
                            name="lastName"
                          />
                        </FormControl>
                      </Stack>
                      <Stack flexDirection="row" gap={2}>
                        {/* email */}
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
                        {/* Phone number */}
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
                            sx={{
                              "& .MuiOutlinedInput-root": {
                                backgroundColor: "red",
                              },
                            }}
                            placeholder="Numéro de téléphone"
                            name="phoneNumber"
                            startAdornment={
                              <InputAdornment position="start">
                                +1
                              </InputAdornment>
                            }
                          />
                        </FormControl>
                      </Stack>
                      <Stack flexDirection="row" gap={2}>
                        {/* Job title */}
                        <FormControl
                          variant="standard"
                          sx={{
                            width: "300px",
                          }}
                        >
                          <InputLabel shrink htmlFor="mainFunction">
                            Fonction Principale
                          </InputLabel>
                          {/* <FSelectMenu name="selectedOption" /> */}
                          <FSelectMenu name="mainFunction" />
                        </FormControl>
                        {/* Sub functions */}
                        <FormControl
                          sx={{
                            width: "300px",
                          }}
                          variant="standard"
                        >
                          <InputLabel shrink htmlFor="subFunctions">
                            Sous Fonction
                          </InputLabel>
                          <MFSelectMenu name="subFunctions" />
                        </FormControl>
                      </Stack>
                      <Stack flexDirection="row" gap={2}>
                        {/* Birthday date */}
                        <FormControl variant="standard">
                          <InputLabel shrink htmlFor="email">
                            Date de naissance
                          </InputLabel>
                          <BSTextField
                            type="date"
                            placeholder="Email"
                            name="birthdayDate"
                          />
                        </FormControl>
                        {/* Address */}
                        <FormControl variant="standard">
                          <InputLabel shrink htmlFor="address">
                            Address
                          </InputLabel>
                          <BSTextField
                            type="text"
                            placeholder="Suite 21A 1175 boulevard Charest Ouest. Québec,QC, G1N2C9"
                            name="address"
                          />
                        </FormControl>
                      </Stack>

                      {/* Attachment file */}
                      <InputLabel shrink htmlFor="address">
                        Fichier joint
                      </InputLabel>
                      <BSFieldArray name="attachmentFiles" />
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
                        Ajouter un travailleur
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

export default AddUser;

AddUser.propTypes = {
  id: PropTypes.string,
  setOpen: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
};
