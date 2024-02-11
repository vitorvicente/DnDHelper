import React from "react";
import { Routes, Route } from "react-router-dom";

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Logout from "./pages/Logout";
import GM from "./pages/GM";
import Profile from "./pages/Profile";
import Game from "./pages/Game";
import NotFound from "./pages/NotFound";

import Layout from "./components/Layout";

import 'bootstrap/dist/css/bootstrap.css';

const AppBase = () => (
  <Routes>
    <Route path="/" element={<Layout />}>
      <Route index element={<Landing />} />
      <Route path="login" element={<Login />} />
      <Route path="logout" element={<Logout />} />
      <Route path="gm" element={<GM />} />
      <Route path="profile" element={<Profile />} />
      <Route path="Game" element={<Game />} />
      <Route path="*" element={<NotFound />} />
    </Route>
  </Routes>
);


export default AppBase;
