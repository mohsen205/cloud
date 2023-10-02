import React, { useState, useEffect } from "react";
import {
  Stack,
  Typography,
  Container,
  FormControl,
  InputLabel,
  Box,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import PropTypes from "prop-types";
import CloseIcon from "@mui/icons-material/Close";
import { useQuery } from "react-query";
import { BSTextField } from "../../ui/input";
import constant from "../../../../constant";
import { BSSnackbar, ErrorMessage, Loading } from "../../ui/informative";
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

const { httpsEndpoint } = constant;

const validationSchema = Yup.object({
  email: Yup.string()
    .email("Adresse e-mail invalide")
    .required("Veuillez saisir une adresse e-mail"),
  clientName: Yup.string().required(
    "Veuillez saisir le nom de l'établissement",
  ),
  responsible: Yup.string().required("Veuillez saisir le premier responsible"),
  address: Yup.string().required("Veuillez saisir une adresse valide"),
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

const getClientData = async id => {
  const response = await api.get(`${httpsEndpoint}/client/${id}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("id-token")}`,
    },
  });
  return response.data;
};

const EditClient = ({ id, open, setOpen }) => {
  if (id === "") return null;
  const [initialClientValue, setInitialClientValue] = useState({
    email: "",
    clientName: "",
    responsible: "",
    address: "",
    phoneNumber: "",
    website: "",
  });

  const [handleOpenSnackbar, setHandleOpenSnackbar] = useState({
    open: false,
    severity: "error",
    message: "",
  });

  const { data, isLoading, isError, refetch } = useQuery(
    ["ClientData", id],
    () => getClientData(id),
    {
      enabled: !!id,
    },
  );

  useEffect(() => {
    if (!isLoading) {
      setInitialClientValue({
        email: data.email,
        clientName: data.clientName,
        responsible: data.responsible,
        address: data.address,
        phoneNumber: data.phoneNumber.slice(2, 12),
        website: data.website,
      });
    }
  }, [data, isLoading]);

  const onSubmit = (values, actions) => {
    const { setFieldError, setSubmitting, setValues } = actions;
    const { address, clientName, phoneNumber, responsible, website, email } =
      values;

    api
      .put(
        `${httpsEndpoint}/client/${id}`,
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
      .then(_ => {
        setHandleOpenSnackbar({
          open: true,
          severity: "success",
          message: "Le client a été mis à jour avec succès.",
        });

        setValues(initialValues);

        refetch();

        setOpen(false);
      })
      .catch(({ response }) => {
        const { error } = response.data;
        if (error === "The email already exists for a different client.") {
          setFieldError("email", "Se Addresse Mail existe déjà.");
        } else if (
          error === "The phone number already exists for a different client."
        ) {
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
        {isLoading ? (
          <Loading />
        ) : isError ? (
          <ErrorMessage />
        ) : (
          <Container sx={{ my: 1, width: "100%" }}>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography variant="h6" color="initial">
                Modifier Client
              </Typography>
              <IconButton onClick={() => setOpen(false)}>
                <CloseIcon />
              </IconButton>
            </Box>
            <Formik
              initialValues={initialClientValue || initialValues}
              onSubmit={onSubmit}
              validationSchema={validationSchema}
              enableReinitialize
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
                          Adresse
                        </InputLabel>
                        <BSTextField
                          name="address"
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
                        Sauvegarder
                      </LoadingButton>
                    </Stack>
                  </Form>
                );
              }}
            </Formik>
          </Container>
        )}
      </BSDrawer>
    </>
  );
};

export default EditClient;

EditClient.propTypes = {
  id: PropTypes.string.isRequired,
  open: PropTypes.bool.isRequired,
  setOpen: PropTypes.func.isRequired,
};
