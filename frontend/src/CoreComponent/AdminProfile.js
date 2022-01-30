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
}));

const AdminProfile = () => {
	const classes = useStyles();
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
			setRoom(response.data);
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
						<div class="info">Room Id:</div>
						<div>
							<input type="text" class="in-text" />
						</div>
						<div class="info">Room Name:</div>
						<div>
							<input type="text" class="in-text" />
						</div>
						<div class="info">Doctor Name:</div>
						<div>
							<input type="text" class="in-text" />
						</div>
						<div class="info">Number of rooms:</div>
						<div>
							<input type="number" class="in-text" />
						</div>
						<div class="info">Hotel image:</div>
						<div>
							<input type="file" class="in-text" />
						</div>
					</div>
					<div class="review-txt">
						<div class="info">naq va tozihat:</div>
						<div>
							<textarea
								class="multi"
								rows="10"
								cols="60"
								name="description"
							></textarea>
						</div>
					</div>
				</div>
				<div>
					<button
						class="
                     button
                      button btn-submit
                      btn btn-lg 
                      fw-bold
                      text-uppercase
                    "
						type="submit"
					>
						Add
					</button>
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
