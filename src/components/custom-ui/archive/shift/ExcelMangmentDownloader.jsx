import React, { useState } from "react";
import {
  Box,
  Typography,
  IconButton,
  InputLabel,
  FormControl,
  Stack,
  FormGroup,
  FormHelperText,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import CloseIcon from "@mui/icons-material/Close";
import PropTypes from "prop-types";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";
import { BSTextField } from "../../../ui/input";
import { BSCheckBox } from "../../../ui/input/BSCheckBox";
import constant from "../../../../../constant";
import { BSSnackbar, BSTooltip } from "../../../ui/informative";
import api from "../../../../utils/api";

const { httpsEndpoint } = constant;

const labeledDataWithIndex = [
  {
    index: 0,
    value: "_id",
    label: "N°",
  },
  {
    index: 1,
    value: "client",
    label: "Nom du client",
  },
  {
    index: 2,
    value: "requestedPosition",
    label: "Poste demandé",
  },
  {
    index: 3,
    value: "date",
    label: "Date",
  },
  {
    index: 4,
    value: "startTime",
    label: "Heure de début",
  },
  {
    index: 5,
    value: "endTime",
    label: "Heure de fin",
  },
  {
    index: 6,
    value: "type",
    label: "Type",
  },
  {
    index: 7,
    value: "createdAt",
    label: "Créé le",
  },
  {
    index: 8,
    value: "updatedAt",
    label: "Mis à jour le",
  },
];

const today = new Date();

const initialValues = {
  worksheetName: "",
  startDate: "",
  endDate: today.toISOString().substr(0, 10),
  fields: [],
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
                return start < end;
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
                return end > start;
              },
              message:
                "La date de fin doit être postérieure à la date de début.",
            })
          : schema;
      }),
    fields: Yup.array()
      .of(Yup.string())
      .min(1, "Vous devez sélectionner au moins un champ."), // Fields array, not required
  },

  ["endDate", "startDate"],
);

const ExcelMangmentDownloader = ({ setOpen }) => {
  const [handleOpenSnackbar, setHandleOpenSnackbar] = useState({
    open: false,
    severity: "error",
    message: "",
  });

  const onSubmit = (values, actions) => {
    const { worksheetName, startDate, endDate, fields } = values;
    const params = new URLSearchParams({
      worksheetName: worksheetName,
      startDate: startDate,
      endDate: endDate,
      fields: fields.join(","), // Join the fields array as a comma-separated string
    });

    api
      .get(`${httpsEndpoint}/shifts/generate-excel?${params.toString()}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("id-token")}`,
        },
        responseType: "blob", // Set the response type to 'blob' to handle binary data
      })
      .then(response => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute(
          "download",
          `${worksheetName || "Feuille des shifts"}.xlsx`,
        );
        document.body.appendChild(link);
        link.click();
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

  return (
    <>
      <BSSnackbar
        open={handleOpenSnackbar.open}
        severity={handleOpenSnackbar.severity}
        setOpen={setHandleOpenSnackbar}
        message={handleOpenSnackbar.message}
      />
      <Box
        sx={{
          minWidth: "500px",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Typography variant="h6" color="initial">
            Liste des shifts archivés
          </Typography>
          <IconButton onClick={() => setOpen(false)}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Formik
          initialValues={initialValues}
          onSubmit={onSubmit}
          validationSchema={validationSchema}
        >
          {({ errors, isSubmitting }) => {
            return (
              <Form>
                {/* first name */}
                <FormControl variant="standard">
                  <InputLabel shrink htmlFor="worksheetName">
                    Nom de la feuille.
                  </InputLabel>
                  <BSTextField
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
                      <BSTextField type="date" name="startDate" />
                    </FormControl>
                    {/* last name */}
                    <FormControl variant="standard">
                      <InputLabel shrink htmlFor="endDate">
                        Date de fin
                      </InputLabel>
                      <BSTextField
                        type="date"
                        placeholder="Nom"
                        name="endDate"
                      />
                    </FormControl>
                  </Stack>
                  <FormControl variant="standard">
                    <InputLabel
                      sx={{
                        display: "flex",
                        alignItems: "center",
                      }}
                      shrink
                      htmlFor="endDate"
                    >
                      Libellés de ligne
                      <BSTooltip title="Sélectionnez les éléments dans le même ordre que les en-têtes du tableau.">
                        <HelpOutlineOutlinedIcon fontSize="small" />
                      </BSTooltip>
                    </InputLabel>

                    <Stack direction="row" sx={{ marginTop: "10px" }}>
                      <FormGroup>
                        {labeledDataWithIndex.slice(0, 5).map(data => {
                          return (
                            <BSCheckBox
                              key={data.index}
                              name="fields"
                              value={data.value}
                              label={data.label}
                            />
                          );
                        })}
                      </FormGroup>
                      <FormGroup>
                        {labeledDataWithIndex.slice(5).map(data => {
                          return (
                            <BSCheckBox
                              key={data.index}
                              name="fields"
                              value={data.value}
                              label={data.label}
                            />
                          );
                        })}
                      </FormGroup>
                    </Stack>
                    <FormHelperText sx={{ color: "error.main" }}>
                      {errors.fields}
                    </FormHelperText>
                  </FormControl>
                  <LoadingButton
                    type="submit"
                    variant="contained"
                    size="medium"
                    fullWidth={true}
                    loading={isSubmitting}
                    disabled={isSubmitting}
                  >
                    Télécharger le fichier Excel
                  </LoadingButton>
                </FormControl>
              </Form>
            );
          }}
        </Formik>
      </Box>
    </>
  );
};

export default ExcelMangmentDownloader;

ExcelMangmentDownloader.propTypes = {
  setOpen: PropTypes.func.isRequired,
};
