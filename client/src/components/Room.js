import React, { useState } from "react";
import { Modal, Button, Carousel } from "react-bootstrap";
import { Link } from "react-router-dom";
import moment from "moment";

function Room({ room, fromdate, todate }) {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const formattedFromDate = fromdate ? moment(fromdate).format("DD-MM-YYYY") : null;
  const formattedToDate = todate ? moment(todate).format("DD-MM-YYYY") : null;

  return (
    <div className="row bs">
      <div className="col-md-4">
        <img src={room.imgUrls[0]} alt="" className="smallImg" />
      </div>

      <div className="col-md-7">
        <h3>{room.name}</h3>
        <p>
          <b>Max Count :</b> {room.maxCount}
        </p>
        <p>
          <b>Phone Number :</b> {room.phoneNumber}
        </p>
        <p>
          <b>Type :</b> {room.type}{" "}
          <span className="float-right">
            <b>Price :</b> &#8377;{room.rentPerDay}/day
          </span>
        </p>

        <p className="mb-0">
          <b>City :</b> {room.location}
        </p>

        <div style={{ float: "right" }}>
          {(formattedFromDate && formattedToDate) && (
            <Link to={`/book/${room._id}/${formattedFromDate}/${formattedToDate}`}>
              <button className="btn btn-primary m-2">Book Now</button>
            </Link>
          )}

          <button className="btn btn-primary" onClick={handleShow}>
            View Details
          </button>
        </div>
      </div>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header>
          <Modal.Title>{room.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Carousel prevLabel="" nextLabel="">
            {room.imgUrls.map((url, index) => (
              <Carousel.Item key={index}>
                <img className="d-block w-100 bigImg" src={url} alt="" />
              </Carousel.Item>
            ))}
          </Carousel>
          <p>{room.description}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Room;
