import React from "react";
import { Box, Stack, Skeleton, useTheme } from "@mui/material";

const DetailedCardSkeleton = () => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        backgroundColor: "white",
        p: 1,
        mb: 1.5,
        borderRadius: `${theme.shape.borderRadius}px`,
      }}
    >
      <Stack direction="row" justifyContent="space-between">
        <Box width={100}>
          <Skeleton
            variant="text"
            sx={{ width: "80px", fontSize: "0.875rem" }}
          />
          <Skeleton variant="text" sx={{ mt: 1, fontSize: "1rem" }} />
        </Box>
        <Box width={100}>
          <Skeleton
            variant="text"
            sx={{ width: "80px", fontSize: "0.875rem" }}
          />
          <Skeleton variant="text" sx={{ mt: 1, fontSize: "1rem" }} />
        </Box>
        <Box width={100}>
          <Skeleton
            variant="text"
            sx={{ width: "80px", fontSize: "0.875rem" }}
          />
          <Skeleton variant="text" sx={{ mt: 1, fontSize: "1rem" }} />
        </Box>
        <Box width={100}>
          <Skeleton
            variant="text"
            sx={{ width: "80px", fontSize: "0.875rem" }}
          />
          <Skeleton variant="text" sx={{ mt: 1, fontSize: "1rem" }} />
        </Box>
        <Box width={100}>
          <Skeleton
            variant="text"
            sx={{ width: "80px", fontSize: "0.875rem" }}
          />
          <Skeleton variant="text" sx={{ mt: 1, fontSize: "1rem" }} />
        </Box>
        <Box width={100}>
          <Skeleton
            variant="text"
            sx={{ width: "80px", fontSize: "0.875rem" }}
          />
          <Skeleton variant="text" sx={{ mt: 1, fontSize: "1rem" }} />
        </Box>
        <Box width={100}>
          <Skeleton
            variant="text"
            sx={{ width: "80px", fontSize: "0.875rem" }}
          />
          <Skeleton variant="text" sx={{ mt: 1, fontSize: "1rem" }} />
        </Box>
      </Stack>
    </Box>
  );
};

export default DetailedCardSkeleton;
