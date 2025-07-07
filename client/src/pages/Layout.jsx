import React, { useContext } from "react";
import { Outlet } from "react-router-dom";
import { LoaderContext } from "../context/LoaderContext.jsx";
import Loader from "../components/Loader";
import Navbar from "../components/Navbar.jsx";

const Layout = () => {
  const { loading } = useContext(LoaderContext);

  return (
    <>
      {loading && <Loader />}
      <main className="min-h-screen">
        <Navbar />
        <Outlet />
      </main>
    </>
  );
};

export default Layout;
