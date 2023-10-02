import React from "react";
import { Container, IconButton, Stack } from "@mui/material";
import ArrowBackIosOutlinedIcon from "@mui/icons-material/ArrowBackIosOutlined";
import { useNavigate, useParams } from "react-router-dom";
import { HeaderTitle } from "../../../components/ui/content";
import { ErrorMessage } from "../../../components/ui/informative";
import { BSTabs } from "../../../components/ui/navbar";
import constant from "../../../../constant";
import { useWebSocket } from "../../../utils/Hooks";
import NotFound from "../../NotFound";
import {
  DetailedCardSkeleton,
  ShiftDetailsCard,
  AssignedUserListDisplay,
  PresentedUserListDisplay,
} from "../../../components/custom-ui/shift";

const { websocketEndpoint } = constant;

const ShiftDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { loading, data, error } = useWebSocket(
    `${websocketEndpoint}?method=GET_SHIFT_DATA&id=${id}`,
  );

  const components = [
    {
      label: "Liste de travailleur(s)",
      componentName: "users-list",
      component: (
        <AssignedUserListDisplay data={data} loading={loading} error={error} />
      ),
    },
    {
      label: "Travailleur(s) présents",
      componentName: "users-prensented-list",
      component: (
        <PresentedUserListDisplay data={data} loading={loading} error={error} />
      ),
    },
  ];

  if (!loading && data?.error) {
    if (data.error === "Shift not found") {
      return <NotFound />;
    }
    return <ErrorMessage />;
  }

  return (
    <Container>
      <HeaderTitle>
        <Stack direction="row">
          <IconButton onClick={() => navigate(-1)}>
            <ArrowBackIosOutlinedIcon fontSize="small" />
          </IconButton>
        </Stack>
      </HeaderTitle>
      <Container>
        {loading ? <DetailedCardSkeleton /> : <ShiftDetailsCard data={data} />}
        <BSTabs pages={components} />
      </Container>
    </Container>
  );
};

export default ShiftDetails;
