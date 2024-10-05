import React, { useEffect, useState } from "react";
import Breadcrumb from "../../partoals/Breadcrumb";
import CardHeader from "../../partoals/miniComponents/CardHeader";
import axios from "axios";
import Swal from "sweetalert2";
import Constants from "../../../Constants";
import Loader from "../../partoals/miniComponents/Loader";
import NoDataFound from "../../partoals/miniComponents/NoDataFound";
import Papa from "papaparse";

function CsvProduct() {
  const [isLoading, setIsLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [checkedProducts, setCheckedProducts] = useState([]);
  const [selectedProductIds, setSelectedProductIds] = useState([]);

  const getProducts = () => {
    setIsLoading(true);
    const token = localStorage.getItem("token");
    axios
      .get(`${Constants.BASE_URL}/product`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setProducts(res.data.data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.log(error);
        // handle error here, e.g. set an error state or display an error message
      });
  };

  let token = localStorage.getItem("token");

  useEffect(() => {
    getProducts();
  }, []);

  const exportProductIds = () => {
    if (checkedProducts.length === 0) {
      Swal.fire("Error", "No products selected.", "error");
      return;
    }

    // Create a list of selected product IDs
    const selectedProductIds = checkedProducts;

    // Send the selected product IDs to the Laravel site
    const formData = new FormData();
    formData.append("selectedProductIds", JSON.stringify(selectedProductIds));

    axios
      .post(`${Constants.BASE_URL}/save-csv`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        Swal.fire("Success", "Selected product IDs sent to Laravel.", "success");
      })
      .catch((error) => {
        console.log(error);
        Swal.fire("Error", "Failed to send selected product IDs to Laravel.", "error");
      });
  };

  return (
    <>
      <Breadcrumb title={"Create CSV for Facebook"} />
      <div className="row">
        <div className="col-md-12">
          <div className="card">
            <div className="card-header">
              <CardHeader
                title={"Create CSV for Facebook"}
                link={"/products"}
                icon={"fa-list"}
                button_text={"Product List"}
              />
            </div>
            <div className="card-body">
              {isLoading ? (
                <Loader />
              ) : (
                <div className="table-responsive soft-landing">
                  <table
                    className={
                      "my-table table table-hover table-striped table-bordered"
                    }
                  >
                    <thead>
                      <tr>
                        <th>
                          <input
                            type="checkbox"
                            checked={checkedProducts.length === products.length}
                            onChange={(e) =>
                              e.target.checked
                                ? setCheckedProducts(products.map((product) => product.id))
                                : setCheckedProducts([])
                            }
                          />
                        </th>
                        <th>id</th>
                        <th>title</th>
                        <th>description</th>
                        <th>availability</th>
                        <th>condition</th>
                        <th>price</th>
                        <th>link</th>
                        <th>image_link</th>
                        <th>brand</th>
                        <th>Image</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.keys(products).length > 0 ? (
                        products.map((product, number) => (
                          <tr key={number}>
                            <td>
                              <input
                                type="checkbox"
                                checked={checkedProducts.includes(product.id)}
                                onChange={(e) => {
                                  const productId = product.id;
                                  setCheckedProducts((prevCheckedProducts) => {
                                    if (e.target.checked) {
                                      return [...prevCheckedProducts, productId];
                                    } else {
                                      return prevCheckedProducts.filter((id) => id !== productId);
                                    }
                                  });
                                }}
                              />
                            </td>
                            <td>{product?.id}</td>
                            <td>{product?.name}</td>
                            <td dangerouslySetInnerHTML={{ __html: product?.description }} />
                            <td>in stock</td>
                            <td>new</td>
                            <td>{product?.sell_price.price}</td>
                            <td>{product?.id}</td>
                            <td>{product?.primary_photo}</td>
                            <td>{product?.brand?.name}</td>
                            <td>
                              <img
                                src={product?.primary_photo}
                                alt={product?.name}
                                className={"img-thumbnail table-image"}
                              />
                            </td>
                          </tr>
                        ))
                      ) : (
                        <NoDataFound />
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
            <div className="card-footer">
              <button
                className="btn btn-primary"
                onClick={exportProductIds}
                disabled={checkedProducts.length === 0}
              >
                Export Product CSV and send to Facebook & Instagram
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default CsvProduct;
