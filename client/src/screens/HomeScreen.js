import React, { useState, useEffect } from "react";
import axios from "axios";
import Room from "../components/Room";
import Loader from "../components/Loader";
import Error from "../components/Error";
import { DatePicker } from "antd";
import moment from "moment";

const { RangePicker } = DatePicker;

function HomeScreen() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const [fromdate, setFromdate] = useState();
  const [todate, setTodate] = useState();
  const [duplicaterooms, setduplicaterooms] = useState([]);

  const [searchkey, setsearchkey] = useState("");
  const [type, settype] = useState("All");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get("/api/rooms/getallrooms");
        setRooms(response.data);
        setduplicaterooms(response.data);
        setLoading(false);
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  function filterByDate(dates, dateStrings) {
    if (dates) {
      const fromDate = moment(dateStrings[0], "DD-MM-YYYY");
      const toDate = moment(dateStrings[1], "DD-MM-YYYY");

      setFromdate(fromDate);
      setTodate(toDate);

      let temprooms = [];
      let availability = false;

      for (const room of duplicaterooms) {
        if (room.currBookings.length > 0) {
          availability = false;

          for (const booking of room.currBookings) {
            const bookingFromDate = moment(booking.fromdate, "DD-MM-YYYY");
            const bookingToDate = moment(booking.todate, "DD-MM-YYYY");

            if (
              !fromDate.isBetween(bookingFromDate, bookingToDate, null, "[]") &&
              !toDate.isBetween(bookingFromDate, bookingToDate, null, "[]")
            ) {
              if (
                !fromDate.isSame(bookingFromDate) &&
                !fromDate.isSame(bookingToDate) &&
                !toDate.isSame(bookingFromDate) &&
                !toDate.isSame(bookingToDate)
              ) {
                availability = true;
              }
            }
          }
        }
        if (availability === true || room.currBookings.length === 0) {
          temprooms.push(room);
        }
      }
      setRooms(temprooms);
    }
  }

  function filterBySearch() {
    const temprooms = duplicaterooms.filter(room =>
      room.name.toLowerCase().includes(searchkey.toLowerCase()) || 
      room.location.toLowerCase().includes(searchkey.toLowerCase())
    );
    setRooms(temprooms);
  }



  function filterByType(e) {

    settype(e);

    if(e !== "All") {
      const temprooms = duplicaterooms.filter(room => room.type.toLowerCase() === e.toLowerCase());
    setRooms(temprooms);
    } else {
      setRooms(duplicaterooms);
    }
    
  }

  return (
    <div className="container">
      <div className="row mt-5 bs">
        <div className="col-md-3">
          <RangePicker format="DD-MM-YYYY" onChange={filterByDate} />
        </div>

        <div className="col-md-5 ">
          <input
            type="text"
            className="form-control"
            placeholder="Search Rooms by City/Name"
            value={searchkey}
            onChange={(e) => {
              setsearchkey(e.target.value);
            }}
            onKeyUp={filterBySearch}
          />
        </div>

        <div className="col-md-3">
          <select className="form-control" value={type} onChange={(e) => {filterByType(e.target.value)}}>
            <option value="All">All</option>
            <option value="Deluxe">Deluxe</option>
            <option value="Non-Deluxe">Non-Deluxe</option>
          </select>
        </div>
      </div>

      <div className="row justify-content-center mt-5">
        {loading ? (
          <Loader />
        ) :  (
          rooms.map((room) => (
            <div className="col-md-9 mt-2" key={room._id}>
              <Room room={room} fromdate={fromdate} todate={todate} />
            </div>
          ))
        ) }
      </div>
    </div>
  );
}

export default HomeScreen;
