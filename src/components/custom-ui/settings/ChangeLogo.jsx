import React, { useState } from "react";
import { FormControl, Paper, Stack } from "@mui/material";
import * as Yup from "yup";
import { Form, Formik } from "formik";
import { LoadingButton } from "@mui/lab";
import { FileUpload } from "../../ui/input";
import BoxCentered from "../../utils/BoxCentered";
import constant from "../../../../constant";
import { BSSnackbar } from "../../ui/informative";
import api from "../../../utils/api";

const { logoUrl, httpsEndpoint } = constant;

const initialValues = {
  logo: logoUrl,
};

const validationSchema = Yup.object({
  logo: Yup.mixed()
    .test(
      "file-size",
      "La taille de l'image est trop grande (max 3MB)",
      value => {
        return !value || (value && value.size <= 3000000);
      },
    )
    .test(
      "file-min-size",
      "La taille de l'image est trop petite (min 500KB)",
      value => {
        return !value || (value && value.size >= 500000);
      },
    ),
});

const ChangeLogo = () => {
  const [handleOpenSnackbar, setHandleOpenSnackbar] = useState({
    open: false,
    severity: "error",
    message: "",
  });
  const onSubmit = (values, action) => {
    const { setSubmitting } = action;
    const formData = new FormData();

    formData.append("logo", values.logo);
    api
      .put(`${httpsEndpoint}/settings/update-logo`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("id-token")}`,
        },
      })
      .then(_ => {
        setHandleOpenSnackbar({
          open: true,
          severity: "success",
          message: "Le logo a été mise a jour avec succès",
        });
        setTimeout(() => {
          location.reload();
        }, 1000);
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
      <Paper
        sx={{
          marginY: 1,
          p: 1,
        }}
      >
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
        >
          {({ isSubmitting, initialValues }) => {
            const { logo } = initialValues;
            return (
              <Form>
                <Stack gap={1}>
                  <FormControl variant="standard">
                    <FileUpload
                      name="logo"
                      accept={{ "image/*": [".png", ".jpeg", ".jpg"] }}
                      previewSize={150}
                      initialValue={logo}
                    />
                  </FormControl>
                  <BoxCentered>
                    <LoadingButton
                      type="submit"
                      variant="contained"
                      size="medium"
                      disabled={isSubmitting}
                      loading={isSubmitting}
                    >
                      Enregistrer
                    </LoadingButton>
                  </BoxCentered>
                </Stack>
              </Form>
            );
          }}
        </Formik>
      </Paper>
    </>
  );
};

export default ChangeLogo;
