// src/main.jsx

import React from "react";
import ReactDOM from "react-dom/client";
import WeatherApp from "./App";
import "bootstrap/dist/css/bootstrap.min.css"; 

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <WeatherApp />
    </React.StrictMode>
);
