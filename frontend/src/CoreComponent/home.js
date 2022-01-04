import axios from "axios";
import React, { useState, useEffect } from "react";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import { Link } from "react-router-dom";
import { apiConfig } from "../config";
// import Card from "@material-ui/core/Card";
// import CardActions from "@material-ui/core/CardActions";
// import CardContent from "@material-ui/core/CardContent";
// import Button from "@material-ui/core/Button";
// import TextField from "@material-ui/core/TextField";
// import Icon from "@material-ui/core/Icon";
// import Dialog from "@material-ui/core/Dialog";
// import DialogActions from "@material-ui/core/DialogActions";
// import DialogContent from "@material-ui/core/DialogContent";
// import DialogContentText from "@material-ui/core/DialogContentText";
// import DialogTitle from "@material-ui/core/DialogTitle";
import {
  Avatar,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemSecondaryAction,
  ListItemText,
  Paper,
} from "@material-ui/core";

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

const roomData = async () => {
  const userLocal = JSON.parse(localStorage.getItem("userInfo"));

  if (userLocal) {
    const config = {
      headers: {
        Authorization: `Bearer ${userLocal.data.access}`,
      },
    };

    console.log(config);

    const data = await axios.get(`${apiConfig.baseUrl}/booking/room`, config);

    return data;
  }
};

const Home = () => {
  const classes = useStyles();
  const [room, setRooms] = useState([
    {
      id: "",
      room_name: "",
      descroption: "",
      doctor: "",
    },
  ]);

  useEffect(() => {
    setRooms(roomData());
  }, []);

  console.log(room);

  return (
    <Paper className={classes.root} elevation={4}>
      <Typography variant="h6" className={classes.title}>
        Profile
      </Typography>
      <List dense>
        <ListItem>
          <ListItemAvatar>
            <Avatar>{/* <Person /> */}</Avatar>
          </ListItemAvatar>
          <ListItemText />{" "}
          {room && (
            <ListItemSecondaryAction>
              <Link to={`/profile/edit/${room.id}`}>
                <IconButton aria-label="Edit" color="primary">
                  {/* <Edit /> */}
                </IconButton>
              </Link>

              <Link to={`/profile/delete/${room.id}`}>
                <IconButton aria-label="Edit" color="secondary"></IconButton>
              </Link>
            </ListItemSecondaryAction>
          )}
        </ListItem>
        <Divider />
        <ListItem>
          {/* <ListItemText
            primary={"Joined: " + new Date(user.created).toDateString()}
          /> */}
        </ListItem>
      </List>
    </Paper>
  );
};

export default Home;
