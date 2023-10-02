import React, { useState, useEffect } from "react";
import AsyncSelect from "react-select/async";
import { FormHelperText, useTheme } from "@mui/material";
import PropTypes from "prop-types";
import { Field } from "formik";
import constant from "../../../../../../constant";
import api from "../../../../../utils/api";

const { httpsEndpoint } = constant;

const FSelectMenu = ({ name }) => {
  const theme = useTheme();
  const [selectedOption] = useState("");
  const [page, setPage] = useState(1);
  const [error, setError] = useState(null);
  const [functions, setFunctions] = useState([]);
  const limit = 20;

  const url = `${httpsEndpoint}/function-options`;

  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("id-token")}`,
    },
  };

  useEffect(() => {
    loadMoreFunctions();
  }, []);

  const loadMoreFunctions = () => {
    api
      .get(
        url,
        {
          params: { searchTerm: "", page, limit },
        },
        config,
      )
      .then(response => {
        setFunctions(prevFunctions => [...prevFunctions, ...response.data]);
        setPage(page + 1);
      })
      .catch(_ => {
        setError("Une erreur s'est produite lors du chargement des fonctions.");
      });
  };

  const loadOptions = (inputValue, callback) => {
    api
      .get(
        url,
        {
          params: { searchTerm: inputValue, page: 1, limit },
        },
        config,
      )
      .then(response => {
        setFunctions(response.data);
        setPage(2);
        callback(response.data);
      })
      .catch(_ => {
        setError(
          "Une erreur s'est produite lors de la recherche des fonctions.",
        );
        callback([]);
      });
  };

  const styles = {
    control: (baseStyles, state) => {
      return {
        ...baseStyles,
        boxShadow: state.isFocused && "none",
        border:
          state.isFocused &&
          `2px solid ${theme.palette.primary.main} !important`,
      };
    },
    option: (styles, { isSelected }) => ({
      ...styles,
      backgroundColor: isSelected
        ? "rgba(26, 147, 140, 0.08) !important"
        : "white",
      color: "black",
    }),
  };

  return (
    <Field name={name}>
      {({ form, field, meta }) => {
        return (
          <>
            <AsyncSelect
              styles={styles}
              className="react-select-container"
              classNamePrefix="react-select"
              cacheOptions
              defaultValue={selectedOption || field.value}
              defaultOptions={functions}
              onChange={selectedOption =>
                form.setFieldValue(name, selectedOption._id)
              }
              onBlur={field.onBlur}
              onFocus={field.onFocus}
              loadOptions={loadOptions}
              getOptionLabel={option => option.functionName}
              getOptionValue={option => option._id}
              onMenuScrollToBottom={loadMoreFunctions}
            />
            <FormHelperText sx={{ color: "error.main" }}>
              {meta.touched && meta.error}
            </FormHelperText>
            {error && (
              <FormHelperText sx={{ color: "error.main" }}>
                {error}
              </FormHelperText>
            )}
          </>
        );
      }}
    </Field>
  );
};

export default FSelectMenu;

FSelectMenu.propTypes = {
  name: PropTypes.string.isRequired,
  isMulti: PropTypes.bool,
};
