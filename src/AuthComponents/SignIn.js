import React, { useState } from "react";
import { makeStyles } from "@mui/styles";

import {
  Card,
  CardActions,
  CardContent,
  TextField,
  Icon,
  Button,
  Typography,
} from "@mui/material";

import axios from "axios";
import { useNavigate } from "react-router-dom";

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

const SignIn = () => {
  const classes = useStyles();
  let navigate = useNavigate();
  const [values, setValues] = useState({
    username: "",
    password: "",
    error: "",
    redirectToReferrer: false,
  });

  const clickSubmit = async () => {
    const user = {
      username: values.username,
      password: values.password,
    };

    // const response = await axios.post(`${apiConfig}/users/login`, user);

    const response = await axios.post(
      `${apiConfig.baseUrl}/users/login/`,
      user,
    );

    console.log(response);

    localStorage.setItem("userInfo", JSON.stringify(response));

    if (response.error) {
      setValues({ ...values, error: response.error });
    } else {
      setValues({ ...values, error: "" });
      navigate("/");
      window.location.reload();
    }
  };

  const handleUsername = (e) => {
    setValues({
      ...values,
      username: e.target.value,
    });
  };

  const handlePassword = (e) => {
    setValues({
      ...values,
      password: e.target.value,
    });
  };

  return (
    <Card className={classes.card}>
      <CardContent>
        <Typography variant="h6" className={classes.title}>
          Sign In
        </Typography>
        <TextField
          id="username"
          type="text"
          label="username"
          className={classes.textField}
          value={values.username}
          onChange={handleUsername}
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
  );
};

export default SignIn;
