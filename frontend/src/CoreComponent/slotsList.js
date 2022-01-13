import axios from "axios";
import React, { useState, useEffect, useCallback } from "react";
// import { makeStyles } from "@material-ui/core/styles";
import { apiConfig } from "../config";
import { useParams } from "react-router";
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
      is_pending: false,
      admin_did_accept: false,
    },
  ]);

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
  const [loadSlotList, setLoadSlotList] = useState(false);
  const [loadDeleteSlot, setLoadDeleteSlot] = useState(false);
  const [loadBookSlot, setLoadBookSlot] = useState(false);
  const [getPost, setGetPost] = useState(false);

  let { id } = useParams();

  const slotListData = useCallback(async () => {
    const userLocal = JSON.parse(localStorage.getItem("userInfo"));

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
          config,
        );

        console.log(response.data);

        if (response.data.status === "success") {
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
        } else if (response.data.status === "fail") {
          setMessage(response.data.message);
          setError(true);
        }
        console.log(response.data);
        console.log(error);
      } else {
        const response = await axios.get(
          `${apiConfig.baseUrl}/booking/room/${id}/`,
          config,
        );
        setLoadSlotList(true);

        await sleep(1000);

        if (response) {
          if (response.data.status === "success") {
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
          } else if (response.data.status === "fail") {
            setMessage(response.data.message);
            setError(true);
            setLoadSlotList(false);
          }
        }
      }
    }
  }, [date, id, todayDate, error, getPost]);

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
        config,
      );
      setLoadBookSlot(true);
      if (response) {
        setMessage(response.data.message);
        console.log("book a slot", response.data);
      } else {
        setLoadBookSlot(true);
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
        },
      );
      // dont need
      setLoadDeleteSlot(true);
      if (response) {
        console.log("delete", response.data);
        setMessage(response.data.message);
      } else {
        setLoadDeleteSlot(true);
      }
    }
  };

  useEffect(() => {
    slotListData();
  }, []);

  const handelDate = (newVal) => {
    setDate(
      `${newVal.getFullYear()}-${newVal.getMonth() + 1}-${newVal.getDate()}`,
    );
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
        freeSlots={freeSlots}
        pendingSlots={pendingSlots}
        bookedSlots={bookedSlots}
        message={message}
        loadList={loadSlotList}
        loadDelte={loadDeleteSlot}
        loadBook={loadBookSlot}
      />
    </>
  );
};

export default SlotList;
