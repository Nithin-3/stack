import React from 'react';
import { BrowserRouter, Outlet, Route, Routes } from 'react-router-dom';
import './App.css';
import Header from "./header"
import Courses from './course';
import Feedback from './feedback';
import Task from './task';
import Auth from './auth';
import Usr from './usr';

function App() {
    function MainLayout() {
        return (
            <>
                <Header />
                <Outlet />
            </>
        );
    }
    function Noheader() {
        return <Outlet />;
    }
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<MainLayout />}>
                    <Route path="/" element={<Courses />} />
                    <Route path="/feedback" element={<Feedback />} />
                    <Route path="/task" element={<Task />} />
                </Route>
                <Route element={<Noheader />}>
                    <Route path="/acc" element={<Auth />} />
                    <Route path="/usr" element={<Usr />} />
                </Route>
            </Routes>
        </BrowserRouter >
    );
}

export default App;
