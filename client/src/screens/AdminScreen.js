import React, { useState, useEffect } from "react";
import { Tabs } from "antd";
import axios from "axios";
import Loader from "../components/Loader";
import Error from "../components/Error";
import Swal from "sweetalert2";

const { TabPane } = Tabs;

function AdminScreen() {
  useEffect(() => {
    if (!JSON.parse(localStorage.getItem("currentUser")).isAdmin) {
      window.location.href = "/home";
    }
  });

  return (
    <div className="mt-3 ml-5 mr-5 bs">
      <h2 className="text-center">Admin Panel</h2>
      <Tabs defaultActiveKey="1">
        <TabPane tab={<b>Bookings</b>} key="1">
          <Bookings />
        </TabPane>

        <TabPane tab={<b>Rooms</b>} key="2">
          <Rooms />
        </TabPane>

        <TabPane tab={<b>Users</b>} key="3">
          <Users />
        </TabPane>

        <TabPane tab={<b>Add Rooms</b>} key="4">
          <Addroom />
        </TabPane>
      </Tabs>
    </div>
  );
}

export default AdminScreen;

export function Bookings() {
  const [bookings, setbookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/api/bookings/getallbookings");
        const data = response.data;
        setbookings(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching bookings:", error);
        setLoading(false);
        setError(error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="row">
      <div className="col-md-12">
        <h3>Bookings</h3>
        {loading && <Loader />}

        <table className="table table-bordered table-dark">
          <thead className="bs">
            <tr>
              <th>Booking Id</th>
              <th>User Id</th>
              <th>Username</th>
              <th>Room</th>
              <th>From</th>
              <th>To</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {bookings.length &&
              bookings.map((booking) => {
                return (
                  <tr>
                    <td>{booking._id}</td>
                    <td>{booking.userid}</td>
                    <td>
                      {JSON.parse(localStorage.getItem("currentUser")).name}
                    </td>
                    <td>{booking.room}</td>
                    <td>{booking.fromdate}</td>
                    <td>{booking.todate}</td>
                    <td>{booking.status}</td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function Rooms() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/api/rooms/getallrooms");
        const data = response.data;
        setRooms(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching bookings:", error);
        setLoading(false);
        setError(error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="row">
      <div className="col-md-12">
        <h3>Rooms</h3>
        {loading && <Loader />}

        <table className="table table-bordered table-dark">
          <thead className="bs">
            <tr>
              <th>Room Id</th>
              <th>Name</th>
              <th>Type</th>
              <th>Rent Per Day</th>
              <th>Max Count</th>
              <th>Phone Number</th>
            </tr>
          </thead>

          <tbody>
            {rooms.length &&
              rooms.map((room) => {
                return (
                  <tr>
                    <td>{room._id}</td>
                    <td>{room.name}</td>

                    <td>{room.type}</td>
                    <td>{room.rentPerDay}</td>
                    <td>{room.maxCount}</td>
                    <td>{room.phoneNumber}</td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/api/users/getallusers");
        const data = response.data;
        setUsers(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching bookings:", error);
        setLoading(false);
        setError(error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="row">
      <div className="col-md-12">
        <h3>Users</h3>
        {loading && <Loader />}

        <table className="table table-bordered table-dark">
          <thead>
            <tr>
              <th>User ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Is Admin</th>
            </tr>
          </thead>

          <tbody>
            {users &&
              users.map((user) => {
                return (
                  <tr>
                    <td>{user._id}</td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.isAdmin ? "YES" : "NO"}</td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function Addroom() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [name, setname] = useState("");
  const [rentperday, setrentperday] = useState();
  const [maxcount, setmaxcount] = useState();
  const [description, setdescription] = useState();
  const [phonenumber, setphonenumber] = useState();
  const [type, settype] = useState();
  const [imgurl1, setimgurl1] = useState();
  const [imgurl2, setimgurl2] = useState();
  const [imgurl3, setimgurl3] = useState();

  async function addRoom() {
    const newroom = {
      name,
      rentPerDay: rentperday,
      maxCount: maxcount,
      description,
      phoneNumber: phonenumber,
      type,
      imgUrls: [imgurl1, imgurl2, imgurl3],
    };

    try {
      setLoading(true);
      const result = (await axios.post("/api/rooms/addroom", newroom)).data;
      console.log(result);
      setLoading(false);
      Swal.fire("Congrats", "New Room Added Successfully!", "success").then(
        (result) => {
          window.location.href = "/home";
        }
      );
    } catch (error) {
      console.log(error);
      setLoading(false);
      Swal.fire("Oops", "Something went wrong!", "error");
    }
  }

  return (
    <div className="row">
      {loading && <Loader />}
      <div className="col-md-5">
        <input
          type="text"
          className="form-control"
          placeholder="Room Name"
          value={name}
          onChange={(e) => {
            setname(e.target.value);
          }}
        />
        <input
          type="text"
          className="form-control"
          placeholder="Rent Per Day"
          value={rentperday}
          onChange={(e) => {
            setrentperday(e.target.value);
          }}
        />
        <input
          type="text"
          className="form-control"
          placeholder="Max Count"
          value={maxcount}
          onChange={(e) => {
            setmaxcount(e.target.value);
          }}
        />
        <input
          type="text"
          className="form-control"
          placeholder="Description"
          value={description}
          onChange={(e) => {
            setdescription(e.target.value);
          }}
        />
        <input
          type="text"
          className="form-control"
          placeholder="Phone Number"
          value={phonenumber}
          onChange={(e) => {
            setphonenumber(e.target.value);
          }}
        />
      </div>

      <div className="col-md-5">
        <input
          type="text"
          className="form-control"
          placeholder="Type"
          value={type}
          onChange={(e) => {
            settype(e.target.value);
          }}
        />
        <input
          type="text"
          className="form-control"
          placeholder="Image URL 1"
          value={imgurl1}
          onChange={(e) => {
            setimgurl1(e.target.value);
          }}
        />
        <input
          type="text"
          className="form-control"
          placeholder="Image URL 2"
          value={imgurl2}
          onChange={(e) => {
            setimgurl2(e.target.value);
          }}
        />
        <input
          type="text"
          className="form-control"
          placeholder="Image URL 3"
          value={imgurl3}
          onChange={(e) => {
            setimgurl3(e.target.value);
          }}
        />

        <div className="text-center">
          <button className="btn btn-primary mt-2" onClick={addRoom}>
            Add Room
          </button>
        </div>
      </div>
    </div>
  );
}
