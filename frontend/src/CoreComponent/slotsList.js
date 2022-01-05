import axios from "axios";
import { Link } from "react-router-dom";
import React, { useState, useEffect } from "react";
// import { makeStyles } from "@material-ui/core/styles";
import { makeStyles, useTheme } from "@mui/styles";
import { apiConfig } from "../config";
import { Box, ButtonGroup, Grid, Paper, Button } from "@mui/material";
// import AdapterDateFns from "@mui/lab/AdapterDateFns";
// import LocalizationProvider from "@mui/lab/LocalizationProvider";
// import DateTimePicker from "@mui/lab/DateTimePicker";

import { useParams } from "react-router-dom";

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
    width: 300,
  },
  submit: {
    margin: "auto",
    marginBottom: theme.spacing(2),
  },
  appBar: {
    borderBottom: `1px solid ${theme.palette.divider}`,
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
  outerbox: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    justifyContent: "flex-end",
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  url_input: {
    "& > *": {
      margin: theme.spacing(1),
      width: "25ch",
    },
  },
  url_prefix: {
    color: "#a8b1c7",
  },
  divider: {
    height: 28,
    margin: 4,
  },
}));

const SlotList = ({ match }) => {
  const classes = useStyles();

  const [date, setDate] = useState("");
  const [value, setValue] = useState([
    {
      id: "",
      booking_date: "",
      start_timing: "",
      end_timing: "",
      patient: "",
    },
  ]);

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
      setValue(data.data.data);
    }
  };

  const handelDate = (e) => {
    setDate({
      date: e.target.value,
    });
  };
  useEffect(() => {
    slotListData();
  }, []);

  return (
    <Box className={classes.outerbox}>
      <Paper className={classes.paper} elevation={3}>
        <Box m={3}>
          <Grid item xs={12}>
            <Grid container justifyContent="center" spacing={2}>
              {value.map((slots, index) => (
                <Grid key={value} item>
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
