import React, { useEffect, useState } from "react";
import Breadcrumb from "../../partoals/Breadcrumb";
import CardHeader from "../../partoals/miniComponents/CardHeader";
import axios from "axios";
import Swal from 'sweetalert2'
import Constants from "../../../Constants";
import Pagination from "react-js-pagination";
import { Link } from "react-router-dom";
import Loader from "../../partoals/miniComponents/Loader";
import NoDataFound from "../../partoals/miniComponents/NoDataFound";
import GlobalFunction from '../../../assets/GlobalFunction'

function OrderList() {
    const [input, setInput] = useState({
        order_by: 'id',
        per_page: 10,
        direction: 'asc',
        search: '',
    });

    const [itemsCountsPerPage, setItemsCountPerPage] = useState(0);
    const [totalCountsPerPage, setTotalCountPerPage] = useState(1);
    const [startFrom, setStartFrom] = useState(1);
    const [activePage, setActivePage] = useState(1);

    const [modalShow, setModalShow] = React.useState(false);
    const [modalPhotoShow, setModalPhotoShow] = React.useState(false);
    const [Order, setOrder] = useState([]);
    const [isLoading, setIsLoading] = useState(false)

    const [orders, setOrders] = useState([]);

    const handleInput = (e) => {
        setInput((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }));
    };

    const getOrders = (pageNumber = 1) => {
        const token = localStorage.getItem('token');
        const url = `${Constants.BASE_URL}/order?page=${pageNumber}&search=${input.search}&order_by=${input.order_by}&per_page=${input.per_page}&direction=${input.direction}`;
      
        const config = {
          method: 'get',
          maxBodyLength: Infinity,
          url,
          headers: {
            'Authorization': `Bearer ${token}`
          }
        };
      
        setIsLoading(true);
        setOrders([]); // set a default value
      
        axios.request(config)
          .then((res) => {
            setOrders(res.data.data);
            setItemsCountPerPage(res.data.meta.per_page);
            setStartFrom(res.data.meta.from);
            setTotalCountPerPage(res.data.meta.total);
            setActivePage(res.data.meta.current_page);
            setIsLoading(false);
          })
          .catch((error) => {
            console.error(error);
            setIsLoading(false);
          });
      };
      
      

    useEffect(() => {
        getOrders();
    }, []);

    return (
        <>
            <Breadcrumb title={"Order List"} />
            <div className="row">
                <div className="col-md-12">
                    <div className="card">
                        <div className="card-header">
                            <CardHeader
                                title={"Order list"}
                                link={"/orders/create"}
                                icon={"fa-add"}
                                button_text={"Add"}
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
                                            placeholder={"Enter order Name"}
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
                                            <option value={"id"}>Serial</option>
                                            <option value={"order_number"}>Name</option>
                                            <option value={"created_at"}>Created</option>
                                            <option value={"updated_at"}>Updated</option>
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
                                    <label className={"w-100"}>
                                        <p>Per Page</p>
                                        <select
                                            className="form-select form-control-sm"
                                            name={"per_page"}
                                            value={input.per_page}
                                            onChange={handleInput}
                                        >
                                            <option value={10}>10</option>
                                            <option value={25}>25</option>
                                            <option value={100}>100</option>
                                        </select>
                                    </label>
                                </div>
                                <div className="col-md-2">
                                    <div className="d-grid mt-4">
                                        <button
                                            onClick={() => getOrders(1)}
                                            className={"btn theme-button"}
                                        >
                                            <i className="fa-solid fa-magnifying-glass"></i>
                                            Search
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="card-body">
                        {isLoading ? <Loader/> :

                        <div className="table-responsive soft-landing">
                                <table className={"my-table table table-hover table-striped table-bordered"}>
                                    <thead>
                                        <tr>
                                            <th>SL</th>
                                            <th>Order Details</th>
                                            <th>Customer</th>
                                            <th>Amount</th>
                                            <th>Sales</th>
                                            <th>Date Time</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                      {orders.map((order, index)=>(
                                        <tr key={index}>
                                          <td className="align-middle">{startFrom + index}</td>
                                            <td className="align-middle">
                                              <p>Order Number: <strong>{order.order_number}</strong></p>
                                              <p>Order Status: {order.order_status_string}</p>
                                              <p>Payment Status: {order.payment_status}</p>
                                            </td>
                                            <td className="align-middle">
                                              <p>{order.customer_name}</p>
                                              <p>{order.customer_phone}</p>
                                            </td>
                                            <td className="align-middle">
                                              <p>Quantity: {order.quantity}</p>
                                              <p>Discount: {GlobalFunction.formatPrice(order.discount)}</p>
                                              <p>Total: {GlobalFunction.formatPrice(order.total)}</p>
                                              <p>Due Amount: {GlobalFunction.formatPrice(order.due_amount)}</p>
                                              <p>Paid Amount: {GlobalFunction.formatPrice(order.paid_amount)}</p>
                                            </td>
                                            <td className="align-middle">
                                            <p>Shop: {order.shop}</p>
                                              <p>Sales Manager: {order.sales_manager}</p>
                                            </td>
                                            <td className="align-middle">
                                              <p>{order.created_at}</p>
                                              <p>{order.updated_at}</p>
                                            </td>
                                            <td className="align-middle">
                                              <Link to={`/order/${order.id}`}><button className="btn btn-info btn-sm"><i className="fa-solid fa-eye" /></button></Link>
                                            </td>
                                        </tr>
                                      ))}
                                        
                                    </tbody>
                                </table>
                               
                            </div>
                        }

                        </div>
                        <div className="card-footer">
                            <nav className={"pagination-sm"}>
                                <Pagination
                                    activePage={activePage}
                                    itemsCountPerPage={itemsCountsPerPage}
                                    totalItemsCount={totalCountsPerPage}
                                    pageRangeDisplayed={5}
                                    onChange={getOrders}
                                    firstPageText={"First"}
                                    nextPageText={"Next"}
                                    prevPageText={"Previous"}
                                    lastPageText={"Last"}
                                    itemClass={"page-item"}
                                    linkClass={"page-link"}
                                />
                            </nav>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}


export default OrderList