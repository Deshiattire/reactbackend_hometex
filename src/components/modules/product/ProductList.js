import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Breadcrumb from "../../partoals/Breadcrumb";
import CardHeader from "../../partoals/miniComponents/CardHeader";
import axios from "axios";
import Swal from "sweetalert2";
import Constants from "../../../Constants";
import Loader from "../../partoals/miniComponents/Loader";
import NoDataFound from "../../partoals/miniComponents/NoDataFound";

const ProductList = () => {
  const [input, setInput] = useState({
    order_by: "id",
    direction: "desc",
    search: "",
  });
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [startFrom, setStartFrom] = useState(1);
  const [productColumns, setProductColumns] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMoreProducts, setHasMoreProducts] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const handleInput = (e) => {
    setInput((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const handleLoadMore = () => {
    const nextPage = currentPage + 1;
    getProducts(nextPage, true);
  };

  const getProducts = React.useCallback((pageNumber = 1, isLoadMore = false) => {
    if (isLoadMore) {
      setIsLoadingMore(true);
    } else {
      setIsLoading(true);
      setCurrentPage(1);
      setHasMoreProducts(true);
    }
    
    const token = localStorage.getItem("token");
    const searchParam = input.search ? `&search=${input.search}` : "";
    const url = `${Constants.BASE_URL}/products?page=${pageNumber}&paginate=yes&order_by=${input.order_by}&direction=${input.direction}${searchParam}`;

    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        const newProducts = Array.isArray(res.data.data?.products) 
          ? res.data.data.products.filter(p => p && p.id) 
          : [];
        const meta = res.data.meta;
        
        if (isLoadMore) {
          setProducts((prevProducts) => {
            const existingIds = new Set(prevProducts.map(p => String(p.id)));
            const uniqueNewProducts = newProducts.filter(p => p && p.id && !existingIds.has(String(p.id)));
            return [...prevProducts, ...uniqueNewProducts];
          });
        } else {
          setProducts(newProducts);
          setStartFrom(meta?.from || 1);
        }
        
        if (meta?.current_page >= meta?.last_page || newProducts.length === 0) {
          setHasMoreProducts(false);
        } else {
          setHasMoreProducts(true);
        }
        
        setCurrentPage(meta?.current_page || pageNumber);
        setIsLoading(false);
        setIsLoadingMore(false);
      })
      .catch((error) => {
        console.log(error);
        setIsLoading(false);
        setIsLoadingMore(false);
      });
  }, [input.search, input.order_by, input.direction]);

  const getProductColumns = React.useCallback(() => {
    const token = localStorage.getItem("token");
    axios
      .get(`${Constants.BASE_URL}/get-product-columns`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setProductColumns(res.data);
      })
      .catch((error) => {
        console.log(error);
        // handle error here, e.g. set an error state or display an error message
      });
  }, []);
  const handleDuplicateProduct = (id) => {
    const token = localStorage.getItem("token");

    axios
      .get(
        `${Constants.BASE_URL}/product/duplicate/@_jkL_qwErtOp~_lis/${id}`,
        null,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        getProducts();
        Swal.fire({
          position: "top-end",
          icon: response.data.cls,
          title: response.data.msg,
          showConfirmButton: false,
          toast: true,
          timer: 1500,
        });
      })
      .catch((error) => {
        Swal.fire({
          position: "top-end",
          title: error.message,
          showConfirmButton: false,
          toast: true,
          timer: 1500,
        });
      });
  };

  const handleProductDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You want to delete the product!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, DELETE IT!",
    }).then((result) => {
      if (result.isConfirmed) {
        const token = localStorage.getItem("token");
        axios
          .delete(`${Constants.BASE_URL}/product/${id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .then((res) => {
            getProducts();
            Swal.fire({
              position: "top-end",
              icon: res.data.cls,
              title: res.data.msg,
              showConfirmButton: false,
              toast: true,
              timer: 1500,
            });
          });
      }
    });
  };

  useEffect(() => {
    getProducts();
    getProductColumns();
  }, [getProducts, getProductColumns]);

  const handleGenerateBarcode = (product) => {
    navigate(`/generate-bar-code`, { state: { productSKU: product } });
  };

  return (
    <>
      <Breadcrumb title={"Product List"} />
      <div className="row">
        <div className="col-md-12">
          <div className="card">
            <div className="card-header">
              <CardHeader
                title={"Product list"}
                link={"/product/create"}
                icon={"fa-add"}
                button_text={"Add"}
              />
              <br />
              <CardHeader
                // title={"Product CSV"}
                link={"/product/csv"}
                icon={"fa-file-csv"}
                button_text={"Create CSV"}
              />
            </div>
            <div className="search-area mb-4 mx-3">
              <div className="row">
                <div className="col-md-3">
                  <label className={"w-100"}>
                    <p>Search</p>
                    <input
                      className="form-control form-control-sm"
                      type={"search"}
                      name={"search"}
                      value={input.search}
                      onChange={handleInput}
                      placeholder={"Enter product Name"}
                    />
                  </label>
                </div>

                <div className="col-md-2">
                  <label className={"w-100"}>
                    <p>Order By</p>
                    <select
                      className="form-select form-control-sm"
                      name={"order_by"}
                      value={input.order_by}
                      onChange={handleInput}
                    >
                      {productColumns.map((column, j) => (
                        <option key={j} value={column.id}>
                          {column.name}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
                <div className="col-md-2">
                  <label className={"w-100"}>
                    <p>Order Direction</p>
                    <select
                      className="form-select form-control-sm"
                      name={"direction"}
                      value={input.direction}
                      onChange={handleInput}
                    >
                      <option value={"asc"}>ASC</option>
                      <option value={"desc"}>DESC</option>
                    </select>
                  </label>
                </div>

                <div className="col-md-2">
                  <div className="d-grid mt-4">
                    <button
                      onClick={() => getProducts()}
                      className={"btn theme-button"}
                    >
                      <span><i className="fa-solid fa-magnifying-glass"></i></span>
                      Search
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="card-body">
              {isLoading ? (
                <Loader />
              ) : (
                <div className="table-responsive soft-landing">
                  <table
                    className={
                      "my-table table-sm product-table table table-hover table-striped table-bordered"
                    }
                  >
                    <thead>
                      <tr>
                        <th>SL</th>
                        <th>Name /Slug</th>
                        <th>Price / Price Formula</th>
                        <th>Status</th>
                        <th>Category</th>
                        <th>Photo</th>
                        <th>Date Time</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.length > 0 ? (
                        products.map((product, number) => (
                          <tr key={String(product.id)}>
                            <td>{startFrom + number}</td>
                            <td>
                              <p className={"text-theme"}>
                                Name: {product.name}
                              </p>
                              <p className={"text-success"}>
                                Slug: {product.slug}
                              </p>
                              <div className={"text-success"}>
                                {product.attributes !== undefined &&
                                Object.keys(product.attributes).length > 0
                                  ? product.attributes.map(
                                      (attribute, index) => (
                                        <div key={`${product.id}-attr-${index}`}>
                                          <small>
                                            {attribute.name}: {attribute.value}
                                          </small>
                                        </div>
                                      )
                                    )
                                  : null}
                              </div>
                            </td>
                            <td>
                              <p className={"text-theme"}>
                                <strong>
                                  Sale Price: {product.sell_price.price}{" "}
                                  {product.sell_price.symbol} | Discount:{" "}
                                  {product.sell_price.discount}{" "}
                                  {product.sell_price.symbol}
                                </strong>
                              </p>
                              <p className={"text-theme"}>
                                Price: {product.price}
                              </p>
                              <p className={"text-success"}>
                                Discount : {product.discount_percent} +{" "}
                                {product.discount_fixed}
                              </p>
                              <p className={"text-theme"}>
                                Cost: {product.cost}
                              </p>
                              <p className={"text-success"}>
                                Discount Start : {product.discount_start}
                              </p>
                              <p className={"text-theme"}>
                                Discount End: {product.discount_end}
                              </p>
                            </td>
                            <td>
                              <p className={"text-theme"}>
                                Status: {product.status}
                              </p>
                              <p className={"text-success"}>
                                SKU : {product.sku}
                              </p>
                              <p className={"text-theme"}>
                                Stock: {product.stock}
                              </p>
                            </td>
                            <td>
                              <p className={"text-theme"}>
                                Category: {product.category?.name}
                              </p>
                              <p className={"text-success"}>
                                Sub Category : {product.sub_category?.name}
                              </p>
                              <p className={"text-theme"}>
                                Brand: {product.brand?.name}
                              </p>
                              <p className={"text-success"}>
                                Origin : {product.country?.name}
                              </p>
                              <p className={"text-theme"}>
                                Supplier: {product.supplier?.name}
                              </p>
                            </td>
                            <td>
                              <img
                                src={product.primary_photo}
                                alt={product.name}
                                className={"img-thumbnail table-image"}
                              />
                            </td>
                            <td>
                              <p className={"text-theme"}>
                                Created: {product.created_at}
                              </p>
                              <p className={"text-success"}>
                                Updated: {product.updated_at}
                              </p>
                              <p className={"text-theme"}>
                                Created By:{product.created_by}
                              </p>
                              <p className={"text-success"}>
                                Updated By:{product.updated_by}
                              </p>
                            </td>
                            <td>
                              <div className={"w-40"}>
                                <Link to={`/product/${product.id}`}>
                                  <button className={"btn btn-sm btn-info"}>
                                    <i className="fa-solid fa-eye"></i>
                                  </button>
                                </Link>
                                <Link to={`/product/edit-new/${product.id}`}>
                                  <button
                                    className={"btn btn-sm my-1 btn-warning"}
                                  >
                                    <i className="fa-solid fa-pen-to-square"></i>
                                  </button>
                                </Link>
                                <Link
                                  to={`/product/transfer/form/${product.id}`}
                                >
                                  <button
                                    className={
                                      "btn btn-sm btn-outline-success my-1"
                                    }
                                  >
                                    <i className=" fa fa-exchange"></i>
                                  </button>
                                </Link>
                                <button
                                  onClick={() =>
                                    handleProductDelete(product.id)
                                  }
                                  className={"btn btn-sm btn-danger"}
                                >
                                  <i className="fa-solid fa-trash"></i>
                                </button>
                                <button
                                  className={"btn btn-sm btn-primary my-1"}
                                  onClick={() =>
                                    handleDuplicateProduct(product.id)
                                  }
                                >
                                  <span><i className="fa-solid fa-clone"></i></span>
                                </button>
                                <button
                                  className={"btn btn-sm btn-outline-dark"}
                                  onClick={() => handleGenerateBarcode(product)}
                                >
                                  <i className="fa-solid fa-barcode"></i>
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <NoDataFound />
                      )}
                    </tbody>
                  </table>
                  {hasMoreProducts && !isLoading && (
                    <div className="text-center mt-4">
                      <button
                        onClick={handleLoadMore}
                        disabled={isLoadingMore}
                        className="btn btn-primary"
                      >
                        <span style={{ display: isLoadingMore ? "inline-block" : "none" }}>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          Loading...
                        </span>
                        <span style={{ display: !isLoadingMore ? "inline-block" : "none" }}>
                          <span><i className="fa-solid fa-chevron-down me-2"></i></span>
                          Load More
                        </span>
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductList;
