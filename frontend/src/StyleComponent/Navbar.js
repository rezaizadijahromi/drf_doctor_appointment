import React from "react";
import { makeStyles } from "@mui/styles";

import {
  AppBar,
  Toolbar,
  Typography,
  CssBaseline,
  Link,
  Button,
} from "@mui/material";
import { NavLink } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  appBar: {
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
  link: {
    margin: theme.spacing(10),
    padding: theme.spacing(1, 1.5),
  },
  toolbarTitle: {
    flexGrow: 1,
  },
}));

function Navbar() {
  const classes = useStyles();
  return (
    <React.Fragment>
      <CssBaseline />
      <AppBar
        position="static"
        color="default"
        elevation={0}
        className={classes.appBar}>
        <Toolbar className={classes.toolbar}>
          <Typography
            variant="h6"
            color="inherit"
            noWrap
            className={classes.toolbarTitle}>
            <Link
              component={NavLink}
              to="/"
              underline="none"
              color="textPrimary">
              RIJ
            </Link>
          </Typography>

          <nav>
            <Link
              color="textPrimary"
              href="#"
              className={classes.link}
              component={NavLink}
              to="/create-master">
              Create Appointment
            </Link>
          </nav>

          <nav>
            <Link
              color="textPrimary"
              href="#"
              className={classes.link}
              component={NavLink}
              to="/create-lesson">
              Book Appointment
            </Link>
          </nav>

          <nav>
            <Link
              color="textPrimary"
              href="#"
              className={classes.link}
              component={NavLink}
              to="/create">
              Register
            </Link>
          </nav>
          <Button
            href="#"
            color="primary"
            variant="outlined"
            className={classes.link}
            component={NavLink}
            to="/login">
            Login
          </Button>
        </Toolbar>
      </AppBar>
    </React.Fragment>
  );
}

export default Navbar;
