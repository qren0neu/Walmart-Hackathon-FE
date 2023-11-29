import { Box } from "@mui/material";
import LineChart from "./HighCharts";

export const Report = () => {
  return (
    <Box
      sx={{
        textAlign: "center",
        margin: "100px 50px",
      }}
    >
      <LineChart />
    </Box>
  );
};
