import React from "react";
import { Container, Button, Stack } from "@mui/material";
import { useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import { HeaderTitle } from "../../components/ui/content";
import {
  AddFunction,
  ListFunction,
} from "../../components/custom-ui/functions";
import { CostumBSOutlinedInput } from "../../components/ui/input/costum-input";
import { BSMenuSorting } from "../../components/ui/control";

const sortingList = [
  { value: "functionName", label: "Fonction" },
  { value: "createdAt", label: "Créé à" },
];

const Functions = () => {
  const [openAddFunction, setOpenAddFunction] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const [sortBy, setSortBy] = useState({
    field: "",
    order: "",
  });

  return (
    <Container>
      <HeaderTitle title="Liste de Functions">
        <Button variant="contained" onClick={() => setOpenAddFunction(true)}>
          Ajouter functions
        </Button>
      </HeaderTitle>
      <Container sx={{ marginTop: 1 }}>
        <Stack direction="row" justifyContent="space-between">
          <CostumBSOutlinedInput
            placeholder="Recherche...."
            endAdornment={<SearchIcon />}
            value={searchValue}
            onChange={e => setSearchValue(e.target.value)}
          />
          <BSMenuSorting list={sortingList} setSortBy={setSortBy} />
        </Stack>
      </Container>
      <ListFunction searchValue={searchValue} sortBy={sortBy} />
      <AddFunction open={openAddFunction} setOpen={setOpenAddFunction} />
    </Container>
  );
};

export default Functions;
