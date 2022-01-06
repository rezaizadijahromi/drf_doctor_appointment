import axios from "axios";
import React, { useState, useEffect } from "react";
// import { makeStyles } from "@material-ui/core/styles";
import { makeStyles } from "@mui/styles";
import { apiConfig } from "../config";
import {
  Box,
  ButtonGroup,
  Grid,
  Paper,
  Button,
  TextField,
  Typography,
  Card,
  CardMedia,
  CardContent,
} from "@mui/material";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
// import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import DateTimePicker from "@mui/lab/DateTimePicker";

import { useParams } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 300,
  },
  textFieldInline: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 100,
    paddingLeft: theme.spacing(1),
    display: "inline-block",
    border: `1px solid ${theme.palette.divider}`,
    backgroundColor: "darkgray",
  },
  submit: {
    margin: "auto",
    marginBottom: theme.spacing(2),
  },

  link: {
    margin: theme.spacing(1, 1.5),
  },
  toolbarTitle: {
    flexGrow: 1,
  },
  paper: {
    margin: theme.spacing(2),
    width: theme.spacing(75),
    height: theme.spacing(55),
  },
  paper1: {
    margin: theme.spacing(2),
    width: theme.spacing(75),
    height: theme.spacing(80),
  },
  outerbox: {
    height: "100%",
    display: "inline-block",
    flexDirection: "column",
    // alignItems: "flex-end",
    // justifyContent: "flex-end",
  },
  outerbox1: {
    height: "100%",
    display: "inline-block",
    flexDirection: "column",
    // alignItems: "flex-start",
    // justifyContent: "flex-start",
  },

  rightBox: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
  },

  card: {
    maxWidth: 600,
    margin: "auto",
    textAlign: "center",
    marginTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
  },
}));

const SlotList = ({ match }) => {
  const classes = useStyles();

  const [date, setDate] = useState(new Date(""));
  const [value, setValue] = useState([
    {
      id: "",
      booking_date: "",
      start_timing: "",
      end_timing: "",
      patient: "",
    },
  ]);

  const [docInfo, setDocInfo] = useState({
    room_name: "",
    doctor_name: "",
    description: "",
    get_vote_ratio: 0,
  });

  const [doctorImage, setDoctorImage] = useState("");
  const [skills, setSkills] = useState([]);
  const [intrests, setIntrests] = useState([]);
  const [error, setError] = useState(false);

  let { id } = useParams();

  const slotListData = async () => {
    const userLocal = JSON.parse(localStorage.getItem("userInfo"));

    if (userLocal) {
      const config = {
        headers: {
          Authorization: `Bearer ${userLocal.data.access}`,
        },
      };

      const data = await axios.get(
        `${apiConfig.baseUrl}/booking/room/${id}`,
        config,
      );
      if (data.data.status === "success") {
        setValue(data.data.data);
        setDate(data.data.date);
        setDocInfo(data.data.doctor_information);
        setSkills(data.data.skills);
        setIntrests(data.data.intrests);
        setDoctorImage(data.data.doctor_pic);
      } else {
        setError(true);
      }

      console.log(data.data);
    }
  };

  const handelDate = (newVal) => {
    setDate(newVal);
  };

  useEffect(() => {
    slotListData();
  }, []);

  console.log(date);

  return (
    <>
      <div className={classes.rightBox}>
        <Box className={classes.outerbox1}>
          <Paper className={classes.paper1} elevation={1}>
            <Box m={3}>
              <Grid item xs={12}>
                <Grid container justifyContent="center" spacing={2}>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DateTimePicker
                      label="Date&Time picker"
                      value={value}
                      onChange={handelDate}
                      renderInput={(params) => <TextField {...params} />}
                    />
                  </LocalizationProvider>
                </Grid>
                <div className={classes.card}>
                  <Typography
                    className={classes.textField}
                    gutterBottom
                    variant="h5"
                    component="h1">
                    Doctor Information
                  </Typography>
                  <CardMedia
                    className={{
                      paddingTop: "56.25%",
                    }}
                    component="img"
                    src={doctorImage}></CardMedia>
                  <CardContent>
                    <Typography
                      className={classes.textField}
                      gutterBottom
                      variant="h5"
                      component="h2">
                      Room Name:{docInfo.room_name}
                    </Typography>
                    <Typography className={classes.textField}>
                      Doctor Name: {docInfo.doctor_name}
                    </Typography>
                    <Typography className={classes.textField}>
                      Vote Ratio: {docInfo.get_vote_ratio}/5
                    </Typography>

                    {docInfo.description ? (
                      <Typography className={classes.textField}>
                        {" "}
                        {docInfo.description}{" "}
                      </Typography>
                    ) : (
                      ""
                    )}

                    {skills.length > 0 ? (
                      <Typography className={classes.textField}>
                        {skills.map((skill, index) => {
                          return (
                            <Typography
                              className={classes.textFieldInline}
                              key={index}>
                              {skill}
                            </Typography>
                          );
                        })}{" "}
                      </Typography>
                    ) : (
                      ""
                    )}

                    {intrests.length > 0 ? (
                      <Typography className={classes.textField}>
                        {intrests.map((intrest, index) => {
                          return (
                            <Typography
                              className={classes.textFieldInline}
                              key={index}>
                              {intrest}
                            </Typography>
                          );
                        })}{" "}
                      </Typography>
                    ) : (
                      ""
                    )}
                  </CardContent>
                </div>
              </Grid>
            </Box>
          </Paper>
        </Box>

        {value.length > 0 ? (
          <Box className={classes.outerbox}>
            <Paper className={classes.paper} elevation={3}>
              <Box m={3}>
                <Grid item xs={12}>
                  <Grid container justifyContent="center" spacing={2}>
                    {value.map((slots, index) => (
                      <Grid key={index} item>
                        <ButtonGroup
                          variant="contained"
                          aria-label="outlined primary button group">
                          <Button>
                            {slots.start_timing} - {slots.end_timing}
                          </Button>
                        </ButtonGroup>
                      </Grid>
                    ))}
                  </Grid>
                </Grid>
              </Box>
            </Paper>
          </Box>
        ) : (
          <Box className={classes.outerbox}>
            <Paper className={classes.paper} elevation={3}>
              <Box m={3}>
                <Grid item xs={12}>
                  <Grid container justifyContent="center" spacing={2}>
                    No Appointment
                  </Grid>
                </Grid>
              </Box>
            </Paper>
          </Box>
        )}
      </div>
    </>
  );
};

export default SlotList;

// <Grid item sm>
// <ButtonGroup size="large" color="primary">
//   {value.map((slots, index) => (
//     <Card key={slots.id}>
//       <CardContent>
//         <Link to={`/room/${slots.id}`}>
//           <Typography>
//             <strong>{slots.id}</strong>
//           </Typography>
//         </Link>
//       </CardContent>

//       <Typography>{slots.start_timing}</Typography>
//       <Typography>{slots.end_timing}</Typography>
//     </Card>
//   ))}
// </ButtonGroup>
// </Grid>
