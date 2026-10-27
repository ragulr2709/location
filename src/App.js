
import React, { useState, useEffect } from "react";

const App = () => {
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const getLocationName = async (latitude, longitude) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`
      );

      if (!response.ok) {
        throw new Error("Unable to fetch address");
      }

      const data = await response.json();
      return data.display_name || "Address not found";
    } catch (err) {
      console.error("Geocoding error:", err);
      return "Unable to get location name";
    }
  };

  const getLocation = () => {
    setLoading(true);
    setError("");
    setLocation(null);

    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const {
          latitude,
          longitude,
          accuracy
        } = position.coords;

        console.log("Latitude:", latitude);
        console.log("Longitude:", longitude);
        console.log("Accuracy:", accuracy, "meters");

        const locationName = await getLocationName(
          latitude,
          longitude
        );

        setLocation({
          latitude,
          longitude,
          accuracy,
          locationName
        });

        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
        console.error("Location error:", err);
      },
      {
        enableHighAccuracy: true,
        timeout: 20000,
        maximumAge: 0
      }
    );
  };

  useEffect(() => {
    getLocation();
  }, []);

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h2>Current Location</h2>

      {loading && <p>Fetching your GPS location...</p>}

      {error && (
        <p style={{ color: "red" }}>
          Error: {error}
        </p>
      )}

      {location && (
        <div>
          <p>
            <strong>Latitude:</strong> {location.latitude}
          </p>

          <p>
            <strong>Longitude:</strong> {location.longitude}
          </p>

          <p>
            <strong>Accuracy:</strong> ±
            {location.accuracy.toFixed(2)} meters
          </p>

          <p>
            <strong>Location:</strong> {location.locationName}
          </p>

          <a
            href={`https://www.google.com/maps?q=${location.latitude},${location.longitude}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            Open in Google Maps
          </a>
        </div>
      )}

      <br />

      <button onClick={getLocation}>
        Refresh Location
      </button>
    </div>
  );
};

export default App;
