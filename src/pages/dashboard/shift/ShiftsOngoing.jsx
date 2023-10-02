import React, { useState } from "react";
import { Container, Stack } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { HeaderTitle } from "../../../components/ui/content";
import { OngoingShiftTable } from "../../../components/custom-ui/shift";
import { CostumBSOutlinedInput } from "../../../components/ui/input/costum-input";
import { BSMenuSorting } from "../../../components/ui/control";

const sortingList = [
  { value: "shiftNumber", label: "N°" },
  { value: "client", label: "Nom du Client" },
  { value: "date", label: "Date" },
  { value: "requestedPosition", label: "Fonction" },
  { value: "createdAt", label: "Créé à" },
];

const ShiftsOngoing = () => {
  const [searchValue, setSearchValue] = useState("");

  const [sortBy, setSortBy] = useState({
    field: "",
    order: "",
  });

  return (
    <Container>
      <HeaderTitle title="Tous les shifts" />
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
      <OngoingShiftTable searchValue={searchValue} sortBy={sortBy} />
    </Container>
  );
};

export default ShiftsOngoing;
