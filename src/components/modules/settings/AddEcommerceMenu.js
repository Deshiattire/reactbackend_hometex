import React from 'react';
import { Link, redirect, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Breadcrumb from "../../partoals/Breadcrumb";
import CardHeader from "../../partoals/miniComponents/CardHeader";

const AddEcommerceMenu = () => {
    return (
        <>
            <Breadcrumb title={"Ecommerce Menu Add"} />
            <div className="row">
                <div className="col-md-12">
                <div className="card">
                    <div className="card-header">
                    <CardHeader
                        title={"Ecommerce Menu Add"}
                        link={"/ecommerce/menu-add"}
                        icon={"fa-plus"}
                        button_text={"Add"}
                    />
                    </div>
                    <div className="card-body">
                    <div className="row">
                        <div className="col-md-6">
                        
                        </div>
                        <div className="col-md-6">
                        
                        </div>
                        <div className="col-md-6">
                        
                        </div>
                        <div className="col-md-6">
                        
                        </div>
                        <div className="col-md-6">
                        
                        </div>
                        <div className="col-md-6">
                        
                        </div>
                        <div className="col-md-12">
                        
                        </div>
                    </div>
                    </div>
                </div>
                </div>
            </div>
        </>
    );
}

export default AddEcommerceMenu;
