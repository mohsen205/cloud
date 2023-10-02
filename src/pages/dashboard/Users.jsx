import React, { useState } from "react";
import { Button, Container, Stack } from "@mui/material";
import { HeaderTitle } from "../../components/ui/content";
import SearchIcon from "@mui/icons-material/Search";
import { AddUser, ListUsers } from "../../components/custom-ui/users";
import { CostumBSOutlinedInput } from "../../components/ui/input/costum-input";
import { BSMenuSorting } from "../../components/ui/control";

const sortingList = [
  { value: "email", label: "Courriel" },
  { value: "displayName", label: "Prenom et nom" },
  { value: "phoneNumber", label: "Cellulaire" },
  { value: "createdAt", label: "Créé à" },
];

const Users = () => {
  const [openAddUserData, setOpenAddUserData] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [sortBy, setSortBy] = useState({
    field: "",
    order: "",
  });

  return (
    <Container>
      <HeaderTitle title="Liste de travailleurs">
        <Button variant="contained" onClick={() => setOpenAddUserData(true)}>
          Ajouter travailleur
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

      <ListUsers searchValue={searchValue} sortBy={sortBy} />

      <AddUser open={openAddUserData} setOpen={setOpenAddUserData} />
    </Container>
  );
};

export default Users;
