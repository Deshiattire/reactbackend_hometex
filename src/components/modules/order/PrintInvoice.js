import React, { useEffect, useState } from "react";
import Barcode from "react-barcode";
import GlobalFunction from "../../../assets/GlobalFunction";
import "../../../assets/css/PrintInvoice.css";

const PrintInvoice = ({ order, taxType }) => {
  const branch = JSON.parse(localStorage.getItem("branch"));
  const branchId = branch ? branch.id : null;
  const getBinNumber = (branchId) => {
    if (branchId === "9") {
      return "BIN: 004782306-0202";
    } else if (branchId === "8") {
      return "BIN: aaaac";
    } else if (branchId === "7") {
      return "BIN: 004734043-0101";
    }
    // Add more conditions for other branch IDs as needed
    return "BIN : 004782306-0202"; // Default value if no match
  };

  const binNumber = getBinNumber(branchId);

  const totalOrders = order?.order_details.length;
  const ordersSubtotal = order?.total + order?.discount;
  const vat = order?.total * taxType;

  let totalQuantity = 0;
  order?.order_details.forEach((product) => {
    totalQuantity += product?.quantity;
  });
  let vatRateText;
  if (taxType == 0.075) {
    vatRateText = "7.5%";
  } else if (taxType == 0.05) {
    vatRateText = "5.0%";
  } else {
    // Handle other tax types here if needed
    vatRateText = "0.0%";
  }

  return (
    <div>
      <div id="invoice-POS">
        <center id="top">
          <div className="logo"></div>
        </center>
        <div id="invoice-POS">
          <center id="top" style={{ textAlign: "center" }}>
            <div className="logo"></div>
            <div className="info">
              <img
                src="/static/media/hometex-logo.6cb4a390c04e43ae0736.png"
                alt={"shop Logo"}
                className="img-fluid"
                style={{
                  WebkitFilter: "grayscale(100%);",
                  filter: "grayscale(100%)",
                }}
              />
              <h2>Hometex Bangladesh</h2>
            </div>
          </center>
          <div id="mid">
            <div className="info">
              <div>
                Govt. of the People's Republic of Bangladesh. National Board of
                Revenue Tax Invoice (MUSAK-6.3)
                <br />
                [Clauses(c)&(f) of Sub-rules(1) of Rule 40]
                <br />
                <span style={{ textAlign: "center" }}>{binNumber}</span>
                <br />
                {order?.shop?.name}
              </div>
              <div>
                <br />
                User: {order?.sales_manager?.name}
                <br />
                Date: {order?.created_at}
                <br />
                Receipt No: {order?.order_number}
                <br />
                Total Number of Product: {totalOrders}
                <br />
                Total Number of Product Quantity: {totalQuantity}
              </div>
            </div>
          </div>
          <table className="table">
            <thead>
              <tr className="table-header">
                <th>SL</th>
                <th>Name</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {order?.order_details.map((product, index) => (
                <tr key={index}>
                  <td
                    style={{
                      borderBottom: "1px solid black",
                      borderBottomStyle: "dotted",
                    }}
                  >
                    {" "}
                    {++index}
                  </td>
                  <td
                    style={{
                      borderBottom: "1px solid black",
                      borderBottomStyle: "dotted",
                    }}
                  >
                    <p>
                      {product.name}
                      <br /> {product.sku}
                    </p>
                  </td>
                  <td
                    style={{
                      borderBottom: "1px solid black",
                      borderBottomStyle: "dotted",
                    }}
                  >
                    <p>Price : {product?.price}</p>
                  </td>
                  <td
                    style={{
                      textAlign: "center",
                      borderBottom: "1px solid black",
                      borderBottomStyle: "dotted",
                    }}
                  >
                    {product?.quantity}
                  </td>
                  <td
                    style={{
                      borderBottom: "1px solid black",
                      borderBottomStyle: "dotted",
                    }}
                  >
                    {GlobalFunction.formatPrice(
                      (product?.sell_price?.price +
                        product?.sell_price?.discount) *
                        product?.quantity
                    )}
                  </td>
                </tr>
              ))}
              <tr>
                <td
                  colSpan={4}
                  style={{
                    borderBottom: "1px solid black",
                    borderBottomStyle: "dotted",
                  }}
                >
                  Sub Total
                </td>
                <td
                  style={{
                    borderBottom: "1px solid black",
                    borderBottomStyle: "dotted",
                  }}
                >
                  {GlobalFunction.formatPrice(ordersSubtotal)}
                </td>
              </tr>
              <tr>
                <td
                  colSpan={4}
                  style={{
                    borderBottom: "1px solid black",
                    borderBottomStyle: "dotted",
                  }}
                >
                  Discount
                </td>
                <td
                  style={{
                    borderBottom: "1px solid black",
                    borderBottomStyle: "dotted",
                  }}
                >
                  - {GlobalFunction.formatPrice(order?.discount)}
                </td>
              </tr>
              <tr>
                <td
                  colSpan={4}
                  style={{
                    borderBottom: "1px solid black",
                    borderBottomStyle: "dotted",
                  }}
                >
                  VAT {vatRateText}
                </td>
                <td
                  style={{
                    borderBottom: "1px solid black",
                    borderBottomStyle: "dotted",
                  }}
                >
                  {GlobalFunction.formatPrice(vat) ?? 0}
                </td>
              </tr>
              <tr>
                <td colSpan={4}>Total</td>
                <td
                  style={{
                    fontWeight: "bold",
                    borderBottom: "1px solid black",
                    borderBottomStyle: "dotted",
                  }}
                >
                  {GlobalFunction.formatPrice(order?.total + vat)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div>
          <span
            style={{
              borderBottom: "1px solid black",
              borderBottomStyle: "dotted",
            }}
          >
            Mode of Payment
          </span>
          <br />
          <span>{order?.payment_method?.name}</span> :{" "}
          {GlobalFunction.formatPrice(order?.paid_amount)}
        </div>
        <div
          style={{
            paddingTop: "5px",
          }}
        >
          Customer:
          <br />
          Name: {order?.customer?.name}
          <br />
          Contact: {order?.customer?.phone} <br />
        </div>
        <hr />
        <div style={{ textAlign: "justify" }}>
          Items may be exchanged subject to Hometex Bangladesh Sales & Exchange
          Policies within 15 days of Invoice Date. An item may be exchanged only
          once. An item must be unworn, unwashed, undamaged and unused [Fairly
          Enough Condition]. No Cash Refund is Applicable.
          <hr />
          VAT Note: 5% VAT on ready-made products. No VAT on jute items.
          <hr />
          Shop Online: www.hometex.ltd 
          <br/>Queries & Complaints: +8809610963839
          <br />
          Suggestions: support@hometex.ltd
        </div>
        <p style={{ textAlign: "center" }}>
          <Barcode value={order?.order_number} height={30} />
        </p>
      </div>
    </div>
  );
};

export default PrintInvoice;