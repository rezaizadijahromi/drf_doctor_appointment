import React from "react";
import { Alert, Collapse, IconButton } from "@mui/material";
import { Box } from "@mui/system";
import CloseIcon from "@mui/icons-material/Close";

const Message = ({ variant, children }) => {
  const [open, setOpen] = React.useState(true);

  return (
    <Box sx={{ width: "100%" }}>
      <Collapse in={open}>
        <Alert
          severity={variant}
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={() => {
                setOpen(false);
              }}>
              <CloseIcon fontSize="inherit" />
            </IconButton>
          }
          sx={{ mb: 2 }}>
          {children}
        </Alert>
      </Collapse>
    </Box>
  );
};

Message.defaultProps = {
  variant: "info",
};

export default Message;
