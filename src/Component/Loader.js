// import React from "react";
// import { Spinner } from "react-bootstrap";

// const Loader = () => {
//   return (
//     <Spinner
//       animation="border"
//       role="status"
//       style={{
//         width: "100px",
//         height: "100px",
//         margin: "auto",
//         display: "block",
//       }}>
//       <span className="sr-only">Loading...</span>
//     </Spinner>
//   );
// };

// export default Loader;

import * as React from "react";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

export default function Loader() {
  return (
    <Box sx={{ display: "flex" }}>
      <CircularProgress
        style={{
          width: "100px",
          height: "100px",
          margin: "auto",
          display: "block",
          marginTop: "20%",
          zIndex: 100,
        }}
      />
    </Box>
  );
}
