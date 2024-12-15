// import React from 'react';
// import { Navigate } from 'react-router-dom';

// const PrivateRoute = ({ children }) => {
//   const token = localStorage.getItem('token');
//   const role = localStorage.getItem('role');
//   console.log(token)
// console.log(role)
//   if (!token || role !== 'admin') {
//     return <Navigate to="/admin" />;  // Redirect to login page if not authenticated
//   }

//   return children;  // If authenticated, return the protected children components
// };

// export default PrivateRoute;
