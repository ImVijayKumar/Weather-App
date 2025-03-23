// src/App.jsx

import React, { useState, useEffect } from "react";
import axios from "axios";
import { Input, List, Card, Spin } from "antd";
import { motion } from "framer-motion";

const { Search } = Input;

const WeatherApp = () => {
    const [input, setInput] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [weather, setWeather] = useState({
        loading: false,
        data: null,
        error: false,
    });

    useEffect(() => {
        if (input.length > 2) {
            fetchCitySuggestions();
        } else {
            setSuggestions([]);
        }
    }, [input]);

    const fetchCitySuggestions = async () => {
        const apiKey = "55bcb10dcc10a878c49a5e958b020ded"; // Replace with your OpenWeather API key
        const url = `https://api.openweathermap.org/data/2.5/find?q=${input}&type=like&sort=population&cnt=5&appid=${apiKey}`;

        try {
            const res = await axios.get(url);
            setSuggestions(res.data.list.map(city => city.name));
        } catch (error) {
            console.error("Error fetching city suggestions:", error);
        }
    };

    const fetchWeather = async (city) => {
        setWeather({ ...weather, loading: true, error: false });
        setInput(city);
        setSuggestions([]);

        const apiKey = "55bcb10dcc10a878c49a5e958b020ded"; // Replace with your OpenWeather API key
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;

        try {
            const res = await axios.get(url);
            setWeather({ data: res.data, loading: false, error: false });
        } catch (error) {
            if (error.response && error.response.status === 404) {
                setWeather({ ...weather, data: null, error: true });
            } else {
                console.error("API Error:", error);
            }
        }
    };

    return (
        <div className="container text-center mt-5">
            <motion.h1 initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
                Weather App
            </motion.h1>
            <Search
                placeholder="Enter city name..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onSearch={fetchWeather}
                className="mb-3"
                size="large"
            />
            {suggestions.length > 0 && (
                <List
                    bordered
                    dataSource={suggestions}
                    renderItem={(city) => (
                        <List.Item onClick={() => fetchWeather(city)}>{city}</List.Item>
                    )}
                    className="mb-3"
                />
            )}
            {weather.loading && <Spin size="large" />}
            {weather.error && <p className="text-danger">City not found</p>}

            {weather.data && (
                <motion.div
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <Card className="mx-auto" style={{ width: 400 }}>
                        <h2>{weather.data.name}, {weather.data.sys.country}</h2>
                        <p>{new Date().toLocaleDateString()}</p>
                        {weather.data.weather[0].icon ? (
                            <img
                                src={`https://openweathermap.org/img/wn/${weather.data.weather[0].icon}@2x.png`}
                                alt={weather.data.weather[0].description}
                            />
                        ) : (
                            <p>No icon available</p>
                        )}
                        <h3>{Math.round(weather.data.main.temp)}°C</h3>
                        <p>{weather.data.weather[0].description.toUpperCase()}</p>
                        <p>Wind Speed: {weather.data.wind.speed} m/s</p>
                    </Card>
                </motion.div>
            )}
        </div>
    );
};

export default WeatherApp;