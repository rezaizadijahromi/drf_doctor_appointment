import axios from "axios";
import React, { useState, useEffect, useRef } from "react";
import { apiConfig } from "../config";
import {
	Button,
	Grid,
	Input,
	Link,
	TextField,
	Typography,
} from "@mui/material";
import { makeStyles } from "@mui/styles";

import Message from "../Component/Message";
import Loader from "../Component/Loader";
import "./profile.css";
import { CardMedia } from "@mui/material";
import { useParams } from "react-router";
import { useNavigate } from "react-router-dom";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import DesktopDatePicker from "@mui/lab/DesktopDatePicker";
import { Box } from "@mui/system";
import avatar from "./static/avatar.png";
import "./adminProfile.css";

function sleep(time) {
	return new Promise((resolve) => setTimeout(resolve, time));
}

const useStyles = makeStyles((theme) => ({
	submit: {
		marginTop: 10,
		right: "10%",
		marginBottom: theme.spacing(2),
		width: 200,
	},
	updateButton: {
		width: 200,
		marginRight: 30,
		textAlign: "center",
	},
	buttons: {
		width: 165,
		height: 45,
	},
	alignment: {
		textAlign: "center",
	},
	imagContainer: {
		height: 300,
		width: 350,
		border: "1px solid #808080",
	},
	link: {
		margin: theme.spacing(5),
		padding: theme.spacing(1, 1.5),
		textDecoration: "None",
	},
	addButton: {
		marginTop: 10,
		right: "15%",
		marginBottom: theme.spacing(2),
		width: 200,
	},
}));

const AddSlot = () => {
	const classes = useStyles();
	let navigate = useNavigate();
	let { idRoute } = useParams();
	const [message, setMessage] = useState("");
	const [messageVarient, setMessageVarient] = useState("");
	const [load, setLoad] = useState(false);
	const [slot, setSlot] = useState({
		id: "",
		room_name: "",
		descroption: "",
		doctor_name: "",
		image: avatar,
	});
	const [startHour, setStartHour] = useState(8);
	const [endHour, setEndHour] = useState(21);
	const [minute, setMinute] = useState(20);
	const [count, setCount] = useState(20);

	// Date component
	let newTime = new Date();

	var todayDate = `${newTime.getFullYear()}-${
		newTime.getMonth() + 1
	}-${newTime.getDate()}`;

	const handelDate = (newVal) => {
		setDate(
			`${newVal.getFullYear()}-${newVal.getMonth() + 1}-${newVal.getDate()}`
		);
	};

	const [date, setDate] = useState(todayDate);

	const roomData = async () => {
		const userLocal = JSON.parse(localStorage.getItem("userInfo"));

		if (userLocal) {
			const config = {
				headers: {
					Authorization: `Bearer ${userLocal.data.access}`,
				},
			};

			const response = await axios.get(
				`${apiConfig.baseUrl}/booking/admin/${idRoute}/`,
				config
			);

			setLoad(true);
			await sleep(1000);

			if (response.data.status === "success") {
				setSlot(response.data.data);
				setLoad(false);
				setMessage(response.data.message);
				setMessageVarient("success");
			} else {
				setLoad(false);
				setMessage(response.data.message);
				setMessageVarient("error");
			}
		}
	};

	const PostSlot = async () => {
		console.log("post data");
		const userLocal = JSON.parse(localStorage.getItem("userInfo"));

		if (userLocal) {
			const config = {
				headers: {
					Authorization: `Bearer ${userLocal.data.access}`,
				},
			};

			const payload = {
				date: date,
				startH: startHour,
				endH: endHour,
				minute: minute,
				count: count,
			};

			const response = await axios.post(
				`${apiConfig.baseUrl}/booking/admin/${idRoute}/`,
				payload,
				config
			);
			console.log(response);
			setLoad(true);
			await sleep(500);

			if (response.data.status === "success") {
				setLoad(false);
				setMessage(response.data.message);
				setMessageVarient("success");
				navigate(`/room/${idRoute}`);
			} else {
				setLoad(false);
				setMessage(response.data.message);
				setMessageVarient("success");
			}
		}
	};

	useEffect(() => roomData(), []);

	return (
		<>
			{message && <Message variant={messageVarient}>{message}</Message>}

			{load ? (
				<Loader />
			) : (
				<div>
					<div class="top-title">Admin Page RIJ</div>
					<div class="new-product">
						<div class="top-txt">Add New Item</div>
						<div class="half-div">
							<div class="add-product">
								<div class="info">id:</div>
								<div>
									<Typography>{slot.id}</Typography>
								</div>
								<div class="info">Room Name:</div>
								<div>
									<Typography>{slot.room_name}</Typography>
								</div>
								<div class="info">Doctor Name:</div>
								<div>
									<Typography>{slot.doctor_name}</Typography>
								</div>
								<div class="info">Description:</div>
								<div>
									<Typography>{slot.description}</Typography>
								</div>
							</div>
							<div className="forimg">
								<CardMedia
									component="img"
									src={slot.image}
									style={{ objectFit: "contain", height: 350, width: 350 }}
								></CardMedia>
							</div>
						</div>
					</div>
					<div class="on-store">
						<div class="top-txt">Rooms</div>

						<Box
							component="form"
							sx={{
								"& > :not(style)": { m: 1, width: "25ch" },
							}}
							noValidate
							autoComplete="off"
						>
							<TextField
								id="outlined-number"
								label="Start Hour"
								type="number"
								InputLabelProps={{
									shrink: true,
								}}
								onChange={(e) => setStartHour(e.target.value)}
							/>

							<TextField
								id="outlined-number"
								label="End Hour"
								type="number"
								InputLabelProps={{
									shrink: true,
								}}
								onChange={(e) => setEndHour(e.target.value)}
							/>

							<TextField
								id="outlined-number"
								label="Minute"
								type="number"
								InputLabelProps={{
									shrink: true,
								}}
								onChange={(e) => setMinute(e.target.value)}
							/>

							<TextField
								id="outlined-number"
								label="Count"
								type="number"
								InputLabelProps={{
									shrink: true,
								}}
								onChange={(e) => setCount(e.target.value)}
							/>

							<LocalizationProvider dateAdapter={AdapterDateFns}>
								<DesktopDatePicker
									label="Date&Time picker"
									value={date}
									onChange={handelDate}
									renderInput={(params) => <TextField {...params} />}
								/>
							</LocalizationProvider>
						</Box>

						<Button
							color="primary"
							variant="contained"
							onClick={PostSlot}
							style={{
								marginRight: "50%",
								marginTop: "10px",
								marginBottom: "10px",
							}}
						>
							Add
						</Button>
					</div>
				</div>
			)}
		</>
	);
};

export default AddSlot;