import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import axios from "axios";
import React, { useEffect, useState, Suspense } from "react";

// Dynamically import the components
const Login = React.lazy(() => import("./components/Login"));
const Home = React.lazy(() => import("./pages/Home"));
const Editor = React.lazy(() => import("./pages/Editor"));
const Layout = React.lazy(() => import("./components/Layout"));

const App = () => {
  const [user, setUser] = useState();

  const userInformation = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/auth/login/success`, {
        withCredentials: true,
      });

      if (response.data.error) {
        console.log("Error:", response.data.message);
      } else {
        console.log("Success:", response.data.message);
        console.log("User data:", response.data.user);
        setUser(response.data.user);
      }
    } catch (error) {
      console.error("There was an error making the request:", error);
    }
  };

  useEffect(() => {
    userInformation();
  }, []);

  return (
    <Router>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/" element={user ? <Navigate to="/home" /> : <Login />} />
          <Route
            path="/home"
            element={user ? (
              <Layout>
                <Home />
              </Layout>
            ) : (
              <Navigate to="/" />
            )}
          />
          <Route
            path="/editor"
            element={user ? (
              <Layout>
                <Editor />
              </Layout>
            ) : (
              <Navigate to="/" />
            )}
          />
        </Routes>
      </Suspense>
    </Router>
  );
};

export default App;
