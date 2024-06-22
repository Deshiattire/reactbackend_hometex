import React, { useEffect, useState } from 'react'
import axios from 'axios';
import Constants from "../../../Constants";
import Breadcrumb from "../../partoals/Breadcrumb";
import CardHeader from "../../partoals/miniComponents/CardHeader";

const Report = () => {
    const [report, setReport] = useState ([])

    const getReport = () => {
        const token = localStorage.getItem('token');
        axios.get(`${Constants.BASE_URL}/get-reports`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }).then(res => {
            setReport(res.data);
        });
    }

    useEffect(() => {
        getReport()
    }, []);
    return (
        <>
            <Breadcrumb title={"Report"} />
            <div className="row">
                <div className="col-md-12">
                    <div className="card">
                        <div className="card-header">
                            <CardHeader
                                title={"Report"}
                                link={"#"}
                                icon={"fa-list"}
                                button_text={"List"}
                                hide={true}
                            />
                        </div>
                        <div className='card-body'>
                            <div className='row'>
                                <div className='card'>
                                    <div className='card-header'>
                                        <h5>Sales (Branch)</h5>
                                    </div>
                                    <div className='card-body'>
                                        <div className='row'>
                                            <div className='col-md-3'>
                                                <div className='card report-card'>
                                                    <div className='card-body'>
                                                        <div className="d-flex align-items-center">
                                                            <div className="flex-shrink-0">
                                                                <i className="fa-solid fa-cart-shopping fa-2x"></i>
                                                            </div>
                                                            <div className="flex-grow-1 ms-3">
                                                                <h6>Total Sales</h6>
                                                                <h4>{report.total_sales}</h4>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='col-md-3'>
                                                <div className='card report-card'>
                                                    <div className='card-body'>
                                                        <div className="d-flex align-items-center">
                                                            <div className="flex-shrink-0">
                                                                <i className="fa-solid fa-cart-plus fa-2x"></i>
                                                            </div>
                                                            <div className="flex-grow-1 ms-3">
                                                                <h6>Total Purchase</h6>
                                                                <h4>{report.total_purchase}</h4>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='col-md-3'>
                                                <div className='card report-card'>
                                                    <div className='card-body'>
                                                        <div className="d-flex align-items-center">
                                                            <div className="flex-shrink-0">
                                                                <i className="fa-solid fa-hand-holding-dollar fa-2x"></i>
                                                            </div>
                                                            <div className="flex-grow-1 ms-3">
                                                                <h6>Today's Sale</h6>
                                                                <h4>{report.total_sales_today}</h4>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='col-md-3'>
                                                <div className='card report-card'>
                                                    <div className='card-body'>
                                                        <div className="d-flex align-items-center">
                                                            <div className="flex-shrink-0">
                                                                <i className="fa-solid fa-person-walking-arrow-loop-left fa-2x"></i>
                                                            </div>
                                                            <div className="flex-grow-1 ms-3">
                                                                <h6>Today's Purchase</h6>
                                                                <h4>{report.total_purchase_today}</h4>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className='card'>
                                    <div className='card-header'>
                                        <h5>Stock</h5>
                                    </div>
                                    <div className='card-body'>
                                        <div className='row'>
                                            <div className='col-md-3'>
                                                <div className='card report-card'>
                                                    <div className='card-body'>
                                                        <div className="d-flex align-items-center">
                                                            <div className="flex-shrink-0">
                                                                <i className="fa-solid fa-box-open fa-2x"></i>
                                                            </div>
                                                            <div className="flex-grow-1 ms-3">
                                                                <h6>Total Product</h6>
                                                                <h4>{report.total_product}</h4>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='col-md-3'>
                                                <div className='card report-card'>
                                                    <div className='card-body'>
                                                        <div className="d-flex align-items-center">
                                                            <div className="flex-shrink-0">
                                                                <i className="fa-solid fa-box fa-2x"></i>
                                                            </div>
                                                            <div className="flex-grow-1 ms-3">
                                                                <h6>Total Stock</h6>
                                                                <h4>{report.total_stock}</h4>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='col-md-3'>
                                                <div className='card report-card'>
                                                    <div className='card-body'>
                                                        <div className="d-flex align-items-center">
                                                            <div className="flex-shrink-0">
                                                                <i className="fa-solid fa-battery-quarter fa-2x"></i>
                                                            </div>
                                                            <div className="flex-grow-1 ms-3">
                                                                <h6>Total Low Stock</h6>
                                                                <h4>{report.low_stock}</h4>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='col-md-3'>
                                                <div className='card report-card'>
                                                    <div className='card-body'>
                                                        <div className="d-flex align-items-center">
                                                            <div className="flex-shrink-0">
                                                                <i className="fa-solid fa-dollar-sign fa-2x"></i>
                                                            </div>
                                                            <div className="flex-grow-1 ms-3">
                                                                <h6>Total Stock Value (Buy)</h6>
                                                                <h4>{report.buy_value}</h4>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='col-md-3 mt-4'>
                                                <div className='card report-card'>
                                                    <div className='card-body'>
                                                        <div className="d-flex align-items-center">
                                                            <div className="flex-shrink-0">
                                                                <i className="fa-solid fa-dollar-sign fa-2x"></i>
                                                            </div>
                                                            <div className="flex-grow-1 ms-3">
                                                                <h6>Total Stock Value (Sale Without Discount)</h6>
                                                                <h4>{report.sale_value}</h4>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='col-md-3 mt-4'>
                                                <div className='card report-card'>
                                                    <div className='card-body'>
                                                        <div className="d-flex align-items-center">
                                                            <div className="flex-shrink-0">
                                                                <i className="fa-solid fa-dollar-sign fa-2x"></i>
                                                            </div>
                                                            <div className="flex-grow-1 ms-3">
                                                                <h6>Possible Profit</h6>
                                                                <h4>{report.possible_profit}</h4>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className='card'>
                                    <div className='card-header'>
                                        <h5>Expense (Branch)</h5>
                                    </div>
                                    <div className='card-body'>
                                        <div className='row'>
                                            <div className='col-md-3'>
                                                <div className='card report-card'>
                                                    <div className='card-body'>
                                                        <div className="d-flex align-items-center">
                                                            <div className="flex-shrink-0">
                                                            <i className="fa-solid fa-hand-holding-dollar fa-2x"></i>
                                                            </div>
                                                            <div className="flex-grow-1 ms-3">
                                                                <h6>Total Expense</h6>
                                                                <h4>12,258</h4>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='col-md-3'>
                                                <div className='card report-card'>
                                                    <div className='card-body'>
                                                        <div className="d-flex align-items-center">
                                                            <div className="flex-shrink-0">
                                                            <i className="fa-solid fa-sack-dollar fa-2x"></i>
                                                            </div>
                                                            <div className="flex-grow-1 ms-3">
                                                                <h6>Total Expense Today</h6>
                                                                <h4>12,258</h4>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>                                            
                                        </div>
                                    </div>
                                </div>

                                <div className='card'>
                                    <div className='card-header'>
                                        <h5>Withdrawals (Branch)</h5>
                                    </div>
                                    <div className='card-body'>
                                        <div className='row'>
                                            <div className='col-md-3'>
                                                <div className='card report-card'>
                                                    <div className='card-body'>
                                                        <div className="d-flex align-items-center">
                                                            <div className="flex-shrink-0">
                                                            <i className="fa-solid fa-right-from-bracket fa-2x"></i>
                                                            </div>
                                                            <div className="flex-grow-1 ms-3">
                                                                <h6>Total Withdrawals</h6>
                                                                <h4>12,258</h4>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='col-md-3'>
                                                <div className='card report-card'>
                                                    <div className='card-body'>
                                                        <div className="d-flex align-items-center">
                                                            <div className="flex-shrink-0">
                                                            <i className="fa-solid fa-money-bill-transfer fa-2x"></i>
                                                            </div>
                                                            <div className="flex-grow-1 ms-3">
                                                                <h6>Total Withdrawals Today</h6>
                                                                <h4>12,258</h4>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>                                            
                                        </div>
                                    </div>
                                </div>

                                <div className='card'>
                                    <div className='card-header'>
                                        <h5>Profits</h5>
                                    </div>
                                    <div className='card-body'>
                                        <div className='row'>
                                            <div className='col-md-3'>
                                                <div className='card report-card'>
                                                    <div className='card-body'>
                                                        <div className="d-flex align-items-center">
                                                            <div className="flex-shrink-0">
                                                            <i className="fa-solid fa-arrow-trend-up fa-2x"></i>
                                                            </div>
                                                            <div className="flex-grow-1 ms-3">
                                                                <h6>Total Profits</h6>
                                                                <h4>12,258</h4>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='col-md-3'>
                                                <div className='card report-card'>
                                                    <div className='card-body'>
                                                        <div className="d-flex align-items-center">
                                                            <div className="flex-shrink-0">
                                                            <i className="fa-solid fa-chart-column fa-2x"></i>
                                                            </div>
                                                            <div className="flex-grow-1 ms-3">
                                                                <h6>Total Profits Today</h6>
                                                                <h4>12,258</h4>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>                                            
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>



        </>
    )
}

export default Report