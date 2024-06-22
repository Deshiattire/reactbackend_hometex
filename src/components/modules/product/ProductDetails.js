import React, { useEffect, useState } from "react";
import Breadcrumb from "../../partoals/Breadcrumb";
import CardHeader from "../../partoals/miniComponents/CardHeader";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import Constants from "../../../Constants";
import GlobalFunction from "../../../assets/GlobalFunction";

const ProductDetails = () => {
  const params = useParams([]);
  const [product, setProduct] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const getProduct = () => {
    setIsLoading(true);
    const token = localStorage.getItem("token");
    axios
      .get(`${Constants.BASE_URL}/product/${params.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setProduct(res.data.data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.log(error);
        // handle error here, e.g. set an error state or display an error message
      });
  };

  useEffect(() => {
    getProduct();
  }, []);

  const renderAttributeQuantities = () => {
    if (!product.attributes || product.attributes.length === 0) {
      return <p className="text-gray-600 italic">No attributes found.</p>;
    }
  
    return product.attributes.map((attribute, index) => (
      <div key={index} className="mb-6 p-4 shadow-lg rounded-lg bg-white">
        <h5 className="text-lg font-semibold text-indigo-600 mb-2">
          {attribute.attribute_name}: <span className="font-normal text-indigo-500">{attribute.attribute_value}</span>
        </h5>
        <ul className="list-disc pl-5">
          {attribute.shop_quantities.map((shopQty, shopIndex) => (
            <li key={shopIndex} className="text-gray-700">
              <span className="font-medium">Shop Name:</span> {shopQty.shop_name}, 
              <span className="font-medium"> Quantity:</span> {shopQty.quantity}
            </li>
          ))}
        </ul>
      </div>
    ));
  };
  

  return (
    <>
      <Breadcrumb title={"Product Details"} />
      <div className="row">
        <div className="col-md-12">
          <div className="card">
            <div className="card-header">
              <CardHeader
                title={"Product Details"}
                link={"/products"}
                icon={"fa-list"}
                button_text={"List"}
              />
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-6">
                  <div className="card h-100">
                    <div className="card-header">
                      <h5>Basic Information</h5>
                    </div>
                    <div className="card-body">
                      <table
                        className={
                          "my-table table-sm product-table table table-hover table-striped table-bordered"
                        }
                      >
                        <tbody>
                          <tr>
                            <th>Title</th>
                            <td>{product.name}</td>
                          </tr>
                          <tr>
                            <th>Slug</th>
                            <td>{product.slug}</td>
                          </tr>
                          <tr>
                            <th>SKU</th>
                            <td>{product.sku}</td>
                          </tr>
                          <tr>
                            <th>status</th>
                            <td>{product.status}</td>
                          </tr>
                          <tr>
                            <th>Category</th>
                            <td>
                              <Link to={"/category"}>
                                {product?.category?.name}
                              </Link>
                            </td>
                          </tr>
                          <tr>
                            <th>Sub Category</th>
                            <td>
                              <Link to={"/sub-category"}>
                                {product?.sub_category?.name}
                              </Link>
                            </td>
                          </tr>
                          <tr>
                            <th>Child Sub Category</th>
                            <td>
                              <Link to={"/child-sub-category"}>
                                {product?.child_sub_category?.name}
                              </Link>
                            </td>
                          </tr>
                          <tr>
                            <th>Brand</th>
                            <td>
                              <Link to={"/brand"}>{product?.brand?.name}</Link>
                            </td>
                          </tr>
                          <tr>
                            <th>Origin</th>
                            <td>{product.country?.name}</td>
                          </tr>
                          <tr>
                            <th>Supplier</th>
                            <td>
                              <Link to={"/suppliers"}>
                                {product.supplier?.name}
                              </Link>
                            </td>
                          </tr>
                          <tr>
                            <th>Created By</th>
                            <td>{product?.created_by?.name}</td>
                          </tr>
                          <tr>
                            <th>Updated By</th>
                            <td>{product.updated_BY?.name}</td>
                          </tr>
                          <tr>
                            <th>Creayed At</th>
                            <td>{product?.created_at}</td>
                          </tr>
                          <tr>
                            <th>updated At</th>
                            <td>{product?.updated_at}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="card h-100">
                    <div className="card-header">
                      <h5>Price & Stock</h5>
                    </div>
                    <div className="card-body">
                      <table
                        className={
                          "my-table table-sm product-table table table-hover table-striped table-bordered"
                        }
                      >
                        <tbody>
                          <tr>
                            <th>Cost</th>
                            <td>{product.cost}</td>
                          </tr>
                          <tr>
                            <th>Original sale Price</th>
                            <td>{product.price}</td>
                          </tr>
                          <tr>
                            <th>Price Formula || Field Limit</th>
                            <td>
                              {product?.price_formula} || {product?.field_limit}
                            </td>
                          </tr>
                          <tr>
                            <th>Sale Price</th>
                            <td>
                              {GlobalFunction.formatPrice(
                                product?.sell_price?.price,
                                product?.sell_price?.symbol
                              )}
                            </td>
                          </tr>
                          <tr>
                            <th>Discont</th>
                            <td>
                              {GlobalFunction.formatPrice(
                                product?.sell_price?.discount,
                                product?.sell_price?.symbol
                              )}
                            </td>
                          </tr>
                          <tr>
                            <th>Discount Percent</th>
                            <td>{product.discount_percent}</td>
                          </tr>
                          <tr>
                            <th>Discount Fixed</th>
                            <td>{product.discount_fixed}</td>
                          </tr>
                          <tr>
                            <th>Discount Start</th>
                            <td>{product.discount_start}</td>
                          </tr>
                          <tr>
                            <th>Discount End</th>
                            <td>{product.discount_end}</td>
                          </tr>
                          <tr>
                            <th>Discount Remaining Days</th>
                            <td>{product.discount_remaining_days} days</td>
                          </tr>
                          <tr>
                            <th>Product Stock</th>
                            <td>{product.stock}</td>
                          </tr>
                          <tr>
                            <th>Profit</th>
                            <td>
                              {GlobalFunction.formatPrice(product.profit)}
                            </td>
                          </tr>
                          <tr>
                            <th>Profit Percentage</th>
                            <td>{product.profit_percentage}%</td>
                          </tr>
                          <tr>
                            <th>Is Featured|New|Trending</th>
                            <td>
                              {product.isFeatured === 1 ? "Yes" : "No"} |{" "}
                              {product.isNew === 1 ? "Yes" : "No"} |{" "}
                              {product.isTrending === 1 ? "Yes" : "No"}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col">
          <h3 className="text-center">Attribute-wise Shop Quantities</h3>
          {renderAttributeQuantities()}
        </div>
      </div>

      <div className="row justify-content-center align-items-center g-2">
        <div className="col">
          <h3 className="text-center">Shops</h3>
          {product?.shops?.map((shop) => (
            <div key={shop?.shop_id} className="card mb-3">
              <div className="card-body col-md-4">
                <h5 className="card-title">{shop.shop_name}</h5>
                <p className="card-text">Quantity: {shop.shop_quantity}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="row justify-content-center align-items-center g-2">
        <div className="col">
          <h3 className="text-center">Photos</h3>
          <div className="row">
            {product?.photos?.map((photo, index) => (
              <div className="col-md-6" key={index}>
                <div className="card">
                  <img
                    src={photo?.photo}
                    alt={`Photo ${index}`}
                    className="card-img-top"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="col m-5 text-center">
          <h3 className="m-2">Primary Photos</h3>
          <img src={product?.primary_photo} alt="product.name" />
        </div>
      </div>
    </>
  );
};

export default ProductDetails;
