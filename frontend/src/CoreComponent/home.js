import axios from "axios";
import React, { useState, useEffect } from "react";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import { Link } from "react-router-dom";
import { apiConfig } from "../config";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Icon from "@material-ui/core/Icon";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import { CardMedia, Container, Grid } from "@material-ui/core";
import { NavLink } from "react-router-dom";

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

const Home = () => {
  const classes = useStyles();
  const [room, setRooms] = useState([
    {
      id: "",
      room_name: "",
      descroption: "",
      doctor: "",
      image: "",
    },
  ]);

  const roomData = async () => {
    const userLocal = JSON.parse(localStorage.getItem("userInfo"));

    if (userLocal) {
      const config = {
        headers: {
          Authorization: `Bearer ${userLocal.data.access}`,
        },
      };

      const data = await axios.get(
        `${apiConfig.baseUrl}/booking/room/`,
        config,
      );

      setRooms(data.data);
    }
  };

  useEffect(() => {
    roomData();
  }, []);

  return (
    <React.Fragment>
      <main>
        <Container maxWidth="md">
          <Grid container spacing={4}>
            {room.map((r, index) => (
              <Grid item key={index} xs={12} sm={6} md={4}>
                <Card spacing={8}>
                  <CardMedia component="img" src={r.image}></CardMedia>
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="h2">
                      Room code:{r.id.substring(1, 5)}
                    </Typography>
                    <Typography>Room Name: {r.room_name}</Typography>
                    <Typography>Doctor Name: {r.doctor_name}</Typography>
                  </CardContent>
                  <CardActions>
                    <NavLink to={`room/${r.id}/`}>Go To Room</NavLink>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </main>
    </React.Fragment>
  );
};

export default Home;
