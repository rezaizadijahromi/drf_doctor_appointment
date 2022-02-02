import axios from "axios";
import React, { useState, useEffect } from "react";
import { apiConfig } from "../config";
import { useParams } from "react-router";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

import Message from "../Component/Message";
import Loader from "../Component/Loader";
import { Button } from "@mui/material";

import { makeStyles } from "@mui/styles";

function sleep(time) {
	return new Promise((resolve) => setTimeout(resolve, time));
}

const useStyles = makeStyles((theme) => ({
	table: {
		marginTop: 50,
	},
	rowColor: { color: "#d3d3d3", backgroundColor: "#d3d3d3" },
	rowColor2: { color: "#a9a9a9", backgroundColor: "#a9a9a9" },
}));

const SlotManagment = ({ match }) => {
	let { idRoute } = useParams();
	const classes = useStyles();
	const [message, setMessage] = useState("");
	const [messageVarient, setMessageVarient] = useState("info");
	const [load, setLoad] = useState(false);

	const [timeSlots, setTimeSlots] = useState([
		{
			id: "",
			booking_date: "",
			start_timing: "",
			end_timing: "",
			patient: "",
			patient_name: "",
			is_pending: false,
			admin_did_accept: false,
		},
	]);
	const [adminAccept, setAdminAccept] = useState(false);
	const [pending, setPending] = useState(true);

	const slotsList = async () => {
		const userLocal = JSON.parse(localStorage.getItem("userInfo"));

		if (userLocal) {
			const config = {
				headers: {
					Authorization: `Bearer ${userLocal.data.access}`,
				},
			};

			const response = await axios.get(
				`${apiConfig.baseUrl}/booking/admin/${idRoute}/managment/`,
				config
			);

			console.log(response.data);

			setLoad(true);
			await sleep(500);

			if (response.data.status === "success") {
				setMessage(response.data.message);
				setMessageVarient("error");
				setLoad(false);
				setTimeSlots(response.data.data);
			} else {
				setMessage(response.data.message);
				setMessageVarient("error");
				setLoad(false);
			}
		}
	};

	const handelFilterSlotList = async () => {
		const userLocal = JSON.parse(localStorage.getItem("userInfo"));
		if (userLocal) {
			const config = {
				headers: {
					Authorization: `Bearer ${userLocal.data.access}`,
				},
			};
			const payload = {
				is_pending: pending,
				admin_did_accept: adminAccept,
			};
			const response = await axios.post(
				`${apiConfig.baseUrl}/booking/admin/${idRoute}/managment/`,
				payload,
				config
			);
		}
	};

	useEffect(() => {
		slotsList();
	}, []);

	return (
		<>
			{message && <Message variant={messageVarient}>{message}</Message>}

			{load ? (
				<Loader />
			) : (
				<TableContainer component={Paper} className={classes.table}>
					<Table
						sx={{ minWidth: 650, height: "100%" }}
						aria-label="simple table"
					>
						<TableHead>
							<TableRow>
								<TableCell className={classes.rowColor}>ID</TableCell>
								<TableCell className={classes.rowColor2} align="center">
									Date
								</TableCell>
								<TableCell className={classes.rowColor} align="center">
									START
								</TableCell>
								<TableCell className={classes.rowColor2} align="center">
									END
								</TableCell>
								<TableCell className={classes.rowColor} align="center">
									PATIENT ID
								</TableCell>
								<TableCell className={classes.rowColor2} align="center">
									PATIENT NAME
								</TableCell>
								<TableCell className={classes.rowColor} align="center">
									IS PENDING
								</TableCell>
								<TableCell className={classes.rowColor2} align="center">
									ADMIN ACCEPT
								</TableCell>
								<TableCell
									className={classes.rowColor}
									align="center"
								></TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{timeSlots.map((slot) => (
								<TableRow
									className={classes.rowColor2}
									key={slot.id}
									sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
								>
									<TableCell
										className={classes.rowColor}
										component="th"
										scope="row"
									>
										{slot.id}
									</TableCell>
									<TableCell className={classes.rowColor2} align="center">
										{slot.booking_date}
									</TableCell>
									<TableCell className={classes.rowColor} align="center">
										{slot.start_timing}
									</TableCell>
									<TableCell className={classes.rowColor2} align="center">
										{slot.end_timing}
									</TableCell>
									<TableCell className={classes.rowColor} align="center">
										{slot.patient}
									</TableCell>
									<TableCell className={classes.rowColor2} align="center">
										{slot.patient_name}
									</TableCell>
									<TableCell className={classes.rowColor} align="center">
										{slot.is_pending}
									</TableCell>
									<TableCell className={classes.rowColor2} align="center">
										{slot.admin_did_accept}
									</TableCell>
									{/* <TableCell className={classes.rowColor} align="center">
									<Button
										color="error"
										variant="contained"
										onClick={() => handelFilterSlotList()}
									>
										DELETE
									</Button>
								</TableCell> */}
								</TableRow>
							))}
						</TableBody>
					</Table>
				</TableContainer>
			)}
		</>
	);
};

export default SlotManagment;
