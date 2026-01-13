import React, { useEffect, useState } from "react";
import Breadcrumb from "../../partoals/Breadcrumb";
import CardHeader from "../../partoals/miniComponents/CardHeader";
import axios from "axios";
import Swal from 'sweetalert2'
import Constants from "../../../Constants";
import CategoryPhotoModal from "../../partoals/modals/CategoryPhotoModal";
import Pagination from "react-js-pagination";
import { Link } from "react-router-dom";
import Loader from "../../partoals/miniComponents/Loader";
import NoDataFound from "../../partoals/miniComponents/NoDataFound";
import SupplierDetails from "./partials/SupplierDetails";

function SuppliersList() {
    const [input, setInput] = useState({
        order_by: 'created_at',
        per_page: 10,
        direction: 'desc',
        search: '',
    });

    const [itemsCountsPerPage, setItemsCountPerPage] = useState(0);
    const [totalCountsPerPage, setTotalCountPerPage] = useState(1);
    const [startFrom, setStartFrom] = useState(1);
    const [activePage, setActivePage] = useState(1);

    const [modalShow, setModalShow] = React.useState(false);
    const [modalPhotoShow, setModalPhotoShow] = React.useState(false);
    const [supplier, setSupplier] = useState([]);
    const [modalPhoto, setModalPhoto] = useState("");
    const [isLoading, setIsLoading] = useState(false)

    const [suppliers, setSuppliers] = useState([]);

    const handleInput = (e) => {
        setInput((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }));
    };

    const token = localStorage.getItem('token');

    const getSuppliers = React.useCallback((pageNumber = 1) => {
      setIsLoading(true);
      axios
        .get(`${Constants.BASE_URL}/supplier?page=${pageNumber}&search=${input.search}&order_by=${input.order_by}&per_page=${input.per_page}&direction=${input.direction}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          setSuppliers(res.data.data);
          setItemsCountPerPage(res.data.meta.per_page);
          setStartFrom(res.data.meta.from);
          setTotalCountPerPage(res.data.meta.total);
          setActivePage(res.data.meta.current_page);
          setIsLoading(false);
        });
    }, [input.search, input.order_by, input.per_page, input.direction, token]);
    
    const handlePhotoModal = (photo) => {
        setModalPhoto(photo);
        setModalPhotoShow(true);
    };
    const handleDetailsModal = (supplier) => {
        setSupplier(supplier);
        setModalShow(true);
    };
    const handleSupplierDelete = (id) => {
        const token = localStorage.getItem('token');
        Swal.fire({
            title: 'Are you sure?',
            text: "You want to delete the Supplier!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, DELETE IT!'
        }).then((result) => {
            if (result.isConfirmed) {
                axios.delete(`${Constants.BASE_URL}/supplier/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                }).then(res => {
                    getSuppliers()
                    Swal.fire({
                        position: 'top-end',
                        icon: res.data.cls,
                        title: res.data.msg,
                        showConfirmButton: false,
                        toast:true,
                        timer: 1500
                      })
                })
            }
        })
    };
    

    useEffect(() => {
        getSuppliers();
    }, [getSuppliers]);

    return (
        <>
            <Breadcrumb title={"Suppliers List"} />
            <div className="row">
                <div className="col-md-12">
                    <div className="card">
                        <div className="card-header">
                            <CardHeader
                                title={"Suppliers list"}
                                link={"/supplier/create"}
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
                                            placeholder={"Enter supplier Name"}
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
                                            <option value={"name"}>Name</option>
                                            <option value={"phone"}>Phone</option>
                                            <option value={"email"}>Email</option>
                                            <option value={"created_at"}>Created At</option>
                                            <option value={"updated_at"}>Updated At</option>
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
                                            onClick={() => getSuppliers(1)}
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
                                            <th>Name</th>
                                            <th>Phone / Email</th>
                                            <th>Status</th>
                                            <th>Logo</th>
                                            <th>Created By</th>
                                            <th>Date Time</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {Object.keys(suppliers).length > 0 ? suppliers.map((supplier, number) => (
                                            <tr key={number}>
                                                <td>{startFrom + number}</td>
                                                <td>{supplier.name}</td>
                                                <td>
                                                <p className={"text-theme"}>Phone: {supplier.phone}</p>
                                                <p className={"text-success"}>Email: {supplier.email}</p>
                                                </td>
                                                <td>{supplier.status}</td>
                                                <td>
                                                    <img
                                                        onClick={() =>
                                                            handlePhotoModal(supplier.logo_full)
                                                        }
                                                        src={supplier.logo}
                                                        alt={supplier.name}
                                                        className={"img-thumbnail table-image"}
                                                    />
                                                </td>
                                                <td>{supplier.created_by}</td>
                                                <td>
                                                    <p className={"text-theme"}>{supplier.created_at}</p>
                                                    <p className={"text-success"}>
                                                        {supplier.updated_at}
                                                    </p>
                                                </td>
                                                <td>
                                                    <button
                                                        onClick={() =>
                                                            handleDetailsModal(supplier)
                                                        }
                                                        className={"btn btn-sm my-1 btn-info"}><i className="fa-solid fa-eye"></i></button>
                                                    <Link to={`/supplier/edit/${supplier.id}`}><button className={"btn btn-sm my-1 mx-1 btn-warning"}><i className="fa-solid fa-pen-to-square"></i></button></Link>
                                                    <button onClick={() => handleSupplierDelete(supplier.id)} className={"btn btn-sm my-1 btn-danger"}><i className="fa-solid fa-trash"></i></button>
                                                </td>
                                            </tr>
                                        )): <NoDataFound/>}
                                    </tbody>
                                </table>
                                <CategoryPhotoModal
                                    show={modalPhotoShow}
                                    onHide={() => setModalPhotoShow(false)}
                                    title={"supplier logo"}
                                    size={""}
                                    photo={modalPhoto}
                                />
                                <SupplierDetails
                                    show={modalShow}
                                    onHide={() => setModalShow(false)}
                                    title={"supplier Details"}
                                    size={""}
                                    supplier={supplier}
                                />
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
                                    onChange={getSuppliers}
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

export default SuppliersList