import axios from "axios";
import React, { useState, useEffect } from "react";
import { apiConfig } from "../config";
import { Form } from "react-bootstrap";
import { Button, Input, Link } from "@mui/material";
import { makeStyles } from "@mui/styles";

import Message from "../Component/Message";
import Loader from "../Component/Loader";
import "./profile.css";
import { CardMedia } from "@mui/material";
import { height, style } from "@mui/system";

import "./adminProfile.css";
import { NavLink } from "react-router-dom";

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

const AdminProfile = () => {
	const classes = useStyles();
	const [message, setMessage] = useState("");
	const [messageVarient, setMessageVarient] = useState("");
	const [load, setLoad] = useState(false);
	const [room, setRoom] = useState([
		{
			id: "",
			room_name: "",
			descroption: "",
			doctor: "",
			image: "",
		},
	]);

	const [slot, setSlot] = useState({
		id: "",
		room_name: "",
		descroption: "",
		doctor: "",
		image: "",
	});

	const [roomName, setRoomName] = useState("");
	const [doctorName, setDoctorName] = useState("");
	const [voteRatio, setVoteRatio] = useState(0);
	const [description, setDescription] = useState("");
	const [image, setImage] = useState("");

	const roomList = async () => {
		console.log("Room List");
		const userLocal = JSON.parse(localStorage.getItem("userInfo"));
		if (userLocal) {
			const config = {
				headers: {
					Authorization: `Bearer ${userLocal.data.access}`,
				},
			};

			const response = await axios.get(
				`${apiConfig.baseUrl}/booking/room/`,
				config
			);

			console.log(response.data);

			setRoom(response.data);
		}
	};

	const addRoom = async () => {
		console.log("Add room");
		const userLocal = JSON.parse(localStorage.getItem("userInfo"));
		if (userLocal) {
			const config = {
				headers: {
					Authorization: `Bearer ${userLocal.data.access}`,
				},
			};

			const payload = {
				room_name: roomName,
				description: description,
			};

			const response = await axios.post(
				`${apiConfig.baseUrl}/booking/room/`,
				payload,
				config
			);

			setLoad(true);
			await sleep(500);
			if (response.status === "success") {
				// roomList();
				setMessage(response.data.message);
				setMessageVarient("success");
				setLoad(false);
			} else {
				setMessage(response.data.message);
				setMessageVarient("success");
				setLoad(false);
			}
		}
	};

	const profilePicChange = async (e) => {
		console.log("Profile picture");

		const userLocal = JSON.parse(localStorage.getItem("userInfo"));

		const file = e.target.files[0];
		const formData = new FormData();
		formData.append("profile_pic", file);
		try {
			const config = {
				headers: {
					Authorization: `Bearer ${userLocal.data.access}`,
					"Content-Type": "multipart/form-data",
				},
			};

			const response = await axios.patch(
				`${apiConfig.baseUrl}/users/profile_update/photo/`,
				formData,
				config
			);

			if (response.data) {
				setImage(response.data.profile_pic);
				setLoad(false);
				setMessage(response.data.message);
				setMessageVarient("success");
			} else {
				setLoad(false);
				setMessage(response.data.message);
				setMessageVarient("error");
			}
		} catch (error) {
			console.log(error);
		}
	};
	const handelData = (value) => {
		console.log(value);
		setSlot(value);
	};

	useEffect(() => {
		roomList();
	}, []);

	return (
		<>
			{" "}
			<div class="top-title">Admin Page RIJ</div>
			<div class="new-product">
				<div class="top-txt">Add New Item</div>
				<div class="half-div">
					<div class="add-product">
						<div class="info">Room Name:</div>
						<div>
							<input
								type="text"
								class="in-text"
								onChange={(e) => setRoomName(e.target.value)}
							/>
						</div>
						<div class="info">Doctor Name:</div>
						<div>
							<input
								type="text"
								class="in-text"
								onChange={(e) => setDoctorName(e.target.value)}
							/>
						</div>
						<div class="info">Number of rooms:</div>
						<div>
							<input
								type="number"
								class="in-text"
								onChange={(e) => setVoteRatio(e.target.value)}
							/>
						</div>
						<div class="info">Description:</div>
						<div>
							<textarea
								class="multi"
								rows="10"
								cols="60"
								name="description"
								onChange={(e) => setDescription(e.target.value)}
							></textarea>
						</div>
					</div>
					<div className="forimg">
						<CardMedia
							style={{ objectFit: "contain", height: 350, width: 350 }}
							component="img"
							src={image}
						></CardMedia>

						<label htmlFor="contained-button-file">
							<Button
								style={{
									marginTop: 10,
									right: "20%",
									width: 200,
								}}
								component="span"
								variant="contained"
								onChange={() => profilePicChange}
							>
								<Input
									accept="image/*"
									id="contained-button-file"
									multiple
									type="file"
									hidden
									style={{ display: "none" }}
								/>
								upload
							</Button>
						</label>
					</div>
				</div>
				<div>
					<Button
						color="primary"
						variant="contained"
						onSubmit={() => addRoom}
						className={classes.addButton}
					>
						Add
					</Button>
				</div>
			</div>
			<div class="on-store">
				<div class="top-txt">Rooms</div>
				{room.map((r, index) => (
					<div class="card" onClick={() => handelData(r)}>
						<img src={r.image} alt="doctor" />
						<hr />
						<section>
							<h2>Room Code: {r.id.substring(1, 10)}</h2>
						</section>

						<section>
							<span>Room Name: {r.room_name}</span>
						</section>

						<section>
							<span>Doctor Name: {r.doctor_name}</span>
						</section>

						<section>
							<nav>
								<Link
									color="textPrimary"
									href="#"
									className={classes.link}
									component={NavLink}
									to={`room/${r.id}/`}
								>
									Go To Room
								</Link>
							</nav>
						</section>
					</div>
				))}
			</div>
		</>
	);
};

export default AdminProfile;
