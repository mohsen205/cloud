import React, { useState, useEffect } from "react";
import { Box, List, Typography, useTheme } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { CostumBSOutlinedInput } from "../../ui/input/costum-input";
import { SearchItemDisplay } from "./";
import api from "../../../utils/api";
import constant from "../../../../constant";
import PropTypes from "prop-types";
import { ErrorMessage, Loading } from "../../ui/informative";

const SearchSidebar = ({ selectedUserDetails, onUserSelect }) => {
  const [searchValue, setSearchValue] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const theme = useTheme();

  const fetchData = async searchValue => {
    setLoading(true);
    api
      .get(`${constant.httpsEndpoint}/search-users?q=${searchValue}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("id-token")}`,
        },
      })
      .then(response => setUsers(response.data))
      .catch(error => setError(error))
      .finally(_ => setLoading(false));
  };

  useEffect(() => {
    fetchData(searchValue);
  }, [searchValue]);
  return (
    <Box
      sx={{
        backgroundColor: theme.palette.common.white,
        padding: 2,
        borderRadius: `${theme.shape.borderRadius}px`,
        height: "90vh",
      }}
    >
      <CostumBSOutlinedInput
        placeholder="Recherche...."
        endAdornment={<SearchIcon />}
        value={searchValue}
        onChange={e => setSearchValue(e.target.value)}
      />

      {loading ? (
        <Loading height="50vh" />
      ) : error ? (
        <ErrorMessage getData={fetchData} />
      ) : users.length === 0 ? (
        <Typography
          variant="h6"
          sx={{
            fontWeight: 600,
            color: "#777",
            alignItems: "center",
            justifyContent: "center",
            display: "flex",
            minHeight: "50vh",
          }}
        >
          Aucun utilisateur trouvé.
        </Typography>
      ) : (
        <List>
          {users.map(user => (
            <SearchItemDisplay
              key={user._id}
              user={user}
              selectedUserDetails={selectedUserDetails}
              onUserSelect={onUserSelect}
            />
          ))}
        </List>
      )}
    </Box>
  );
};

export default SearchSidebar;

SearchSidebar.propTypes = {
  selectedUserDetails: PropTypes.object.isRequired,
  onUserSelect: PropTypes.func.isRequired,
};
