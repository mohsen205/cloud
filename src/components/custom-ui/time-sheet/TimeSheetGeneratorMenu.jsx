import React, { useState } from "react";
import {
  Box,
  Typography,
  IconButton,
  InputLabel,
  FormControl,
  Stack,
  Container,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import CloseIcon from "@mui/icons-material/Close";
import PropTypes from "prop-types";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import { BSTextField } from "../../ui/input";
import api from "../../../utils/api";
import constant from "../../../../constant";
import { BSSnackbar } from "../../ui/informative";
import { BSDrawer } from "../../ui/control";

const { httpsEndpoint } = constant;

const today = new Date();

const initialValues = {
  worksheetName: "",
  startDate: "",
  endDate: today.toISOString().substr(0, 10),
};

const validationSchema = Yup.object().shape(
  {
    worksheetName: Yup.string().trim(),
    startDate: Yup.string() // Define startDate as a string
      .required("La date de début est requise.")
      .test("is-valid-date", "La date de début n'est pas valide.", value => {
        // Check if the value is a valid date
        return Date.parse(value) ? true : false;
      })
      .when("endDate", (endDate, schema) => {
        return endDate
          ? schema.test({
              test: function (startDate) {
                // Custom validation function to check if startDate is less than endDate
                const start = Date.parse(startDate);
                const end = Date.parse(endDate);
                return start <= end;
              },
              message:
                "La date de début doit être antérieure à la date de fin.",
            })
          : schema;
      }),
    endDate: Yup.string() // Define endDate as a string
      .when("startDate", (startDate, schema) => {
        return startDate
          ? schema.test({
              test: function (endDate) {
                // Custom validation function to check if endDate is greater than startDate
                const start = Date.parse(startDate);
                const end = Date.parse(endDate);
                return end >= start;
              },
              message:
                "La date de fin doit être postérieure à la date de début.",
            })
          : schema;
      }),
  },

  ["endDate", "startDate"],
);

const TimeSheetGeneratorMenu = ({ open, setOpen, id, userName }) => {
  const [handleOpenSnackbar, setHandleOpenSnackbar] = useState({
    open: false,
    severity: "error",
    message: "",
  });

  const onSubmit = (values, actions) => {
    const { worksheetName, startDate, endDate } = values;
    const params = new URLSearchParams({
      worksheetName: worksheetName,
      startDate: startDate,
      endDate: endDate,
    });

    api
      .get(`${httpsEndpoint}/time-sheet/${id}?${params.toString()}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("id-token")}`,
        },
        responseType: "blob", // Set responseType to "blob" to handle binary data
      })
      .then(response => {
        // Create a blob object from the binary data received
        const blob = new Blob([response.data], { type: "application/pdf" });

        // Create a URL for the blob
        const blobUrl = window.URL.createObjectURL(blob);

        // Create an anchor element to trigger the download
        const downloadLink = document.createElement("a");
        downloadLink.href = blobUrl;
        downloadLink.download = `${worksheetName || "Feuille de temps"}.pdf`;

        // Trigger a click event on the anchor element to start the download
        downloadLink.click();

        // Clean up resources
        window.URL.revokeObjectURL(blobUrl);
      })
      .catch(error => {
        console.error(error);
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

  const ReinitializeValue = {
    worksheetName: userName,
    startDate: "",
    endDate: today.toISOString().substr(0, 10),
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
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <Typography variant="h6" color="initial">
              Feuille de temps
            </Typography>
            <IconButton onClick={() => setOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
          <Formik
            initialValues={ReinitializeValue || initialValues}
            onSubmit={onSubmit}
            validationSchema={validationSchema}
            enableReinitialize
          >
            {({ isSubmitting }) => {
              return (
                <Form>
                  {/* first name */}
                  <FormControl variant="standard">
                    <InputLabel shrink htmlFor="worksheetName">
                      Nom de la feuille.
                    </InputLabel>
                    <BSTextField
                      sx={{ minWidth: "350px" }}
                      type="text"
                      placeholder="Feuille des utilisateurs"
                      name="worksheetName"
                    />
                    <Stack flexDirection="row" gap={2}>
                      {/* first name */}
                      <FormControl variant="standard">
                        <InputLabel shrink htmlFor="startDate">
                          Date de début
                        </InputLabel>
                        <BSTextField
                          type="date"
                          sx={{ minWidth: "150px" }}
                          name="startDate"
                        />
                      </FormControl>
                      {/* last name */}
                      <FormControl variant="standard">
                        <InputLabel shrink htmlFor="endDate">
                          Date de fin
                        </InputLabel>
                        <BSTextField
                          type="date"
                          sx={{ minWidth: "150px" }}
                          name="endDate"
                        />
                      </FormControl>
                    </Stack>
                    <LoadingButton
                      type="submit"
                      variant="contained"
                      size="medium"
                      fullWidth={true}
                      loading={isSubmitting}
                      disabled={isSubmitting}
                      sx={{ marginTop: 1 }}
                    >
                      Télécharger
                    </LoadingButton>
                  </FormControl>
                </Form>
              );
            }}
          </Formik>
        </Container>
      </BSDrawer>
    </>
  );
};

export default TimeSheetGeneratorMenu;

TimeSheetGeneratorMenu.propTypes = {
  open: PropTypes.bool.isRequired,
  setOpen: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired,
  userName: PropTypes.string.isRequired,
};
