import React, { useEffect, useState } from "react";
import Breadcrumb from "../../../partoals/Breadcrumb";
import CardHeader from "../../../partoals/miniComponents/CardHeader";
import axios from "axios";
import Swal from "sweetalert2";
import Constants from "../../../../Constants";
import Loader from "../../../partoals/miniComponents/Loader";
import NoDataFound from "../../../partoals/miniComponents/NoDataFound";
import { Link } from "react-router-dom";

const ProductTransferList = () => {
  const [transferData, setTransferData] = useState([]);
  const [loading, setLoading] = useState(false);

  const getTransferProductData = () => {
    setLoading(true);
    const token = localStorage.getItem("token");
    const headers = {
      Authorization: `Bearer ${token}`,
    };

    axios
      .get(`${Constants.BASE_URL}/transfers`, { headers })
      .then((response) => {
        console.log(response.data);
        setTransferData(response.data.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
  };

  useEffect(() => {
    getTransferProductData();
  }, []);

  // Function to approve a transfer
  const approveTransfer = (transferId) => {
    const token = localStorage.getItem("token");
    const headers = {
      Authorization: `Bearer ${token}`,
    };

    // Make a PUT request to approve the transfer
    axios
      .put(
        `${Constants.BASE_URL}/transfers/${transferId}/approve`,
        {},
        { headers }
      )
      .then((response) => {
        // Handle success, e.g., show a success message
        Swal.fire({
            position: "top-end",
            icon: response.data.cls,
            title: response.data.message,
            showConfirmButton: false,
            toast: true,
            timer: 1500,
          });
        getTransferProductData();
      })
      .catch((error) => {
        console.error(error);
      });
  };

  // Function to reject a transfer
  const rejectTransfer = (transferId) => {
    const token = localStorage.getItem("token");
    const headers = {
      Authorization: `Bearer ${token}`,
    };

    // Make a PUT request to reject the transfer
    axios
      .put(
        `${Constants.BASE_URL}/transfers/${transferId}/reject`,
        {},
        { headers }
      )
      .then((response) => {
        // Handle success, e.g., show a success message
        Swal.fire({
            position: "top-end",
            icon: response.data.cls,
            title: response.data.message,
            showConfirmButton: false,
            toast: true,
            timer: 1500,
          });
        getTransferProductData();
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <>
      <Breadcrumb title={"Product Transfer List"} />
      <div className="row">
        <div className="col-md-12">
          <div className="card">
            <div className="card-header">
              <CardHeader
                title={"Product Transfer List"}
                link={"/products"}
                icon={"fa-list"}
                button_text={"Product List"}
              />
            </div>

            <div className="card-body">
              {loading ? (
                <Loader />
              ) : transferData.length ? (
                <table className="table">
                  <thead>
                    <tr>
                      <th>Product ID</th>
                      <th>Product</th>
                      <th>From Shop</th>
                      <th>To Shop</th>
                      <th>Quantity</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transferData.map((transfer) => (
                      <tr key={transfer.id}>
                        <td>{transfer?.product_id}</td>
                        <td>{transfer?.product?.name}</td>
                        <td>{transfer?.from_shop?.name}</td>
                        <td>{transfer.to_shop?.name}</td>
                        <td>{transfer.quantity}</td>
                        <td>{transfer.status}</td>
                        <td>
                          {transfer.status === "pending" && (
                            <button
                              className="btn btn-success mx-2"
                              onClick={() => approveTransfer(transfer.id)}
                            >
                              Approve
                            </button>
                          )}
                          {transfer.status === "pending" && (
                            <button
                              className="btn btn-danger"
                              onClick={() => rejectTransfer(transfer.id)}
                            >
                              Reject
                            </button>
                          )}
                          {transfer.status !== "pending" && (
                            <button className="btn btn-success mx-2" disabled>
                              Approve
                            </button>
                          )}
                          {transfer.status !== "pending" && (
                            <button className="btn btn-danger" disabled>
                              Reject
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <NoDataFound />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductTransferList;
