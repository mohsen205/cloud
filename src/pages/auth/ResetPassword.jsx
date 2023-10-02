import React, { useState } from "react";
import { Box, Typography, Stack, FormControl, InputLabel } from "@mui/material";
import { Formik, Form } from "formik";
import { LoadingButton } from "@mui/lab";
import { BSTextField } from "../../components/ui/input";
import BoxCentered from "../../components/utils/BoxCentered";
import * as Yup from "yup";
import constant from "../../../constant";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import { BSSnackbar } from "../../components/ui/informative";

const { logoUrl, httpsEndpoint } = constant;

const initialValues = {
  password: "",
  confirmPassword: "",
};

const validationSchema = Yup.object({
  password: Yup.string()
    .required("Le mot de passe est obligatoire")
    .min(8, "Le mot de passe doit contenir au moins 8 caractères"),
  confirmPassword: Yup.string()
    .oneOf(
      [Yup.ref("password"), null],
      "Les mots de passe ne correspondent pas",
    )
    .required("Confirmez votre mot de passe"),
});

const ResetPassword = () => {
  const [URLSearchParams] = useSearchParams();
  const [handleOpenSnackbar, setHandleOpenSnackbar] = useState({
    open: false,
    severity: "error",
    message: "",
  });

  const oobToken = URLSearchParams.get("oobToken");

  const onSubmit = (values, { setSubmitting }) => {
    axios
      .post(`${httpsEndpoint}/auth/reset-password`, {
        oobToken: oobToken,
        password: values.password,
      })
      .then(response => {
        setHandleOpenSnackbar({
          open: true,
          severity: "success",
          message: "Le mot de passe a été réinitialisé avec succès !",
        });
      })
      .catch(() => {
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
        severity={handleOpenSnackbar.severity}
        open={handleOpenSnackbar.open}
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
              Réinitialiser le mot de passe
            </Typography>
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
                    <Stack gap={1} mt={4}>
                      <FormControl variant="standard">
                        <InputLabel shrink htmlFor="password">
                          Nouveau mot de passe
                        </InputLabel>
                        <BSTextField
                          type="password"
                          name="password"
                          placeholder="Nouveau mot de passe"
                        />
                      </FormControl>
                      <FormControl variant="standard">
                        <InputLabel shrink htmlFor="confirmPassword">
                          Confirmer le mot de passe
                        </InputLabel>
                        <BSTextField
                          type="password"
                          name="confirmPassword"
                          placeholder="Confirmer le mot de passe"
                        />
                      </FormControl>
                      <LoadingButton
                        type="submit"
                        variant="contained"
                        style={{ textTransform: "capitalize", padding: 8 }}
                        size="medium"
                        loading={isSubmitting}
                        disabled={isSubmitting}
                      >
                        Réinitialiser
                      </LoadingButton>
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

export default ResetPassword;
