import axios from "axios";
import React, { useState, useEffect } from "react";
import { makeStyles } from "@mui/styles";
import { Link } from "react-router-dom";
import { apiConfig } from "../config";

import {
  Card,
  Typography,
  CardContent,
  Grid,
  CardMedia,
  Container,
} from "@mui/material";

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
    color: theme.palette.openTitle,
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 250,
  },
  submit: {
    margin: "auto",
    marginBottom: theme.spacing(2),
  },
  toolbarTitle: {
    flexGrow: 1,
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
                <Card className={classes.card} spacing={8}>
                  <CardMedia
                    className={{
                      paddingTop: "56.25%",
                    }}
                    component="img"
                    src={r.image}></CardMedia>
                  <CardContent>
                    <Typography
                      className={classes.textField}
                      gutterBottom
                      variant="h5"
                      component="h2">
                      Room code:{r.id.substring(1, 5)}
                    </Typography>
                    <Typography className={classes.textField}>
                      Room Name: {r.room_name}
                    </Typography>
                    <Typography className={classes.textField}>
                      Doctor Name: {r.doctor_name}
                    </Typography>
                  </CardContent>

                  <nav>
                    <Link
                      color="textPrimary"
                      href="#"
                      className={classes.link}
                      component={NavLink}
                      to={`room/${r.id}/`}>
                      Go To Room
                    </Link>
                  </nav>

                  {/* <CardActions>
                    <NavLink to={`room/${r.id}/`}>Go To Room</NavLink>
                  </CardActions> */}
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
