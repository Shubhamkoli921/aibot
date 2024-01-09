import React from 'react';
import { Route, Navigate, Router, Routes } from 'react-router-dom';
import AuthService from '../admin/authentication/authservice';
// import AuthService from './AuthService';

const PrivateRoute = ({ component: Component, ...rest }) => {
    return (
        <Routes>

            <Route
                {...rest}
                render={(props) =>
                    AuthService.isAuthenticated() ? (
                        <Component {...props} />
                    ) : (
                        // <Redirect to="/adminlogin" />
                        <Navigate replace to='/adminlogin' />

                    )
                }
            />
        </Routes>
    );
};

export default PrivateRoute;