import React, { useState } from "react";
import { Button, Container, Stack } from "@mui/material";
import { HeaderTitle } from "../../components/ui/content";
import SearchIcon from "@mui/icons-material/Search";
import { AddClient, ListClients } from "../../components/custom-ui/clients";
import { CostumBSOutlinedInput } from "../../components/ui/input/costum-input";
import { BSMenuSorting } from "../../components/ui/control";

const sortingList = [
  { value: "clientName", label: "Nom du client" },
  { value: "email", label: "Courriel" },
  { value: "phoneNumber", label: "Cellulaire" },
  { value: "createdAt", label: "Créé à" },
];

const Users = () => {
  const [openAddClientData, setOpenAddClientData] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [sortBy, setSortBy] = useState({
    field: "",
    order: "",
  });

  return (
    <Container>
      <HeaderTitle title="Liste de clients">
        <Button variant="contained" onClick={() => setOpenAddClientData(true)}>
          Ajouter client
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

      <ListClients searchValue={searchValue} sortBy={sortBy} />

      <AddClient open={openAddClientData} setOpen={setOpenAddClientData} />
    </Container>
  );
};

export default Users;
