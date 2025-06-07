import './App.css';

import React from "react";
import { Grid, Paper, Typography } from "@mui/material";
import { BrowserRouter as Router, Route, Routes, Navigate,useNavigate } from "react-router-dom";
import {useState, useEffect} from "react";
import TopBar from "./components/TopBar";
import UserDetail from "./components/UserDetail";
import UserList from "./components/UserList";
import UserPhotos from "./components/UserPhotos";
import LoginRegister from "./components/LoginRegister";
import RequireLogin from "./components/RequireLogin";


const App = () => {
    const [currentUser, setCurrentUser] = useState(null);
    const navigate = useNavigate();

    // Kiểm tra session khi component mount
    useEffect(() => {
        const checkSession = async () => {
            try {
                const response = await fetch(`http://localhost:8081/api/user/check-auth`, {
                    credentials: 'include'
                });
                if (response.ok) {
                    const user = await response.json();
                    setCurrentUser(user);
                }
            } catch (error) {
                console.error('Session check failed:', error);
            }
        };
        checkSession();
    }, []);

    const handleLoginSuccess = (user) => {
        setCurrentUser(user);
        navigate(`/users/${user._id}`);
    }

    const handleLogout = () => {
        setCurrentUser(null);
        navigate("/login");
    }

    return (
        <>
            <TopBar
                user={currentUser}
                onLogout={handleLogout}
            />
            <div className="main-topbar-buffer">
                {/* ben trai */}
                <Grid container spacing={2}>
                    {currentUser&&(
                        <Grid item sm={3}>
                            <Paper className="main-grid-item">
                                <UserList/>
                            </Paper>
                        </Grid>
                    )}
                    {/* ben phai */}
                    <Grid item sm={currentUser ?9:12}>
                        <Routes>
                            <Route
                                path="/login"
                                element={
                                    currentUser ? (
                                        <Navigate to="/users" replace />
                                    ) : (
                                        <LoginRegister onLoginSuccess={handleLoginSuccess}/>
                                    )
                                }
                            />
                            <Route
                                path="/"
                                element={
                                    <RequireLogin user={currentUser}>
                                        <Navigate to="/users" replace />
                                    </RequireLogin>
                                }
                            />

                            <Route
                                path="users/:userId"
                                element={
                                    <RequireLogin user={currentUser}>
                                        <Paper className="main-grid-item">
                                            <UserDetail/>
                                        </Paper>
                                    </RequireLogin>
                                }
                            />
                            <Route
                                path="photos/:userId"
                                element={
                                    <RequireLogin user={currentUser}>
                                        <Paper className="main-grid-item">
                                            <UserPhotos/>
                                        </Paper>
                                    </RequireLogin>
                                }
                            />
                            <Route
                                path = "users"
                                element={
                                    <RequireLogin user={currentUser}>
                                        <Paper className="main-grid-item">
                                            <Typography variant="h6">Please select a user from the list.</Typography>
                                        </Paper>
                                    </RequireLogin>
                                }
                            />
                        </Routes>
                    </Grid>
                </Grid>
            </div>
        </>
    );
}

const AppWrapper = () => {
    return (
        <Router>
            <App />
        </Router>
    );
}

export default AppWrapper;