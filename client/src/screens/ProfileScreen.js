import React, { useEffect, useState } from "react";
import { Tabs } from "antd";
import axios from "axios";
import Loader from "../components/Loader";
import Error from "../components/Error";
import Swal from "sweetalert2";
import { Divider, Flex, Tag } from 'antd';

const { TabPane } = Tabs;

function ProfileScreen() {
  const user = JSON.parse(localStorage.getItem("currentUser"));

  useEffect(() => {
    if (!user) {
      window.location.href = "/login";
    }
  }, []);

  return (
    <div className="ml-5 mt-3">
      <Tabs defaultActiveKey="1">
        <TabPane tab={<b>Profile</b>} key="1" className="col-md-5 bs">
          <h2>My Profile</h2>
          <br />

          <h6>
            <b>Name : </b>
            {user.name}
          </h6>
          <h6>
            <b>Email : </b>
            {user.email}
          </h6>
          <h6>
            <b>Admin Access : </b>
            {user.isAdmin ? "Yes" : "No"}
          </h6>
        </TabPane>
        <TabPane tab={<b>Bookings</b>} key="2">
          <MyBookings />
        </TabPane>
      </Tabs>
    </div>
  );
}

export default ProfileScreen;

export function MyBookings() {
  const user = JSON.parse(localStorage.getItem("currentUser"));
  const [bookings, setbookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.post("/api/bookings/getbookingsbyuserid", {
          userid: user._id,
        });
        const data = response.data;
        console.log(data);
        setbookings(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
        setError(error);
      }
    };

    fetchData();
  }, [user._id]);

  async function cancelBooking(bookingid, roomid) {
    try {
      setLoading(true);
      const response = await axios.post("/api/bookings/cancelbooking", { bookingid, roomid });
      const result = response.data;
      setLoading(false);
  
      Swal.fire(
        "Congrats",
        "Your booking has been cancelled!",
        "success"
      ).then(() => {
        window.location.reload();
      });
    } catch (error) {
      console.error("Error in cancelling booking:", error);
      setLoading(false);
      Swal.fire("Oops", "Something went wrong!", "error");
    }
  }
  

  return (
    <div>
      <div className="row">
        <div className="col-md-6">
          {loading && (<Loader/>) }
          {bookings && (
            bookings.map((booking) => {
              return (
                <div className="bs">
                  <h2>{booking.room}</h2>

                  <h6>
                    <b>Booking Id : </b>
                    {booking._id}
                  </h6>
                  <h6>
                    <b>Transaction Id : </b>
                    {booking.transactionId}
                  </h6>
                  <h6>
                    <b>Check-In Date : </b>
                    {booking.fromdate}
                  </h6>
                  <h6>
                    <b>Check-Out Date : </b>
                    {booking.todate}
                  </h6>
                  <h6>
                    <b>Amount : </b>
                    {booking.totalamount}
                  </h6>
                  <h6>
                    <b>Status : </b>
                    {booking.status === 'Cancelled' ? (<Tag color="red">Cancelled</Tag>) : (<Tag color="green">Confirmed</Tag>)}
                  </h6>

                  {booking.status !== "Cancelled" && (
                    <div className="text-right">
                      <button
                        className="btn btn-primary"
                        onClick={() => {
                          cancelBooking(booking._id, booking.roomid);
                        }}
                      >
                        CANCEL BOOKING
                      </button>
                    </div>
                  )}
                </div>
              );
            })) }
           
        </div>
      </div>
    </div>
  );
}
