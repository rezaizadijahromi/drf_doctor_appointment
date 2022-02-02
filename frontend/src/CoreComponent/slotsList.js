import axios from "axios";
import React, { useState, useEffect, useCallback } from "react";
// import { makeStyles } from "@material-ui/core/styles";
import { apiConfig } from "../config";
import { useNavigate, useParams, use } from "react-router";
import SlotListComponent from "./slotListComponent";

function sleep(time) {
	return new Promise((resolve) => setTimeout(resolve, time));
}

const SlotList = ({ match }) => {
	let newTime = new Date();

	var todayDate = `${newTime.getFullYear()}-${
		newTime.getMonth() + 1
	}-${newTime.getDate()}`;

	// console.log(todayDate);

	// 2022-1-6T12:57:32
	// '2014-08-18T21:11:54'

	const [date, setDate] = useState(todayDate);
	const [value, setValue] = useState([
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

	const [currentUser, setCurrentUser] = useState("");

	const [docInfo, setDocInfo] = useState({
		room_name: "",
		doctor_name: "",
		description: "",
		get_vote_ratio: 0,
		free_slots: 0,
		accept_slots: 0,
		pending_slots: 0,
	});

	const [freeSlots, setFreeSlots] = useState(0);
	const [pendingSlots, setPendingSlots] = useState(0);
	const [bookedSlots, setBookedSlots] = useState(0);

	const [doctorImage, setDoctorImage] = useState("");
	const [skills, setSkills] = useState([]);
	const [intrests, setIntrests] = useState([]);
	const [error, setError] = useState(false);
	const [message, setMessage] = useState("");
	const [messageVarient, setMessageVarient] = useState("info");
	const [loadSlotList, setLoadSlotList] = useState(false);
	const [getPost, setGetPost] = useState(false);
	let navigate = useNavigate();

	let { id } = useParams();

	const userLocal = JSON.parse(localStorage.getItem("userInfo"));
	const statusUser = userLocal.data.is_superuser;

	const slotListData = useCallback(async () => {
		const userLocal = JSON.parse(localStorage.getItem("userInfo"));

		setCurrentUser(userLocal.data.profile.name);

		if (userLocal) {
			const config = {
				headers: {
					Authorization: `Bearer ${userLocal.data.access}`,
				},
			};

			setDate(todayDate);

			if (getPost) {
				const response = await axios.post(
					`${apiConfig.baseUrl}/booking/room/${id}/`,
					{ date: date },
					config
				);
				console.log(response.data);
				if (response.data.status === "success") {
					if (response.data.data.length > 0) {
						setValue(response.data.data);
						setDate(response.data.date);
						setDocInfo(response.data.doctor_information);
						setSkills(response.data.skills);
						setIntrests(response.data.intrests);
						setDoctorImage(response.data.doctor_pic);
						setFreeSlots(response.data.free_slots);
						setPendingSlots(response.data.pending_slots);
						setBookedSlots(response.data.accept_slots);
						setMessage(response.data.message);
						setMessageVarient("success");
					} else {
						setValue(response.data.data);
						setDate(response.data.date);
						setDocInfo(response.data.doctor_information);
						setSkills(response.data.skills);
						setIntrests(response.data.intrests);
						setDoctorImage(response.data.doctor_pic);
						setFreeSlots(response.data.free_slots);
						setPendingSlots(response.data.pending_slots);
						setBookedSlots(response.data.accept_slots);
						setMessage(response.data.message);
						setMessageVarient("info");
					}
				} else if (response.data.status === "error") {
					setMessage(response.data.message);
					setMessageVarient("error");
					setError(true);
				}
			} else {
				const response = await axios.get(
					`${apiConfig.baseUrl}/booking/room/${id}/`,
					config
				);

				setLoadSlotList(true);
				await sleep(1000);

				if (response) {
					if (response.data.status === "success") {
						if (response.data.data.length > 0) {
							setValue(response.data.data);
							setDate(response.data.date);
							setDocInfo(response.data.doctor_information);
							setSkills(response.data.skills);
							setIntrests(response.data.intrests);
							setDoctorImage(response.data.doctor_pic);
							setFreeSlots(response.data.free_slots);
							setPendingSlots(response.data.pending_slots);
							setBookedSlots(response.data.accept_slots);
							setGetPost(true);
							setLoadSlotList(false);
							setMessage(response.data.message);
							setMessageVarient("success");
						} else {
							setValue(response.data.data);
							setDate(response.data.date);
							setDocInfo(response.data.doctor_information);
							setSkills(response.data.skills);
							setIntrests(response.data.intrests);
							setDoctorImage(response.data.doctor_pic);
							setFreeSlots(response.data.free_slots);
							setPendingSlots(response.data.pending_slots);
							setBookedSlots(response.data.accept_slots);
							setGetPost(true);
							setLoadSlotList(false);
							setMessage(response.data.message);
							setMessageVarient("info");
						}
					} else if (response.data.status === "error") {
						setMessage(response.data.message);
						setMessageVarient("error");
						setError(true);
						setLoadSlotList(false);
					}
				}
			}
		}
	}, [date, id, todayDate, getPost]);

	const handleSlot = async (value) => {
		const userLocal = JSON.parse(localStorage.getItem("userInfo"));

		if (userLocal) {
			const config = {
				headers: {
					Authorization: `Bearer ${userLocal.data.access}`,
				},
			};
			const response = await axios.post(
				`${apiConfig.baseUrl}/booking/room/${id}/book/`,
				{ date: date, slot_id: value },
				config
			);

			setLoadSlotList(true);
			if (response.data.status === "success") {
				slotListData();
				await sleep(500);
				setLoadSlotList(false);
				setMessage(response.data.message);
				setMessageVarient("success");
			} else if (response.data.status === "error") {
				slotListData();
				await sleep(500);
				setLoadSlotList(false);
				setMessage(response.data.message);
				setMessageVarient("error");
			} else {
				setLoadSlotList(true);
				setMessageVarient("error");
			}

			// update the date for today
			// setDate(todayDate);
		}
	};

	const handleDeleteSlot = async (value) => {
		const userLocal = JSON.parse(localStorage.getItem("userInfo"));

		if (userLocal) {
			const response = await axios.delete(
				`${apiConfig.baseUrl}/booking/room/${id}/book/`,
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

			setLoadSlotList(true);
			await sleep(500);

			if (response) {
				slotListData();
				await sleep(500);
				setLoadSlotList(false);
				setMessage(response.data.message);
				setMessageVarient("info");
			} else {
				setLoadSlotList(true);
				setMessageVarient("error");
			}
		}
	};

	useEffect(() => {
		slotListData();
	}, []);

	const handelDate = (newVal) => {
		setDate(
			`${newVal.getFullYear()}-${newVal.getMonth() + 1}-${newVal.getDate()}`
		);
	};

	const handelManagment = (id) => {
		// window.location.
		navigate(`managment/`);
	};

	return (
		<>
			<SlotListComponent
				doctorImage={doctorImage}
				docInfo={docInfo}
				skills={skills}
				intrests={intrests}
				value={value}
				date={date}
				handelDate={handelDate}
				slotListData={slotListData}
				handleSlot={handleSlot}
				handleDeleteSlot={handleDeleteSlot}
				handelManagment={handelManagment}
				freeSlots={freeSlots}
				pendingSlots={pendingSlots}
				bookedSlots={bookedSlots}
				message={message}
				loadList={loadSlotList}
				messageVarient={messageVarient}
				currentUser={currentUser}
				statusUser={statusUser}
				idValue={id}
			/>
		</>
	);
};

export default SlotList;
