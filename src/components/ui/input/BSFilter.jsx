import React from "react";
import { styled, InputBase, Stack, Button, useTheme } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import PropTypes from "prop-types";

const Search = styled(InputBase)(({ theme }) => ({
  width: 300,
  border: "1px solid #ced4da",
  borderRadius: theme.shape.borderRadius,
  padding: "3px 8px",
  position: "relative",
}));

const BSFilter = ({ filter, setFilter }) => {
  const theme = useTheme();
  const clearFilter = () => {
    setFilter("");
  };
  return (
    <Stack
      sx={{
        flexDirection: "row",
        justifyContent: "space-between",
        backgroundColor: "white",
        borderRadius: `${theme.shape.borderRadius}px`,
        padding: "15px 10px 15px 10px",
      }}
    >
      <Stack>
        <Search
          placeholder="Recherche...."
          startAdornment={
            <SearchIcon sx={{ marginRight: "5px" }} color="disabled" />
          }
          value={filter || ""}
          onChange={e => setFilter(e.target.value)}
        />
      </Stack>

      <Button variant="text" onClick={clearFilter}>
        Effacer tout
      </Button>
    </Stack>
  );
};

export default BSFilter;

BSFilter.propTypes = {
  filter: PropTypes.string.isRequired,
  setFilter: PropTypes.func.isRequired,
};
