import React from 'react';
import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Main from "./Pages/Main";
import SignUp from "./Pages/SignUp";
import Login from "./Pages/Login";
import DiaryEntry from "./Pages/DiaryEntry";
import DiaryOpen from "./Pages/DiaryOpen";
import GroupAdd from "./Pages/GroupAdd";
import ReadEntry from "./Pages/ReadEntry";
import Dashboard from "./Pages/Dashboard";
import { TitleContext } from './Components/TitleContext';
import './App.css';

function App() {
  const [title, setTitle] = useState('Default Title');
  return (
    <TitleContext.Provider value={{ title, setTitle }}>
      <BrowserRouter>
        <Routes>
          <Route exact path="/" element={<Login />}></Route>
          <Route path="/SignUp" element={<SignUp />}></Route>
          <Route path="/Main" element={<Main />}></Route>
          <Route path="/DiaryEntry" element={<DiaryEntry />}></Route>
          <Route path="/DiaryOpen" element={<DiaryOpen />}></Route>
          <Route path="/GroupAdd" element={<GroupAdd />}></Route>
          <Route path="/ReadEntry" element={<ReadEntry />}></Route>
          <Route path="/Dashboard" element={<Dashboard />}></Route>
        </Routes>
      </BrowserRouter>
    </TitleContext.Provider>
  );
}

export default App;