import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Loader from "../components/Loader";
import Error from "../components/Error";
import moment from "moment";
import StripeCheckout from "react-stripe-checkout";
import Swal from "sweetalert2";
import MapModal from "../components/MapModal";

function BookingScreen() {
  const { roomid, fromdate, todate } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [room, setRoom] = useState(null);
  const [showMapModal, setShowMapModal] = useState(false); // State for Modal

  const fromDate = moment(fromdate, "DD-MM-YYYY");
  const toDate = moment(todate, "DD-MM-YYYY");

  const totalDays =
    toDate.isValid() && fromDate.isValid()
      ? toDate.diff(fromDate, "days") + 1
      : NaN;

  useEffect(() => {
    if (!localStorage.getItem("currentUser")) {
      window.location.href = "/login";
    }

    const fetchRoom = async () => {
      try {
        setLoading(true);
        const response = await axios.post("/api/rooms/getroombyid", { roomid });
        setRoom(response.data);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        setError(error);
      }
    };

    fetchRoom();
  }, [roomid]);

  async function onToken(token) {
    const bookingDetails = {
      room,
      userid: JSON.parse(localStorage.getItem("currentUser"))._id,
      fromdate: fromDate.format("DD-MM-YYYY"),
      todate: toDate.format("DD-MM-YYYY"),
      totalamount: room.rentPerDay * totalDays,
      totaldays: totalDays,
      token,
    };

    try {
      setLoading(true);
      const result = await axios.post("/api/bookings/bookroom", bookingDetails);
      setLoading(false);
      Swal.fire("Success", "Room booked successfully", "success").then(() => {
        window.location.href = "/profile";
      });
    } catch (error) {
      setLoading(false);
      Swal.fire("Error", "Booking failed", "error");
    }
  }

  return (
    <div>
      {loading ? (
        <Loader />
      ) : room ? (
        <div className="m-5">
          <div className="row justify-content-center mt-5 bs">
            <div className="col-md-5">
              <h2>{room.name}</h2>
              <img src={room.imgUrls[0]} alt="" className="bigImg" /> <br />
            </div>

            <div className="col-md-3">
              <h2>Amenities</h2>
              <hr />
              <ul>
                {room.amenities.map((amenity, index) => (
                  <li key={index}>{amenity}</li>
                ))}
              </ul> 
              <br></br>

              <h2>Address</h2>
              <hr />
              <p>{room.address}</p>
              <button
                className="btn btn-primary"
                onClick={() => setShowMapModal(true)}
              >
                Get Directions
              </button>
            </div>

            <div className="col-md-3">
              <h2>Booking Details</h2>
              <hr />
              <p>Name: {JSON.parse(localStorage.getItem("currentUser")).name}</p>
              <p>
                From:{" "}
                {fromDate.isValid()
                  ? fromDate.format("DD-MM-YYYY")
                  : "Invalid date"}
              </p>
              <p>
                To:{" "}
                {toDate.isValid()
                  ? toDate.format("DD-MM-YYYY")
                  : "Invalid date"}
              </p>
              <p>Max Count: {room.maxCount}</p>
              <div>
                <h2>Amount</h2>
                <hr />
                <p>
                  Total Days:{" "}
                  {isNaN(totalDays) ? "Invalid date range" : totalDays}
                </p>
                <p>Rent per Day: {room.rentPerDay}</p>
                <p>
                  Total Amount:{" "}
                  {isNaN(totalDays)
                    ? "Invalid date range"
                    : room.rentPerDay * totalDays}
                </p>
              </div>
              <div style={{ float: "right" }}>
                <button
                  className="btn btn-primary mr-3"
                  onClick={() => {
                    window.location.href = "/home";
                  }}
                >
                  Go Back
                </button>
                <StripeCheckout
                  token={onToken}
                  amount={room.rentPerDay * totalDays * 100}
                  currency="INR"
                  stripeKey={process.env.REACT_APP_STRIPE_KEY}
                >
                  <button className="btn btn-primary">Pay Now</button>
                </StripeCheckout>
              </div>
            </div>
          </div>
          {/* Map Modal */}
          <MapModal
            show={showMapModal}
            onHide={() => setShowMapModal(false)}
            address={room.address}
          />
        </div>
      ) : (
        <Error />
      )}
    </div>
  );
}

export default BookingScreen;
