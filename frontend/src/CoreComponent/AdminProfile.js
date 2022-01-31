import axios from "axios";
import React, { useState, useEffect, useRef } from "react";
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
import avatar from "./static/avatar.png";

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
	const [description, setDescription] = useState("");
	let [image, setImage] = useState(avatar);
	const [result, setResult] = useState(avatar);

	const roomList = async () => {
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

			setLoad(true);
			await sleep(1000);

			setLoad(false);
			setRoom(response.data);
		}
	};

	const addRoom = async (e) => {
		const userLocal = JSON.parse(localStorage.getItem("userInfo"));
		if (userLocal) {
			const config = {
				headers: {
					Authorization: `Bearer ${userLocal.data.access}`,
				},
			};
			e.preventDefault();
			let formData = new FormData();
			formData.append("room_name", roomName);
			formData.append("doctor_name", doctorName);
			formData.append("description", description);
			formData.append("image", image);

			const response = await axios.post(
				`${apiConfig.baseUrl}/booking/room/`,
				formData,
				config
			);

			if (response.data.status === "success") {
				setMessage(response.data.message);
				setMessageVarient("success");
				roomList();

				setResult(avatar);
			} else {
				setMessage(response.data.message);
				setMessageVarient("error");
				setLoad(false);
			}
		}
	};

	const imageRef = useRef(null);
	function useDisplayImage() {
		function uploader(e) {
			const imageFile = e.target.files[0];

			const reader = new FileReader();
			reader.addEventListener("load", (e) => {
				setResult(e.target.result);
			});

			reader.readAsDataURL(imageFile);
		}

		return { result, uploader };
	}

	const { resulter, uploader } = useDisplayImage();

	const handelData = (value) => {
		console.log(value);
		setSlot(value);
	};

	useEffect(() => {
		roomList();
	}, []);

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
								{image !== "null" ? (
									<CardMedia
										component="img"
										ref={imageRef}
										src={result}
										style={{ objectFit: "contain", height: 350, width: 350 }}
									></CardMedia>
								) : (
									<CardMedia
										component="img"
										style={{ objectFit: "contain", height: 350, width: 350 }}
										src={avatar}
									></CardMedia>
								)}

								<label htmlFor="contained-button-file">
									<Button
										style={{
											marginTop: 10,
											right: "20%",
											width: 200,
										}}
										component="span"
										variant="contained"
									>
										<Input
											accept="image/*"
											id="contained-button-file"
											multiple
											type="file"
											hidden
											style={{ display: "none" }}
											onChange={(e) => {
												setImage(e.target.files[0]);
												uploader(e);
											}}
										/>
										upload
									</Button>
								</label>
							</div>
						</div>
						<Button
							color="primary"
							variant="contained"
							onClick={addRoom}
							className={classes.addButton}
						>
							Add
						</Button>
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
				</div>
			)}
		</>
	);
};

export default AdminProfile;
