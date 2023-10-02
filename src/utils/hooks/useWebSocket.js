import { useState, useEffect } from "react";

const useWebSocket = (socketUrl, initialData = null) => {
  const [socket, setSocket] = useState(null);
  const [error, setError] = useState(false);
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Create the WebSocket connection
    const newSocket = new WebSocket(socketUrl);
    // authorizationHeader ? [authorizationHeader] : [],
    setSocket(newSocket);

    // Event listener for when the connection is established
    newSocket.onopen = () => {
      setIsConnected(true);
    };

    // Event listener for receiving data from the server
    newSocket.onmessage = event => {
      const receivedData = JSON.parse(event.data);
      setData(receivedData);
      setLoading(false); // Set loading to false when data is received
    };

    // Event listener for WebSocket errors
    newSocket.onerror = error => {
      console.error("WebSocket error:", error);
      setError(true); // Set error to true when an error occurs
      setLoading(false); // Also set loading to false when an error occurs
    };

    // Clean up function to close the WebSocket connection when the component unmounts
    return () => {
      if (isConnected && newSocket) {
        newSocket.close();
      }
    };
  }, [socketUrl, isConnected]);

  // Function to send data through the WebSocket
  const sendData = data => {
    console.log(socket && socket.readyState === WebSocket.OPEN);
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify(data));
    } else {
      console.log(socket && socket.readyState === WebSocket.OPEN);

      console.error("WebSocket is not open xx.");
    }
    console.log("HHooopeqw");
  };

  return { error, data, loading, sendData };
};

export default useWebSocket;
