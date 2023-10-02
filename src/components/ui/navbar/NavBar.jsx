import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  TextField,
  Container,
} from "@mui/material";
import PropTypes from "prop-types";

const NavBar = ({ onAddClient, onSearch, searchTerm }) => {
  return (
    <AppBar position="fixed">
      <Container maxWidth="md">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Liste Des Clients
          </Typography>
          <TextField
            label="Rechercher"
            variant="outlined"
            size="small"
            value={searchTerm}
            onChange={onSearch}
            sx={{ mr: 2 }}
          />
          <Button variant="contained" onClick={onAddClient}>
            Ajouter Client
          </Button>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default NavBar;

NavBar.propTypes = {
  onAddClient: PropTypes.func.isRequired,
  onSearch: PropTypes.func,
  searchTerm: PropTypes.string,
};
