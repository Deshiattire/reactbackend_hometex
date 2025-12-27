import React, { useEffect, useState } from "react";
import Breadcrumb from "../../partoals/Breadcrumb";
import CardHeader from "../../partoals/miniComponents/CardHeader";
import axios from "axios";
import Constants from "../../../Constants";
import { useParams } from "react-router-dom";
import ReactDOM from "react-dom";
import GlobalFunction from "../../../assets/GlobalFunction";
import PrintInvoice from "./PrintInvoice";
import GiftInvoicePrint from "./GiftInvoicePrint";

const OrderDetails = () => {
  const params = useParams();
  const [order, setOrder] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTaxType, setSelectedTaxType] = useState(0);

  const getOrderDetails = () => {
    setIsLoading(true);
    const token = localStorage.getItem("token");
    axios
      .get(`${Constants.BASE_URL}/order/${params.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        console.log(res);
        setOrder(res.data.data);
        setIsLoading(false);
      });
  };

  useEffect(() => {
    getOrderDetails();
  }, []);

  const handleTaxTypeChange = (event) => {
    setSelectedTaxType(event.target.value);
  };

  console.log(selectedTaxType);

  const printInvoice = () => {
    const printWindow = window.open("", "_blank");
    printWindow.document.open();
    printWindow.document.write(
      "<html><head><title>Print Invoice</title></head><body>"
    );
    ReactDOM.render(
      <PrintInvoice order={order} taxType={selectedTaxType} />,
      printWindow.document.body
    );

    printWindow.document.write("</body></html>");
    printWindow.document.close();

    printWindow.print();
    printWindow.onafterprint = () => {
      printWindow.close();
    };
  };

  const giftInvoicePrint = () => {
    const printWindow = window.open("", "_blank");
    printWindow.document.open();
    printWindow.document.write(
      "<html><head><title>Print Gift Invoice</title></head><body>"
    );
    ReactDOM.render(
      <GiftInvoicePrint order={order} taxType={selectedTaxType} />,
      printWindow.document.body
    );

    printWindow.document.write("</body></html>");
    printWindow.document.close();
    
    printWindow.print();
    printWindow.onafterprint = () => {
      printWindow.close();
    };
  };
  

  return (
    <>
      <Breadcrumb title={"Order Details"} />
      <div className="row">
        <div className="col-md-12">
          <div className="card">
            <div className="card-header">
              <CardHeader
                title={`${order?.order_number} Order Details`}
                link={"/orders"}
                icon={"fa-list"}
                button_text={"List"}
              />
            </div>
            <div className="tax-type-dropdown text-center my-3">
                <label>Select Tax Type:</label>
                <select value={selectedTaxType} onChange={handleTaxTypeChange} className="mx-2">
                  <option value="0" selected>Select Vat %</option>
                  <option value="0.050">Retail Vat (5.0%)</option>
                  <option value="0.075">Supply Vat (7.5%)</option>
                  <option value="0.000">Vat Exempt (0.0%)</option>
                  {/* Add options for other tax types as needed */}
                </select>
              </div>
            <div className="search-area mb-4 mx-3">
              <div className="row">
                <div className="col-md-6">
                  <div className="card-header">
                    <h5> Customer Details</h5>
                  </div>
                  <div className="card-body">
                    <table
                      className={
                        "table table-hover table-bordered table-striped sm-table"
                      }
                    >
                      <thead>
                        <tr>
                          <th>Name</th>
                          <td>{order?.customer?.name}</td>
                        </tr>
                        <tr>
                          <th>Phone</th>
                          <td>{order?.customer?.phone}</td>
                        </tr>
                        <tr>
                          <th>Email</th>
                          <td>{order?.customer?.email}</td>
                        </tr>
                      </thead>
                    </table>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="card-header">
                    <h5> Shop Details</h5>
                  </div>
                  <div className="card-body">
                    <table
                      className={
                        "table table-hover table-bordered table-striped sm-table"
                      }
                    >
                      <thead>
                        <tr>
                          <th className={"align-middle"}>Shop</th>
                          <td className={"align-middle"}>
                            <img
                              src={order?.shop?.logo}
                              alt={"shop Logo"}
                              className="table-image img-thumbnail"
                            />
                          </td>
                        </tr>
                        <tr>
                          <th className={"align-middle"}>Shop Name</th>
                          <td className={"align-middle"}>
                            {order?.shop?.name}
                          </td>
                        </tr>
                        <tr>
                          <th className={"align-middle"}>Sales Manager</th>
                          <td className={"align-middle"}>
                            {order?.sales_manager?.name}
                          </td>
                        </tr>
                      </thead>
                    </table>
                  </div>
                </div>
              </div>
              <div className="col-md-12 mt-4">
                <div className="card h-100">
                  <div className="card-header">
                    <h5>Order Summary</h5>
                  </div>

                  <div className="card-body">
                    <table
                      className={
                        "table table-bordered table-hover table-striped sm-table"
                      }
                    >
                      <tbody>
                        <tr>
                          <th className="align-middle">Order Number</th>
                          <td className="align-middle">
                            <strong>{order?.order_number}</strong>
                          </td>
                          <th className="align-middle">Total Items</th>
                          <td className="align-middle">
                            <strong>{order?.quantity}</strong>
                          </td>
                        </tr>
                        <tr>
                          <th className="align-middle">Order status</th>
                          <td className="align-middle">
                            <strong>{order?.order_status_string}</strong>
                          </td>
                          <th className="align-middle">Payment Status</th>
                          <td className="align-middle">
                            <strong>{order?.payment_status}</strong>
                          </td>
                        </tr>
                        <tr>
                          <th className="align-middle">Payment Method</th>
                          <td className="align-middle">
                            {order?.payment_method?.name}
                          </td>
                          <th className="align-middle">Account Number</th>
                          <td className="align-middle">
                            {order?.payment_method?.account_number}
                          </td>
                        </tr>
                        <tr>
                          <th className="align-middle">Sub Total</th>
                          <td className="align-middle">
                            <strong>
                              {GlobalFunction.formatPrice(order?.sub_total)}
                            </strong>
                          </td>
                          <th className="align-middle">Discount</th>
                          <td className="align-middle">
                            {GlobalFunction.formatPrice(order?.discount)}
                          </td>
                        </tr>
                        <tr>
                          <th className="align-middle">Total</th>
                          <td className="align-middle">
                            <strong className="text-theme">
                              {GlobalFunction.formatPrice(order?.total)}
                            </strong>
                          </td>
                        </tr>
                        <tr>
                          <th className="align-middle">Paid Amount</th>
                          <td className="align-middle">
                            <strong className="text-success">
                              {GlobalFunction.formatPrice(order?.paid_amount)}
                            </strong>
                          </td>
                          <th className="align-middle">Due Amount</th>
                          <td className="align-middle">
                            <strong className="text-danger">
                              {GlobalFunction.formatPrice(order?.due_amount)}
                            </strong>
                          </td>
                        </tr>
                        <tr>
                          <th className="align-middle">Order Placed</th>
                          <td className="align-middle">
                            <strong>{order?.created_at}</strong>
                          </td>
                          <th className="align-middle">Order Updated</th>
                          <td className="align-middle">
                            <strong>{order?.updated_at}</strong>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
              <div className="col-md-12 mt-4">
                <div className="card h-100">
                  <div className="card-header">
                    <h5>Order Item Details</h5>
                  </div>

                  <div className="card-body">
                    <table
                      className={
                        "table table-bordered table-hover table-striped table-sm sm-table"
                      }
                    >
                      <thead>
                        <tr>
                          <th>SL</th>
                          <th>Name</th>
                          <th>Info</th>
                          <th>Quantity</th>
                          <th>Photo</th>
                          <th>Amounts</th>
                          <th>Sub Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {order?.order_details.map((product, index) => (
                          <tr key={index}>
                            <td className={"align-middle"}> {++index}</td>
                            <td className={"align-middle"}>
                              <p>{product.name}</p>
                              <p>SKU: {product.sku}</p>
                              <p>Supplier: {product.supplier}</p>
                            </td>
                            <td className={"align-middle"}>
                              <p>Brand: {product?.brand}</p>
                              <p>Category: {product?.category}</p>
                              <p>Sub Category: {product?.sub_category}</p>
                            </td>
                            <td className={"align-middle"}>
                              {product?.quantity}
                            </td>
                            <td className={"align-middle"}>
                              <img
                                src={product?.photo}
                                alt={"product photo"}
                                className="table-image img-thumbnail"
                              />
                            </td>
                            <td className={"align-middle"}>
                              <p>Original Price: {product?.price}</p>
                              <p>
                                Discount:{" "}
                                {GlobalFunction.formatPrice(
                                  product?.sell_price?.discount
                                )}
                              </p>
                              <p>
                                Sale Price:{" "}
                                {GlobalFunction.formatPrice(
                                  product?.sell_price?.price
                                )}
                              </p>
                            </td>
                            <td className={"align-middle text-end"}>
                              {GlobalFunction.formatPrice(
                                product?.sell_price?.price * product?.quantity
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              <div className="col-md-12 mt-4 mb-5">
                <div className="card h-100">
                  <div className="card-header">
                    <h5>Transactions</h5>
                  </div>

                  <div className="card-body">
                    <table
                      className={
                        "table table-bordered table-hover table-striped table-sm sm-table"
                      }
                    >
                      <thead>
                        <tr>
                          <th>SL</th>
                          <th>Trx Id</th>
                          <th>Amount</th>
                          <th>Customer</th>
                          <th>Payment Method</th>
                          <th>Status</th>
                          <th>Transaction By</th>
                          <th>Created At</th>
                        </tr>
                      </thead>
                      <tbody>
                        {order?.transactions.map((transaction, index) => (
                          <tr key={index}>
                            <td className={"align-middle"}> {++index}</td>
                            <td className={"align-middle"}>
                              <p>{transaction.trx_id}</p>
                            </td>
                            <td className={"align-middle"}>
                              <p>
                                {GlobalFunction.formatPrice(
                                  transaction?.amount
                                )}
                              </p>
                            </td>
                            <td className={"align-middle"}>
                              <p>Name: {transaction?.customer_name}</p>
                              <p>Phone: {transaction?.customer_phone}</p>
                            </td>
                            <td className={"align-middle"}>
                              <p>
                                Payment Method:{" "}
                                {transaction?.payment_method_name}
                              </p>
                              <p>
                                Account Number: {transaction?.account_number}
                              </p>
                            </td>
                            <td className={"align-middle"}>
                              <p>Status: {transaction?.status}</p>
                              <p>TRX Type: {transaction?.transaction_type}</p>
                            </td>
                            <td className={"align-middle"}>
                              <p>{transaction?.transaction_by}</p>
                            </td>
                            <td className={"align-middle"}>
                              <p>{transaction?.created_at}</p>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Add a print button */}
      <div className="text-center no-print">
        <button className="btn btn-primary" onClick={printInvoice}>
          Print Invoice
        </button>
        <button className="btn btn-primary mx-2" onClick={giftInvoicePrint}>
          Gift Invoice
        </button>
      </div>
    </>
  );
};

export default OrderDetails;
