import axios from "axios";
import React, { useState } from "react";
import { makeStyles } from "@mui/styles";
import Loader from "../Component/Loader";
import Message from "../Component/Message";

import {
  Card,
  CardActions,
  CardContent,
  TextField,
  Icon,
  Button,
  Typography,
  Dialog,
  DialogActions,
  DialogContentText,
  DialogContent,
  DialogTitle,
} from "@mui/material";

import { Link } from "react-router-dom";
import { apiConfig } from "../config";

const useStyles = makeStyles((theme) => ({
  card: {
    maxWidth: 600,
    margin: "auto",
    textAlign: "center",
    marginTop: theme.spacing(5),
    paddingBottom: theme.spacing(2),
  },
  error: {
    verticalAlign: "middle",
  },
  title: {
    marginTop: theme.spacing(2),
    // color: theme.palette.openTitle,
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 300,
  },
  submit: {
    margin: "auto",
    marginBottom: theme.spacing(2),
  },
}));

const SignUp = () => {
  const classes = useStyles();
  const [values, setValues] = useState({
    name: "",
    password: "",
    email: "",
    open: false,
    error: "",
  });

  const clickSubmit = async () => {
    const user = {
      username: values.username,
      email: values.email,
      password: values.password,
      error: values.error,
    };

    const response = await axios.post(
      `${apiConfig.baseUrl}/users/register/`,
      user,
    );

    localStorage.setItem("userInfo", JSON.stringify(response));
    if (response.error) {
      setValues({ ...values, error: response.error });
    } else {
      setValues({ ...values, error: "", open: true });
    }
  };

  const handleUserName = (e) => {
    setValues({
      ...values,
      username: e.target.value,
    });
  };

  const handleEmail = (e) => {
    setValues({
      ...values,
      email: e.target.value,
    });
  };

  const handlePassword = (e) => {
    setValues({
      ...values,
      password: e.target.value,
    });
  };

  return (
    <div>
      <Card className={classes.card}>
        <form onSubmit={clickSubmit}>
          <CardContent>
            <Typography variant="h6" className={classes.title}>
              Sign Up
            </Typography>
            <TextField
              id="username"
              label="Username"
              className={classes.textField}
              value={values.username}
              onChange={handleUserName}
              margin="normal"
            />
            <br />
            <TextField
              id="email"
              type="email"
              label="Email"
              className={classes.textField}
              value={values.email}
              onChange={handleEmail}
              margin="normal"
            />
            <br />
            <TextField
              id="password"
              type="password"
              label="Password"
              className={classes.textField}
              value={values.password}
              onChange={handlePassword}
              margin="normal"
            />
            <br />{" "}
            {values.error && (
              <Typography component="p" color="error">
                <Icon color="error" className={classes.error}>
                  error
                </Icon>
                {values.error}
              </Typography>
            )}
          </CardContent>
        </form>
        <CardActions>
          <Button
            color="primary"
            variant="contained"
            onClick={clickSubmit}
            className={classes.submit}>
            Submit
          </Button>
        </CardActions>
      </Card>
      <Dialog open={values?.open}>
        <DialogTitle>New Account</DialogTitle>
        <DialogContent>
          <DialogContentText>
            New account successfully created.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Link to="/signin">
            <Button color="primary" variant="contained">
              Sign In
            </Button>
          </Link>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default SignUp;
