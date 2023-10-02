import React, { useState } from "react";
import {
  Box,
  Typography,
  Stack,
  FormControl,
  InputLabel,
  Link,
} from "@mui/material";
import { Formik, Form } from "formik";
import { LoadingButton } from "@mui/lab";
import * as Yup from "yup";
import { BSTextField } from "../../components/ui/input";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import BoxCentered from "../../components/utils/BoxCentered";
import { loginAdmin } from "../../store/actions/authActions";
import { BSSnackbar } from "../../components/ui/informative";
import constant from "../../../constant";

const { logoUrl } = constant;

const initialValues = {
  email: "",
  password: "",
};

const validationSchema = Yup.object({
  email: Yup.string()
    .email("L'email doit être valide")
    .required("L'email est obligatoire"),
  password: Yup.string().required("Le mot de passe est obligatoire"),
});

const Login = () => {
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onSubmit = async (values, { setSubmitting }) => {
    try {
      await dispatch(
        loginAdmin({
          adminEmail: values.email,
          adminPassword: values.password,
        }),
      ).unwrap();
      setSubmitting(false);
      navigate("/dashboard");
    } catch (error) {
      setErrorMessage(
        "Veuillez vérifier votre adresse e-mail et votre mot de passe .",
      );
      setOpenSnackbar(true);
      setSubmitting(false);
    }
  };

  return (
    <>
      <BSSnackbar
        severity="error"
        open={openSnackbar}
        setOpen={setOpenSnackbar}
        message={errorMessage}
      />
      <BoxCentered height="100vh">
        <Box>
          <Box>
            <BoxCentered>
              <Box component="img" src={logoUrl} width={100} height={100} />
            </BoxCentered>
            <Typography variant="h5" color="initial" textAlign="center">
              Se connecter
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
                        <InputLabel shrink htmlFor="email">
                          Email Address
                        </InputLabel>
                        <BSTextField
                          type="email"
                          name="email"
                          placeholder="Email"
                        />
                      </FormControl>
                      <FormControl variant="standard">
                        <InputLabel shrink htmlFor="password">
                          Mot de pass
                        </InputLabel>
                        <BSTextField
                          type="password"
                          name="password"
                          placeholder="Mot de pass"
                        />
                      </FormControl>
                      <Stack direction="row" justifyContent="flex-end">
                        <Link
                          underline="none"
                          variant="caption"
                          color="primary"
                          onClick={() => navigate("forget-password")}
                          sx={{ cursor: "pointer" }}
                        >
                          Réinitialiser le mot de passe ?
                        </Link>
                      </Stack>
                      <LoadingButton
                        type="submit"
                        variant="contained"
                        style={{ textTransform: "capitalize", padding: 8 }}
                        size="medium"
                        loading={isSubmitting}
                        disabled={isSubmitting}
                      >
                        Se connecter
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

export default Login;
