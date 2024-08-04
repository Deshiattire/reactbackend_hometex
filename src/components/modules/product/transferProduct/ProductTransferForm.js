import React, { useEffect, useState } from "react";
import Breadcrumb from "../../../partoals/Breadcrumb";
import CardHeader from "../../../partoals/miniComponents/CardHeader";
import axios from "axios";
import Swal from "sweetalert2";
import Constants from "../../../../Constants";
import Loader from "../../../partoals/miniComponents/Loader";
import { useParams, useNavigate} from "react-router-dom";

const ProductTransferForm = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState({});
  const [formData, setFormData] = useState({
    product_id: params.id,
    from_shop_id: "", // Set an initial from shop ID
    to_shop_id: "", // Set an initial to shop ID
    quantity: 1,
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    // If the input is "from_shop_id" or "to_shop_id"
    if (name === "from_shop_id" || name === "to_shop_id") {
      // Prevent selecting the same shop for both "From Shop" and "To Shop"
      if (name === "from_shop_id" && value === formData.to_shop_id) {
        return;
      }
      if (name === "to_shop_id" && value === formData.from_shop_id) {
        return;
      }
    }

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const token = localStorage.getItem("token");
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    axios
      .post(`${Constants.BASE_URL}/transfers`, formData, { headers })
      .then((response) => {
        console.log(response.data);
        Swal.fire({
            position: "top-end",
            icon: response.data.cls,
            title: response.data.message,
            showConfirmButton: false,
            toast: true,
            timer: 1500,
          });
          navigate("/products");
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    const config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `${Constants.BASE_URL}/product/${params.id}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    axios
      .request(config)
      .then((response) => {
        setProduct(response.data.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [params.id]);

  return (
    <>
      <Breadcrumb title={"Product Transfer Form"} />
      <div className="row">
        <div className="col-md-12">
          <div className="card">
            <div className="card-header">
              <CardHeader
                title={"Product Transfer Form"}
                link={"/products"}
                icon={"fa-list"}
                button_text={"Product List"}
              />
            </div>

            <div className="card-body">
              <div>
                <h2>Transfer Product</h2>
                <p>Product: {product.name}</p>
                <form onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label htmlFor="from_shop_id">From Shop:</label>
                    <select
                      className="form-control"
                      id="from_shop_id"
                      name="from_shop_id"
                      value={formData.from_shop_id}
                      onChange={handleInputChange}
                    >
                      <option value="">Select a shop</option>
                      {product.shops &&
                        product.shops.map((shop) => (
                          <option key={shop.shop_id} value={shop.shop_id}>
                            {shop.shop_name} - Available Quantity:{" "}
                            {shop.shop_quantity}
                          </option>
                        ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="to_shop_id">To Shop:</label>
                    <select
                      className="form-control"
                      id="to_shop_id"
                      name="to_shop_id"
                      value={formData.to_shop_id}
                      onChange={handleInputChange}
                    >
                      <option value="">Select a shop</option>
                      {product.shops &&
                        product.shops.map((shop) => (
                          <option key={shop.shop_id} value={shop.shop_id}>
                            {shop.shop_name} - Available Quantity:{" "}
                            {shop.shop_quantity}
                          </option>
                        ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="to_shop_id">Attribute:</label>
                    <select
                      className="form-control"
                      id="to_attribute_id"
                      name="to_attribute_id"
                      value={formData.to_shop_id}
                      onChange={handleInputChange}
                    >
                      <option value="">Select attribute</option>
                      {product.shops &&
                        product.shops.map((shop) => (
                          <option key={shop.shop_id} value={shop.shop_id}>
                            {shop.shop_name} - Available Quantity:{" "}
                            {shop.shop_quantity}
                          </option>
                        ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="quantity">Quantity:</label>
                    <input
                      type="number"
                      className="form-control"
                      id="quantity"
                      name="quantity"
                      value={formData.quantity}
                      onChange={handleInputChange}
                      max={product.availableQuantity}
                      min={1}
                    />
                  </div>
                  <button type="submit" className="btn btn-primary mt-3">
                    Transfer
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductTransferForm;
