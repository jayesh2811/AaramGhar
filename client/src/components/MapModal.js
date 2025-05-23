import React, { useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import mapboxgl from "mapbox-gl";
import axios from "axios";

// Set your Mapbox access token
mapboxgl.accessToken =
  "pk.eyJ1IjoiamF5ZXNoMjgxMSIsImEiOiJjbHk1OWd6NnIwZDhvMmtyM2g4NGFpYWpxIn0.p_lt_HokDS9FPN41cNsgHQ";

function MapModal({ show, onHide, address }) {
  useEffect(() => {
    let map;

    if (show) {
      map = new mapboxgl.Map({
        container: "map-container",
        style: "mapbox://styles/mapbox/satellite-streets-v12",
        zoom: 6,
      });

      map.addControl(new mapboxgl.NavigationControl());

      const fetchCoordinates = async () => {
        try {
          const response = await axios.get(
            `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
              address
            )}.json?access_token=${mapboxgl.accessToken}`
          );

          const coordinates = response.data.features[0]?.center;

          if (coordinates) {
            map.flyTo({ center: coordinates, zoom: 11 });
            new mapboxgl.Marker()
              .setLngLat(coordinates)
              .setPopup(new mapboxgl.Popup().setHTML(`<b>${address}</b>`))
              .addTo(map);
          } else {
            alert("Address not found!");
          }
        } catch (error) {
          console.error("Failed to fetch coordinates", error);
        }
      };

      fetchCoordinates();
    }

    return () => map && map.remove();
  }, [show, address]);

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header>
        <Modal.Title>Directions</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div
          id="map-container"
          style={{ height: "300px", width: "100%" }}
        ></div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default MapModal;
