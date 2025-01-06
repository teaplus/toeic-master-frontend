import React from "react";
import "./App.css";
import Header from "./components/layout/Header";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";

function App() {
  return (
    <div className="App relative">
      <AppRoutes />
    </div>
  );
}

export default App;
