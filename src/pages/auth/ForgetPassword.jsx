import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Stack,
  FormControl,
  InputLabel,
} from "@mui/material";
import { Formik, Form } from "formik";
import { BSTextField } from "../../components/ui/input";
import { BSSnackbar } from "../../components/ui/informative";
import BoxCentered from "../../components/utils/BoxCentered";
import * as Yup from "yup";
import axios from "axios";
import constant from "../../../constant";

const { httpsEndpoint, logoUrl } = constant;

const initialValues = {
  email: "",
};

const validationSchema = Yup.object({
  email: Yup.string()
    .email("L'email doit être valide")
    .required("L'email est obligatoire"),
});

const ForgetPassword = () => {
  const [handleOpenSnackbar, setHandleOpenSnackbar] = useState({
    open: false,
    severity: "error",
    message: "",
  });

  const onSubmit = (values, { setSubmitting }) => {
    axios
      .post(`${httpsEndpoint}/auth/check-email-exists`, {
        email: values.email,
      })
      .then(response => {
        setHandleOpenSnackbar({
          open: true,
          severity: "success",
          message:
            "Nous vous avons envoyé un e-mail, allez vérifier votre boîte de réception ou le dossier de courrier indésirable pour réinitialiser votre mot de passe",
        });
      })
      .catch(({ response }) => {
        const { error } = response.data;
        if (error === "Email not found") {
          setHandleOpenSnackbar({
            open: true,
            severity: "error",
            message: "Ce courriel n'existe pas.",
          });
        } else {
          setHandleOpenSnackbar({
            open: true,
            severity: "error",
            message: "Quelque chose s'il vous plaît réessayer plus tard",
          });
        }
      })
      .finally(() => setSubmitting(false));
  };

  return (
    <>
      <BSSnackbar
        open={handleOpenSnackbar.open}
        severity={handleOpenSnackbar.severity}
        setOpen={setHandleOpenSnackbar}
        message={handleOpenSnackbar.message}
      />

      <BoxCentered height="100vh">
        <Box>
          <Box>
            <BoxCentered>
              <Box component="img" src={logoUrl} width={100} height={100} />
            </BoxCentered>
            <Typography variant="h5" color="initial" textAlign="center">
              Récupérer votre compte
            </Typography>
          </Box>
          <Box>
            <Formik
              initialValues={initialValues}
              onSubmit={onSubmit}
              validationSchema={validationSchema}
            >
              {({ errors, touched }) => {
                return (
                  <Form>
                    <Stack gap={1} mt={4}>
                      <FormControl variant="standard">
                        <InputLabel shrink htmlFor="email">
                          Email Address
                        </InputLabel>
                        <BSTextField
                          name="email"
                          type="email"
                          placeholder="Email"
                        />
                      </FormControl>
                      <Button
                        type="submit"
                        variant="contained"
                        style={{ padding: 8 }}
                        size="medium"
                      >
                        Réinitialiser votre mot de passe
                      </Button>
                    </Stack>
                  </Form>
                );
              }}
            </Formik>
          </Box>
        </Box>
      </BoxCentered>
    </>
  );
};

export default ForgetPassword;
