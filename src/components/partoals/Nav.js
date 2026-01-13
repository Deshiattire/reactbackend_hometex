// Import React and other dependencies
import React, { useEffect, useState } from "react";
import $ from "jquery";
import Swal from "sweetalert2";
import axios from "axios";
import Logo from "./../../assets/img/hometex-logo.png";
import Constants from "../../Constants";
import GlobalFunction from "./../../assets/GlobalFunction";
import { Link } from "react-router-dom";

export default function Nav() {
  const [branch, setBranch] = useState({});

  // Function to handle logout
  const handleLogout = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You will be logged out from the admin panel!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Logout!",
    }).then((result) => {
      if (result.isConfirmed) {
        let token = localStorage.getItem("token");
        if (token) {
          var config = {
            method: "post",
            maxBodyLength: Infinity,
            url: `${Constants.BASE_URL}/logout`,
            headers: {
              Authorization: "Bearer " + token,
            },
          };

          axios(config)
            .then(function (response) {
              GlobalFunction.logOut();
            })
            .catch(function (error) {
              console.log(error);
              // Logout locally even if API returns 403
              GlobalFunction.logOut();
            });
        }
      }
    });
  };

  // Function to handle sidebar toggle
  const handleSidebar = () => {
    $("body").toggleClass("sb-sidenav-toggled");
  };

  useEffect(() => {
    if (localStorage.branch !== undefined) {
      setBranch(JSON.parse(localStorage.branch));
    }
  }, []);

  return (
    <nav className="sb-topnav navbar navbar-expand navbar-dark bg-theme">
      {/* Navbar Brand */}
      <Link className="navbar-brand ps-3" to="/">
        <img
          src={Logo}
          alt={"Hometex Bangladesh"}
          className={"img-thumbnail w-25"}
        />
      </Link>
      {/* Sidebar Toggle */}
      <button
        onClick={handleSidebar}
        className="btn btn-link btn-sm order-1 order-lg-0 me-4 me-lg-0"
        id="sidebarToggle"
      >
        <i className="fas fa-bars"></i>
      </button>

      {/* Clear Local Storage Button */}
      <button
        style={{
          margin: "10px",
          fontSize: "16px",
          borderRadius: "50px",
        }}
        onClick={clearLocalStorageAndRedirect} // Use the updated function
        id="clearStorage"
      >
        Magic Button
      </button>
      <Link to={"/orders/create"}>
      <div className="btn btn-outline-danger">
          <i className="fa-solid fa-store"></i>
      </div>
      </Link>
      {/* Navbar */}
      <ul className="navbar-nav align-items-center ms-auto me-3 me-lg-4">
        <p className="text-white">
          <strong>{branch && branch.name ? branch.name + " | " : ""}</strong>
          {localStorage.name !== undefined ? localStorage.name : null}
        </p>
        <li className="nav-item dropdown">
          <a
            className="nav-link dropdown-toggle"
            id="navbarDropdown"
            href="#!"
            role="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <i className="fas fa-user fa-fw"></i>
          </a>
          <ul
            className="dropdown-menu dropdown-menu-end"
            aria-labelledby="navbarDropdown"
          >
            <li>
              <a className="dropdown-item" href="#!">
                Settings
              </a>
            </li>
            <li>
              <a className="dropdown-item" href="#!">
                Activity Log
              </a>
            </li>
            <li>
              <hr className="dropdown-divider" />
            </li>
            <li>
              <button onClick={handleLogout} className="dropdown-item">
                Logout
              </button>
            </li>
          </ul>
        </li>
      </ul>
    </nav>
  );
}

// Function to clear local storage and redirect to the root URL
function clearLocalStorageAndRedirect() {
  localStorage.clear(); // This clears all data in local storage
  alert("Local storage has been cleared.");
  window.location.href = "/"; // Redirect to the root URL
}
