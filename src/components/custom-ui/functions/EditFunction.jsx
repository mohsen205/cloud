import React, { useState } from "react";
import PropTypes from "prop-types";
import { Formik, Form } from "formik";
import * as Yup from "yup";
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
import { LoadingButton } from "@mui/lab";
import constant from "../../../../constant.js";
import { BSTextField, BSTextarea } from "../../ui/input/index.js";
import {
  BSSnackbar,
  ErrorMessage,
  Loading,
} from "../../ui/informative/index.js";
import { BSDrawer } from "../../ui/control/index.js";
import { useQuery } from "react-query";
import api from "../../../utils/api.js";

const { httpsEndpoint } = constant;

const initialValues = {
  functionName: "",
  comment: "",
};

const validationSchema = Yup.object({
  functionName: Yup.string().required("Le titre de la fonction est requis"),
  comment: Yup.string(),
});

const getFunctionData = async id => {
  const response = await api.get(`${httpsEndpoint}/function/${id}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("id-token")}`,
    },
  });
  return response.data;
};

const EditFunction = ({ open, setOpen, id }) => {
  const [handleOpenSnackbar, setHandleOpenSnackbar] = useState({
    open: false,
    severity: "error",
    message: "",
  });

  const {
    data: initialFunctionsValue,
    isLoading,
    isError,
    refetch,
  } = useQuery(["functionData", id], () => getFunctionData(id), {
    enabled: !!id,
  });

  const onSubmit = (values, actions) => {
    const { setFieldError, setSubmitting } = actions;
    const { functionName, comment } = values;
    api
      .put(
        `${httpsEndpoint}/function/${id}`,
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
          message: "La fonction a été mise à jour avec succès",
        });

        refetch();

        setOpen(false);
      })
      .catch(({ response }) => {
        const { error } = response.data;
        if (error === "The function already exists.") {
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
        {isLoading ? (
          <Loading />
        ) : isError ? (
          <ErrorMessage />
        ) : (
          <Container sx={{ pb: 1 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography variant="h6" color="initial">
                Modifier Fonction
              </Typography>
              <IconButton onClick={() => setOpen(false)}>
                <CloseIcon />
              </IconButton>
            </Box>
            <Box>
              <Formik
                initialValues={initialFunctionsValue || initialValues}
                onSubmit={onSubmit}
                validationSchema={validationSchema}
                enableReinitialize
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
                        <Box>
                          <LoadingButton
                            type="submit"
                            variant="contained"
                            size="medium"
                            fullWidth={true}
                            loading={isSubmitting}
                            disabled={isSubmitting}
                          >
                            sauvegarder
                          </LoadingButton>
                        </Box>
                      </Stack>
                    </Form>
                  );
                }}
              </Formik>
            </Box>
          </Container>
        )}
      </BSDrawer>
    </>
  );
};

EditFunction.propTypes = {
  open: PropTypes.bool,
  setOpen: PropTypes.func,
  id: PropTypes.string.isRequired,
};

export default EditFunction;
