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
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import DesktopDatePicker from "@mui/lab/DesktopDatePicker";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
// import TimePicker from "react-time-picker";

import Message from "../Component/Message";
import Loader from "../Component/Loader";
import {
	Button,
	ButtonGroup,
	FormControlLabel,
	FormGroup,
	Grid,
	Switch,
	TextField,
	Typography,
} from "@mui/material";

import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
// import Box from "@mui/material/Box";
import Checkbox from "@mui/material/Checkbox";
import NumberFormat from "react-number-format";
import PropTypes from "prop-types";

import { useTheme } from "@mui/material/styles";

import { makeStyles } from "@mui/styles";
import { Box } from "@mui/system";

function sleep(time) {
	return new Promise((resolve) => setTimeout(resolve, time));
}

const useStyles = makeStyles((theme) => ({
	table: {
		marginTop: 50,
	},
	rowColor: { color: "#d3d3d3", backgroundColor: "#d3d3d3" },
	rowColor2: { color: "#a9a9a9", backgroundColor: "#a9a9a9" },
	paper1: {
		margin: theme.spacing(2),
		height: theme.spacing(10),
	},
	filterName: {
		textAlign: "center",
	},
}));

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
	PaperProps: {
		style: {
			maxHeight: ITEM_HEIGHT * 3 + ITEM_PADDING_TOP,
			width: 50,
		},
	},
};

function getStyles(name, personName, theme) {
	return {
		fontWeight:
			personName.indexOf(name) === -1
				? theme.typography.fontWeightRegular
				: theme.typography.fontWeightMedium,
	};
}

const SlotManagment = ({ match }) => {
	const theme = useTheme();
	let newTime = new Date();

	var todayDate = `${newTime.getFullYear()}-${
		newTime.getMonth() + 1
	}-${newTime.getDate()}`;

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
	const [pending, setPending] = useState(false);
	const [date, setDate] = useState(todayDate);

	let [users, setUsers] = useState([
		{
			results: {
				username: "",
				id: "1",
			},
		},
	]);
	const [personName, setPersonName] = useState([]);
	const [checked, setChecked] = useState(false);
	var today = new Date(),
		time = today.getHours() + ":" + today.getMinutes();

	const handelEdit = (e) => {
		setChecked(e.target.checked);
	};

	const userList = async () => {
		const userLocal = JSON.parse(localStorage.getItem("userInfo"));

		if (userLocal && (userLocal.data.is_superuser || userLocal.data.is_staff)) {
			const config = {
				headers: {
					Authorization: `Bearer ${userLocal.data.access}`,
				},
			};

			const response = await axios.get(`${apiConfig.baseUrl}/users/`, config);

			setLoad(true);
			await sleep(500);

			if (response.data) {
				setUsers(response.data.results);
				setLoad(false);
			} else {
				setMessage(response.data.message);
				setMessageVarient("error");
			}
		}
	};

	const handelNameSet = (e) => {
		setPersonName(e.target.value);
	};

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
				booking_date: date,
			};

			const response = await axios.post(
				`${apiConfig.baseUrl}/booking/admin/${idRoute}/managment/`,
				payload,
				config
			);
			setLoad(true);
			await sleep(250);

			if (response.data.status === "success") {
				setLoad(false);
				setMessage(response.data.message);
				setMessageVarient("success");
				setTimeSlots(response.data.data);
			} else {
				setLoad(false);
				setTimeSlots(response.data.data);
				setMessage(response.data.message);
				setMessageVarient("error");
			}
		}
	};

	const handelRequest = async (action, id) => {
		const userLocal = JSON.parse(localStorage.getItem("userInfo"));
		if (userLocal) {
			const config = {
				headers: {
					Authorization: `Bearer ${userLocal.data.access}`,
				},
			};

			const payload = {
				date: date,
				action: action,
				slot_id: id,
			};

			const response = await axios.put(
				`${apiConfig.baseUrl}/booking/admin/${idRoute}/`,
				payload,
				config
			);

			if (response.data.status === "success") {
				slotsList();
				setMessage(response.data.message);
				setMessageVarient("success");
			} else {
				setMessage(response.data.message);
				setMessageVarient("error");
			}
		}
	};

	const handelDate = (newVal) => {
		setDate(
			`${newVal.getFullYear()}-${newVal.getMonth() + 1}-${newVal.getDate()}`
		);
	};

	const handleChangeAdmin = (e) => {
		setAdminAccept(e.target.checked);
		setPending(false);
	};

	const handleChangePending = (e) => {
		setPending(e.target.checked);
		setAdminAccept(false);
	};

	const updateSlot = async (slot_id) => {
		const userLocal = JSON.parse(localStorage.getItem("userInfo"));
		if (userLocal) {
			const config = {
				headers: {
					Authorization: `Bearer ${userLocal.data.access}`,
				},
			};
			let payload = {
				patient: personName,
				slot_id: slot_id,
				booking_date: date,
				start_timing: start,
				end_timing: end,
			};
			try {
				const response = await axios.post(
					`${apiConfig.baseUrl}/booking/admin/${idRoute}/assign/`,
					payload,
					config
				);

				console.log(response.data);

				if (response.data.status === "success") {
					slotsList();
					await sleep(100);
					setMessage(response.data.message);
					setMessageVarient("success");
				} else {
					setLoad(true);
					await sleep(500);
					setLoad(false);
					setMessage(response.data.message);
					setMessageVarient("error");
				}
			} catch (error) {
				setLoad(true);
				await sleep(500);
				setLoad(false);
				setMessage("Something went wrong");
				setMessageVarient("error");
			}
		}
	};

	const handleDeleteSlot = async (value) => {
		const userLocal = JSON.parse(localStorage.getItem("userInfo"));

		if (userLocal) {
			const response = await axios.delete(
				`${apiConfig.baseUrl}/booking/admin/${idRoute}/managment/`,
				{
					headers: {
						Authorization: `Bearer ${userLocal.data.access}`,
					},
					data: {
						slot_id: value,
						date: date,
					},
				}
			);

			if (response) {
				slotsList();
				setMessage(response.data.message);
				setMessageVarient("success");
			} else {
				setLoad(true);
				await sleep(500);
				setLoad(false);
				setMessage(response.data.message);
				setMessageVarient("error");
			}
		}
	};

	const [start, setStart] = useState();
	const [end, setEnd] = useState();

	const handelTime = (e) => {
		console.log(e.target.value);
		setStart(e.target.value);
	};

	const NumberFormatCustom = React.forwardRef(function NumberFormatCustom(
		props,
		ref
	) {
		const { onChange, ...other } = props;

		return (
			<NumberFormat
				format="##:##:##"
				placeholder="HH:MM:SS"
				mask={["H", "H", "M", "M", "S", "S"]}
				{...other}
				getInputRef={ref}
				onValueChange={(values) => {
					onChange({
						target: {
							name: props.name,
							value: values.value,
						},
					});
				}}
			/>
		);
	});

	NumberFormatCustom.propTypes = {
		name: PropTypes.string.isRequired,
		onChange: PropTypes.func.isRequired,
	};
	const handelChange = (e) => {
		setStart(e.target.value);
	};

	const handleChangeEnd = (e) => {
		setEnd(e.target.value);
	};

	useEffect(() => {
		slotsList();
		userList();
	}, []);

	return (
		<>
			{message && <Message variant={messageVarient}>{message}</Message>}

			{load ? (
				<Loader />
			) : (
				<>
					<Box sx={{ flexGrow: 1 }}>
						<h3 className={classes.filterName}>Filters</h3>

						<Paper className={classes.paper1} elevation={3}>
							<Grid
								item
								justifyContent
								xs={12}
								style={{ content: "center", marginTop: "0px" }}
							>
								<FormGroup
									style={{
										display: "inline-block",
										textAlign: "center",
										marginTop: "20px",
										marginLeft: "250px",
									}}
								>
									<Typography
										style={{
											display: "inline-block",
											marginRight: "10px",
											marginLeft: "5px",
											textAlign: "center",
										}}
									>
										Admin Accept:{" "}
									</Typography>
									<FormControlLabel
										control={
											<Switch
												checked={adminAccept}
												onChange={handleChangeAdmin}
												aria-label="Admin"
											/>
										}
										label={adminAccept ? "True" : "False"}
									/>
									<Typography
										style={{ display: "inline-block", marginRight: "10px" }}
									>
										Is Pending:{" "}
									</Typography>
									<FormControlLabel
										control={
											<Switch
												checked={pending}
												onChange={handleChangePending}
												aria-label="login switch"
											/>
										}
										label={pending ? "True" : "False"}
									/>

									<LocalizationProvider
										dateAdapter={AdapterDateFns}
										style={{ marginTop: "10px" }}
									>
										<DesktopDatePicker
											label="Date&Time picker"
											value={date}
											onChange={handelDate}
											renderInput={(params) => <TextField {...params} />}
										/>
									</LocalizationProvider>
								</FormGroup>
								<Button
									color="info"
									variant="contained"
									style={{ marginLeft: "20px", marginTop: "20px" }}
									onClick={handelFilterSlotList}
								>
									Filter
								</Button>
							</Grid>
						</Paper>
					</Box>

					<TableContainer component={Paper} className={classes.table}>
						<Table
							sx={{ minWidth: 650, height: "100%" }}
							aria-label="simple table"
						>
							<TableHead>
								<TableRow>
									<TableCell
										className={classes.rowColor}
										style={{ width: "5px", padding: "0px" }}
									>
										<FormControlLabel
											control={<Checkbox onChange={handelEdit} />}
											label="Edit"
											labelPlacement="top"
										/>
									</TableCell>
									<TableCell className={classes.rowColor2} align="center">
										ID
									</TableCell>
									<TableCell className={classes.rowColor} align="center">
										Date
									</TableCell>
									<TableCell className={classes.rowColor2} align="center">
										START
									</TableCell>
									<TableCell className={classes.rowColor} align="center">
										END
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
									<TableCell className={classes.rowColor} align="center">
										ACTION
									</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{timeSlots.length > 0 ? (
									timeSlots.map((slot) => (
										<TableRow
											className={classes.rowColor2}
											key={slot.id}
											sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
										>
											<TableCell
												className={classes.rowColor}
												component="th"
												scope="row"
												style={{ width: "5px", padding: "0px" }}
											>
												{checked ? (
													<Button
														style={{
															display: "block",
															width: "30px",
															height: "30px",
															color: "darkslategray",
														}}
														onClick={() => updateSlot(slot.id)}
													>
														Update
													</Button>
												) : (
													<div></div>
												)}
											</TableCell>
											<TableCell
												className={classes.rowColor2}
												component="th"
												scope="row"
												align="center"
											>
												{slot.id}
											</TableCell>
											<TableCell className={classes.rowColor} align="center">
												{slot.booking_date}
											</TableCell>
											<TableCell className={classes.rowColor2} align="center">
												{/* {checked ? (
													<TextField
														autoFocus
														label="HH-MM-SS"
														value={slot.start_timing}
														onChange={handelChange}
														name="numberformat"
														InputProps={{
															inputComponent: NumberFormatCustom,
														}}
														variant="standard"
													>
														{slot.start_timing}
													</TextField>
												) : (
													<div>{slot.start_timing}</div>
												)} */}
												<div>{slot.start_timing}</div>
											</TableCell>
											<TableCell className={classes.rowColor} align="center">
												{/* {checked ? (
													<TextField
														label="HH-MM-SS"
														value={slot.end_timing}
														onChange={handleChangeEnd}
														name="numberformat"
														InputProps={{
															inputComponent: NumberFormatCustom,
														}}
														variant="standard"
													/>
												) : (
													<div>{slot.end_timing}</div>
												)} */}
												<div>{slot.end_timing}</div>
											</TableCell>
											<TableCell className={classes.rowColor2} align="center">
												{checked ? (
													<div>
														{slot.patient_name ? (
															slot.patient_name
														) : (
															<div>
																<FormControl
																	sx={{
																		m: 1,
																		width: "150px",
																		height: "40px",
																		marginTop: "0px",
																	}}
																>
																	<InputLabel id="demo-multiple-name-label">
																		Name
																	</InputLabel>
																	<Select
																		onChange={handelNameSet}
																		input={<OutlinedInput label="Name" />}
																		MenuProps={MenuProps}
																	>
																		{users.map((name) => (
																			<MenuItem
																				key={slot.id}
																				value={name.username}
																				style={getStyles(
																					name,
																					personName,
																					theme
																				)}
																			>
																				{name.username}
																			</MenuItem>
																		))}
																	</Select>
																</FormControl>
															</div>
														)}
													</div>
												) : slot.patient_name ? (
													<div>{slot.patient_name}</div>
												) : (
													<div>Not assign</div>
												)}
											</TableCell>
											<TableCell className={classes.rowColor} align="center">
												{slot.is_pending ? "True" : "False"}
											</TableCell>
											<TableCell className={classes.rowColor2} align="center">
												{slot.admin_did_accept ? "True" : "False"}
											</TableCell>
											<TableCell
												className={classes.rowColor}
												style={{ width: "5%" }}
												align="center"
											>
												{slot.is_pending && !slot.admin_did_accept ? (
													<ButtonGroup>
														<Button
															color="success"
															variant="contained"
															style={{ width: "20px" }}
															onClick={() => handelRequest("ACCEPT", slot.id)}
														>
															<CheckIcon />
														</Button>

														<Button
															color="error"
															variant="contained"
															style={{ width: "20px" }}
															onClick={() => handelRequest("DELETE", slot.id)}
														>
															<CloseIcon />
														</Button>
													</ButtonGroup>
												) : slot.admin_did_accept ? (
													<Button
														color="error"
														variant="contained"
														style={{ width: "20px" }}
														onClick={() => handelRequest("CANCELL", slot.id)}
													>
														<CloseIcon />
													</Button>
												) : (
													<Button
														color="error"
														variant="contained"
														style={{ width: "20px" }}
														onClick={() => handleDeleteSlot(slot.id)}
													>
														<DeleteIcon />
													</Button>
												)}
											</TableCell>
										</TableRow>
									))
								) : (
									<div></div>
								)}
							</TableBody>
						</Table>
					</TableContainer>
				</>
			)}
		</>
	);
};

export default SlotManagment;
