import React from "react";
import { useState } from "react";
import Modal from "react-bootstrap/Modal";
import Constants from "../../../Constants";
import axios from "axios";
import Swal from "sweetalert2";

const AddCustomer = ({ setModalShow, ...props }) => {
  const [input, setInput] = useState({});
  const [errors, setErrors] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handlecustomerCreate = () => {
    const token = localStorage.getItem("token");
    setIsLoading(true);

    axios
      .post(`${Constants.BASE_URL}/customer`, input, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setIsLoading(false);
        Swal.fire({
          position: "top-end",
          icon: res.data.cls,
          title: res.data.msg,
          showConfirmButton: false,
          toast: true,
          timer: 1500,
        });
        setModalShow(false);
      })
      .catch((errors) => {
        setIsLoading(false);
        if (errors.response.status === 422) {
          setErrors(errors.response.data.errors);
        }
      });
  };

  const handleInput = (e) => {
    setInput((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };
  return (
    <Modal {...props} aria-labelledby="contained-modal-title-vcenter" centered>
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Add Customer
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="col-md-12">
          <label className={"w-100"}>
            <p>Name</p>
            <input
              className={
                errors.name !== undefined
                  ? "form-control mt-2 is-invalid"
                  : "form-control mt-2"
              }
              type={"text"}
              name={"name"}
              value={input.name}
              onChange={handleInput}
              placeholder={"Enter Customer name"}
            />
            <p className={"login-error-msg"}>
              <small>{errors.name !== undefined ? errors.name[0] : null}</small>
            </p>
          </label>
        </div>
        <div className="col-md-12">
          <label className={"w-100 mt-4"}>
            <p>Phone</p>
            <input
              className={
                errors.phone !== undefined
                  ? "form-control mt-2 is-invalid"
                  : "form-control mt-2"
              }
              type={"text"}
              name={"phone"}
              value={input.phone}
              onChange={handleInput}
              placeholder={"Enter Customer phone"}
            />
            <p className={"login-error-msg"}>
              <small>
                {errors.phone !== undefined ? errors.phone[0] : null}
              </small>
            </p>
          </label>
        </div>
        <div className="col-md-12">
          <label className={"w-100 mt-4"}>
            <p>Email</p>
            <input
              className={
                errors.email !== undefined
                  ? "form-control mt-2 is-invalid"
                  : "form-control mt-2"
              }
              type={"email"}
              name={"email"}
              value={input.email}
              onChange={handleInput}
              placeholder={"Enter Customer email"}
            />
            <p className={"login-error-msg"}>
              <small>
                {errors.email !== undefined ? errors.email[0] : null}
              </small>
            </p>
          </label>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <button
          onClick={handlecustomerCreate}
          className={"btn theme-button"}
          dangerouslySetInnerHTML={{
            __html: isLoading
              ? '<span className="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span> Loading...'
              : "Add Customer",
          }}
        />
      </Modal.Footer>
    </Modal>
  );
};

export default AddCustomer;
