import React from "react";
import { TextareaAutosize, styled, FormHelperText } from "@mui/material";
import { Field } from "formik";
import PropTypes from "prop-types";

const CostumTextarea = styled(TextareaAutosize)(({ theme }) => ({
  "label + &": {
    marginTop: theme.spacing(3),
  },
  fontFamily: `"Roboto","Helvetica","Arial",sans-serif`,
  backgroundColor: "#F1F4FA",
  borderRadius: theme.shape.borderRadius,
  position: "relative",
  border: "1px solid #ced4da",
  fontSize: 16,
  padding: "10px 16px",
  outline: "none",
  "&:hover": {
    border: "1px solid black",
  },
  "&:focus": {
    borderWidth: "2px",
    borderColor: theme.palette.primary.main,
  },
}));

const BSTextarea = ({ name, ...props }) => {
  return (
    <Field name={name}>
      {({ field, meta }) => {
        return (
          <>
            <CostumTextarea {...field} {...props} minRows={2} />
            <FormHelperText sx={{ color: "error.main" }}>
              {meta.touched && meta.error}
            </FormHelperText>
          </>
        );
      }}
    </Field>
  );
};

export default BSTextarea;

BSTextarea.propTypes = {
  name: PropTypes.string.isRequired,
};
