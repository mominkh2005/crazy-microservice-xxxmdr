import React, { useEffect, useState } from "react";
import axios from "axios";

const App = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchCallCappingStatus(); // Fetch call capping status when the component mounts
  }, []);

  const fetchCallCappingStatus = async () => {
    try {
      const response = await axios.get("YOUR_API_GATEWAY_URL/call-capping"); // Replace with your API URL
      console.log("API Response:", response); // Log the entire response
      if (Array.isArray(response.data)) {
        setServices(response.data); // Set the response data to state
      } else {
        console.error("Unexpected response format:", response.data);
        setError("Unexpected response format.");
      }
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Error fetching data.");
    } finally {
      setLoading(false); // Set loading to false
    }
  };

  const handleToggle = async (serviceArea) => {
    // Toggle the call capping status for the selected service area
    const updatedServices = services.map((service) => {
      if (service.ServiceArea === serviceArea) {
        service.CallCappingStatus = !service.CallCappingStatus;
        updateCallCappingStatus(service); // Update in the backend
      }
      return service; // Return the updated service
    });
    setServices(updatedServices); // Update local state
  };

  const updateCallCappingStatus = async (service) => {
    try {
      const response = await axios.put("YOUR_API_GATEWAY_URL/call-capping", {
        ServiceArea: service.ServiceArea,
        CallCappingStatus: service.CallCappingStatus,
      }); // Call the update API
      alert(response.data.message); // Show success message
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  return (
    <div>
      <h1>Admin Console - Call Capping Management</h1>
      {loading ? (
        <p>Loading...</p> // Loading state
      ) : (
        <ul>
          {services.map((service) => (
            <li key={service.ServiceArea}>
              {service.ServiceArea}:
              <label>
                <input
                  type="checkbox"
                  checked={service.CallCappingStatus} // Checked state
                  onChange={() => handleToggle(service.ServiceArea)} // Handle toggle
                />
                {service.CallCappingStatus ? " Active" : " Inactive"}
              </label>
            </li>
          ))}
        </ul>
      )}
      {error && <p>{error}</p>} {/* Display error messages */}
    </div>
  );
};

export default App;
