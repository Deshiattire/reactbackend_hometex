import React, { useEffect, useState } from 'react';
import { Link, redirect, useNavigate, useParams } from "react-router-dom";
import Constants from "../../../Constants";
import axios from "axios";
import Breadcrumb from "../../partoals/Breadcrumb";
import CardHeader from "../../partoals/miniComponents/CardHeader";
import NoDataFound from '../../partoals/miniComponents/NoDataFound';

const EcommerceMenuList = () => {
    const [isLoading, setIsLoading] = useState(false)
    const [menuData, setMenuData] = useState([]);

    const menuList = () => {
        const token = localStorage.getItem('token');
        const config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: `${Constants.BASE_URL}/product-menu-list`,
            headers: { 
                'Authorization': `Bearer ${token}`
            }
        };
    
        setIsLoading(true);
    
        axios.request(config)
            .then((res) => {
                console.log(res.data);
                setMenuData(res?.data?.data);
                setIsLoading(false);
            })
            .catch((error) => {
                console.error(error);
                setIsLoading(false);
            });
    };

    useEffect(()=>{
        menuList();
    }, []);

    return (
        <>
            <Breadcrumb title={"Ecommerce Menu List"} />
            <div className="row">
                <div className="col-md-12">
                <div className="card">
                    <div className="card-header">
                    <CardHeader
                        title={"Ecommerce Menu List"}
                        link={"/ecommerce/menu-add"}
                        icon={"fa-plus"}
                        button_text={"Add"}
                    />
                    </div>
                    <div className="card-body">
                        <div className="table-responsive soft-landing">
                            <table className={"my-table table table-hover table-striped table-bordered"}>
                                <thead>
                                    <tr>
                                        <th>SL</th>
                                        <th>name</th>
                                    </tr>
                                </thead>
                                <tbody>
                                {Object.keys(menuData).length > 0 ? menuData.map((m, number) => (
                                    <tr key={number}>
                                        <td>{m?.name}</td>
                                        <td>{number}</td>
                                    </tr>
                                )): <NoDataFound/>}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                </div>
            </div>
        </>
    );
}

export default EcommerceMenuList;
