import {
  Box,
  ButtonGroup,
  Grid,
  Paper,
  Button,
  TextField,
  Typography,
  CardMedia,
  Card,
  CardContent,
} from "@mui/material";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import DesktopDatePicker from "@mui/lab/DesktopDatePicker";

import { makeStyles } from "@mui/styles";
import Message from "../Component/Message";
import Loader from "../Component/Loader";

const useStyles = makeStyles((theme) => ({
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 300,
    marginTop: 10,
    paddingTop: 5,
  },
  textFieldInline: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 100,
    paddingLeft: theme.spacing(1),
    display: "inline-block",
    border: `1px solid ${theme.palette.divider}`,
    backgroundColor: "darkgray",
    marginTop: 10,
    marginBottom: 5,
  },
  submit: {
    left: "35%",
    marginLeft: 30,
    marginBottom: theme.spacing(2),
    width: 200,
  },

  link: {
    margin: theme.spacing(1, 1.5),
  },
  toolbarTitle: {
    flexGrow: 1,
  },
  paper: {
    margin: theme.spacing(2),
    width: theme.spacing(50),
    height: theme.spacing(55),
  },
  paper1: {
    margin: theme.spacing(2),
    width: theme.spacing(115),
    height: theme.spacing(55),
  },
  outerbox: {
    height: "100%",
    display: "inline-block",
    flexDirection: "column",
    // marginLeft: 250,
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
    gridTemplateColumns: "repeat(3, 1fr)",
  },
  card: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    // maxWidth: 600,
    margin: "auto",
    textAlign: "center",
    marginTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
  },

  leftContentContainer: {
    gridColumn: 1,
    marginTop: 5,
  },
  centerContentContainer: {
    height: "100%",
    width: "100%",
    gridColumn: 2,
    marginLeft: 10,
    paddingLeft: theme.spacing(2),
    // border: "1px solid #000",
  },
  imgContainer: {
    height: 170,
    width: 250,
  },
  DateContainer: {
    marginTop: 50,
  },
  buttons: {
    width: 165,
    height: 45,
  },
  buttonGroup: {
    overflowY: "scroll",
    height: 430,
  },
  "@global": {
    "*::-webkit-scrollbar": {
      width: "0.4em",
    },
    "*::-webkit-scrollbar-track": {
      "-webkit-box-shadow": "inset 0 0 6px rgba(0,0,0,0.00)",
    },
    "*::-webkit-scrollbar-thumb": {
      backgroundColor: "rgba(0,0,0,.1)",
      outline: "1px solid slategrey",
    },
  },
}));

const SlotListComponent = ({
  doctorImage,
  docInfo,
  skills,
  intrests,
  value,
  date,
  handelDate,
  slotListData,
  handleSlot,
  handleDeleteSlot,
  freeSlots,
  pendingSlots,
  bookedSlots,
  message,
  messageVarient,
  loadList,
}) => {
  const classes = useStyles();
  return (
    <>
      {message && <Message variant={messageVarient}>{message}</Message>}

      {loadList ? (
        <Loader />
      ) : (
        <div className={classes.rightBox}>
          <Box className={classes.outerbox1}>
            <Paper className={classes.paper1} elevation={3}>
              <Box m={3}>
                <Grid item xs={12}>
                  <Grid container justifyContent="center" spacing={2}>
                    <div className={classes.card}>
                      <div className={classes.imgContainer}>
                        <CardMedia
                          className={classes.ImageDoc}
                          component="img"
                          src={doctorImage}></CardMedia>
                      </div>

                      <div className={classes.centerContentContainer}>
                        <Typography className={classes.textField} gutterBottom>
                          Room Name: {docInfo.room_name}
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
                      </div>

                      <div className={classes.rightContentContainer}>
                        <Grid>
                          <Typography>
                            Free slots: {freeSlots > 0 ? freeSlots : 0}
                          </Typography>
                          <Typography>
                            Booked slots: {bookedSlots > 0 ? bookedSlots : 0}
                          </Typography>
                          <Typography>
                            Pending slots: {pendingSlots > 0 ? pendingSlots : 0}
                          </Typography>
                        </Grid>
                      </div>
                    </div>
                  </Grid>
                </Grid>

                <div className={classes.DateContainer}>
                  <Grid container justifyContent="center" spacing={2}>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <DesktopDatePicker
                        label="Date&Time picker"
                        value={date}
                        onChange={handelDate}
                        renderInput={(params) => <TextField {...params} />}
                      />
                    </LocalizationProvider>
                  </Grid>
                </div>
              </Box>
              <Button
                color="primary"
                variant="contained"
                onClick={slotListData}
                className={classes.submit}>
                get
              </Button>
            </Paper>
          </Box>

          {value.length > 0 ? (
            <Box className={classes.outerbox}>
              <Paper className={classes.paper} elevation={3}>
                <Box m={3}>
                  <Grid item xs={12}>
                    <Grid
                      container
                      justifyContent="center"
                      spacing={2}
                      className={classes.buttonGroup}>
                      {value.map((slots, index) => (
                        <Grid key={index} item>
                          <ButtonGroup
                            variant="contained"
                            aria-label="outlined primary button group">
                            {slots.is_pending === false &&
                            slots.admin_did_accept === false ? (
                              <Button
                                className={classes.buttons}
                                onClick={() => handleSlot(slots.id)}
                                onSubmit={handleSlot}>
                                {slots.start_timing} - {slots.end_timing}
                              </Button>
                            ) : (
                              <Button
                                className={classes.buttons}
                                onClick={() => handleDeleteSlot(slots.id)}
                                onSubmit={handleDeleteSlot}>
                                not availabel
                              </Button>
                            )}
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
      )}
    </>
  );
};

export default SlotListComponent;
