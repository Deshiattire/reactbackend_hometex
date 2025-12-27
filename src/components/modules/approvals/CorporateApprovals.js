import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from 'sweetalert2';
import Constants from "../../../Constants";
import Pagination from "react-js-pagination";
import Loader from "../../partoals/miniComponents/Loader";
import NoDataFound from "../../partoals/miniComponents/NoDataFound";
import ApproveModal from "./modals/ApproveModal";
import RejectModal from "./modals/RejectModal";
import CreditTermsModal from "./modals/CreditTermsModal";

function CorporateApprovals() {
    const [input, setInput] = useState({
        order_by: 'created_at',
        per_page: 10,
        direction: 'desc',
        search: '',
        status: 'pending' // pending, approved, rejected, suspended, all
    });

    const [itemsCountsPerPage, setItemsCountPerPage] = useState(0);
    const [totalCountsPerPage, setTotalCountPerPage] = useState(1);
    const [startFrom, setStartFrom] = useState(1);
    const [activePage, setActivePage] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [corporates, setCorporates] = useState([]);
    const [selectedCorporate, setSelectedCorporate] = useState(null);

    // Modal states
    const [showApproveModal, setShowApproveModal] = useState(false);
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [showCreditTermsModal, setShowCreditTermsModal] = useState(false);

    const handleInput = (e) => {
        setInput((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }));
    };

    const getCorporates = (pageNumber = 1) => {
        setIsLoading(true);
        setCorporates([]);

        const token = localStorage.getItem('token');
        const endpoint = input.status === 'pending' ? '/corporate/pending' : '/corporate';
        let url = `${Constants.BASE_URL}${endpoint}?page=${pageNumber}&per_page=${input.per_page}`;
        
        if (input.status !== 'pending' && input.status !== 'all' && endpoint === '/corporate') {
            url += `&status=${input.status}`;
        }

        const config = {
            method: 'get',
            url: url,
            headers: {
                'Authorization': `Bearer ${token}`
            }
        };

        axios(config)
            .then((res) => {
                console.log('API Response:', res.data);
                
                // Handle different response structures
                if (res.data.success) {
                    // Check if data is directly an array or nested
                    const corporateList = Array.isArray(res.data.data) 
                        ? res.data.data 
                        : (res.data.data?.data || []);
                    
                    const pagination = res.data.pagination || res.data.data?.pagination || {};
                    
                    console.log('Corporate List:', corporateList);
                    console.log('Pagination:', pagination);
                    
                    setCorporates(corporateList);
                    setItemsCountPerPage(pagination.per_page || input.per_page);
                    setStartFrom(((pagination.current_page || 1) - 1) * (pagination.per_page || input.per_page) + 1);
                    setTotalCountPerPage(pagination.total || corporateList.length);
                    setActivePage(pagination.current_page || 1);
                } else {
                    console.log('API returned success: false');
                    Swal.fire({
                        icon: 'error',
                        title: 'Error!',
                        text: res.data.message || 'Failed to fetch corporate accounts.'
                    });
                }
                setIsLoading(false);
            })
            .catch((error) => {
                console.error('API Error:', error);
                if (error.response?.status !== 401) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error!',
                        text: error.response?.data?.message || 'Failed to fetch corporate accounts.'
                    });
                }
                setIsLoading(false);
            });
    };

    const handleAction = (corporate, action) => {
        setSelectedCorporate(corporate);
        
        switch(action) {
            case 'approve':
                setShowApproveModal(true);
                break;
            case 'reject':
                setShowRejectModal(true);
                break;
            case 'suspend':
                handleSuspend(corporate);
                break;
            case 'reactivate':
                handleReactivate(corporate);
                break;
            case 'creditTerms':
                setShowCreditTermsModal(true);
                break;
            default:
                break;
        }
    };

    const handleSuspend = (corporate) => {
        Swal.fire({
            title: 'Suspend Corporate Account?',
            html: `Are you sure you want to suspend <strong>${corporate.company_name}</strong>?<br/>This will immediately restrict their access.`,
            input: 'textarea',
            inputLabel: 'Suspension Reason (Required)',
            inputPlaceholder: 'Enter reason for suspension...',
            inputAttributes: {
                'aria-label': 'Enter reason for suspension'
            },
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#6c757d',
            confirmButtonText: 'Yes, Suspend',
            cancelButtonText: 'Cancel',
            inputValidator: (value) => {
                if (!value) {
                    return 'You need to provide a suspension reason!';
                }
            }
        }).then((result) => {
            if (result.isConfirmed) {
                const token = localStorage.getItem('token');
                const config = {
                    method: 'post',
                    url: `${Constants.BASE_URL}/corporate/${corporate.id}/suspend`,
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    data: { suspension_reason: result.value }
                };

                axios(config)
                    .then((res) => {
                        Swal.fire({
                            icon: 'success',
                            title: 'Suspended!',
                            text: res.data.message || 'Corporate account has been suspended.',
                            timer: 2000
                        });
                        getCorporates(activePage);
                    })
                    .catch((error) => {
                        if (error.response?.status !== 401) {
                            Swal.fire({
                                icon: 'error',
                                title: 'Error!',
                                text: error.response?.data?.message || 'Failed to suspend account.'
                            });
                        }
                    });
            }
        });
    };

    const handleReactivate = (corporate) => {
        Swal.fire({
            title: 'Reactivate Corporate Account?',
            html: `Are you sure you want to reactivate <strong>${corporate.company_name}</strong>?`,
            input: 'textarea',
            inputLabel: 'Reactivation Notes (Optional)',
            inputPlaceholder: 'Add any notes about the reactivation...',
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#28a745',
            cancelButtonColor: '#6c757d',
            confirmButtonText: 'Yes, Reactivate',
            cancelButtonText: 'Cancel'
        }).then((result) => {
            if (result.isConfirmed) {
                const token = localStorage.getItem('token');
                const config = {
                    method: 'post',
                    url: `${Constants.BASE_URL}/corporate/${corporate.id}/reactivate`,
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    data: { notes: result.value || '' }
                };

                axios(config)
                    .then((res) => {
                        Swal.fire({
                            icon: 'success',
                            title: 'Reactivated!',
                            text: res.data.message || 'Corporate account has been reactivated.',
                            timer: 2000
                        });
                        getCorporates(activePage);
                    })
                    .catch((error) => {
                        if (error.response?.status !== 401) {
                            Swal.fire({
                                icon: 'error',
                                title: 'Error!',
                                text: error.response?.data?.message || 'Failed to reactivate account.'
                            });
                        }
                    });
            }
        });
    };

    const getStatusBadge = (status) => {
        const statusConfig = {
            pending: { color: 'warning', icon: 'clock', text: 'Pending' },
            active: { color: 'success', icon: 'check-circle', text: 'Active' },
            approved: { color: 'success', icon: 'check-circle', text: 'Approved' },
            rejected: { color: 'danger', icon: 'times-circle', text: 'Rejected' },
            suspended: { color: 'dark', icon: 'ban', text: 'Suspended' }
        };

        const config = statusConfig[status] || statusConfig.pending;
        
        return (
            <span className={`badge bg-${config.color} d-inline-flex align-items-center`} 
                  style={{padding: '6px 12px', fontSize: '12px', fontWeight: '500'}}>
                <i className={`fas fa-${config.icon} me-1`}></i>
                {config.text}
            </span>
        );
    };

    useEffect(() => {
        getCorporates();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [input.status, input.per_page]);

    return (
        <>
            <div className="p-4">
                {/* Filters Section */}
                <div className="row mb-4">
                    <div className="col-md-3">
                        <div className="form-group">
                            <label className="form-label fw-bold" style={{fontSize: '13px', color: '#495057'}}>
                                <i className="fas fa-filter me-2"></i>Status Filter
                            </label>
                            <select
                                className="form-select form-select-sm shadow-sm"
                                name="status"
                                value={input.status}
                                onChange={handleInput}
                                style={{borderRadius: '8px', border: '1px solid #e0e0e0'}}
                            >
                                <option value="pending">Pending Approvals</option>
                                <option value="active">Active</option>
                                <option value="rejected">Rejected</option>
                                <option value="suspended">Suspended</option>
                                <option value="all">All Status</option>
                            </select>
                        </div>
                    </div>

                    <div className="col-md-3">
                        <div className="form-group">
                            <label className="form-label fw-bold" style={{fontSize: '13px', color: '#495057'}}>
                                <i className="fas fa-sort me-2"></i>Order By
                            </label>
                            <select
                                className="form-select form-select-sm shadow-sm"
                                name="order_by"
                                value={input.order_by}
                                onChange={handleInput}
                                style={{borderRadius: '8px', border: '1px solid #e0e0e0'}}
                            >
                                <option value="created_at">Date Created</option>
                                <option value="name">Company Name</option>
                                <option value="credit_limit">Credit Limit</option>
                            </select>
                        </div>
                    </div>

                    <div className="col-md-2">
                        <div className="form-group">
                            <label className="form-label fw-bold" style={{fontSize: '13px', color: '#495057'}}>
                                <i className="fas fa-list me-2"></i>Per Page
                            </label>
                            <select
                                className="form-select form-select-sm shadow-sm"
                                name="per_page"
                                value={input.per_page}
                                onChange={handleInput}
                                style={{borderRadius: '8px', border: '1px solid #e0e0e0'}}
                            >
                                <option value="10">10</option>
                                <option value="25">25</option>
                                <option value="50">50</option>
                                <option value="100">100</option>
                            </select>
                        </div>
                    </div>

                    <div className="col-md-4">
                        <div className="form-group">
                            <label className="form-label fw-bold" style={{fontSize: '13px', color: '#495057'}}>
                                <i className="fas fa-search me-2"></i>Search
                            </label>
                            <div className="input-group shadow-sm" style={{borderRadius: '8px'}}>
                                <input
                                    type="text"
                                    className="form-control form-control-sm"
                                    placeholder="Search by company name, email, contact..."
                                    name="search"
                                    value={input.search}
                                    onChange={handleInput}
                                    style={{border: '1px solid #e0e0e0', borderRadius: '8px 0 0 8px'}}
                                />
                                <button
                                    className="btn btn-sm btn-primary"
                                    onClick={() => getCorporates(1)}
                                    style={{borderRadius: '0 8px 8px 0', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', border: 'none'}}
                                >
                                    <i className="fas fa-search"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="row mb-4">
                    <div className="col-md-3">
                        <div className="card border-0 shadow-sm" style={{borderLeft: '4px solid #ffc107'}}>
                            <div className="card-body">
                                <div className="d-flex justify-content-between align-items-center">
                                    <div>
                                        <p className="mb-1 text-muted" style={{fontSize: '12px'}}>Pending</p>
                                        <h4 className="mb-0 fw-bold">{totalCountsPerPage}</h4>
                                    </div>
                                    <div className="text-warning" style={{fontSize: '2rem', opacity: 0.3}}>
                                        <i className="fas fa-clock"></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Table Section */}
                <div className="card border-0 shadow-sm" style={{borderRadius: '12px'}}>
                    <div className="card-body p-0">
                        {isLoading ? (
                            <Loader />
                        ) : (
                            <>
                                {corporates.length > 0 ? (
                                    <div className="table-responsive">
                                        <table className="table table-hover mb-0" style={{fontSize: '14px'}}>
                                            <thead style={{background: '#f8f9fa', borderBottom: '2px solid #e9ecef'}}>
                                                <tr>
                                                    <th className="py-3 px-4" style={{fontWeight: '600', color: '#495057'}}>
                                                        <i className="fas fa-building me-2"></i>Company
                                                    </th>
                                                    <th className="py-3 px-4" style={{fontWeight: '600', color: '#495057'}}>
                                                        <i className="fas fa-user me-2"></i>Contact Person
                                                    </th>
                                                    <th className="py-3 px-4" style={{fontWeight: '600', color: '#495057'}}>
                                                        <i className="fas fa-envelope me-2"></i>Email
                                                    </th>
                                                    <th className="py-3 px-4" style={{fontWeight: '600', color: '#495057'}}>
                                                        <i className="fas fa-phone me-2"></i>Phone
                                                    </th>
                                                    <th className="py-3 px-4" style={{fontWeight: '600', color: '#495057'}}>
                                                        <i className="fas fa-credit-card me-2"></i>Credit Limit
                                                    </th>
                                                    <th className="py-3 px-4" style={{fontWeight: '600', color: '#495057'}}>
                                                        <i className="fas fa-info-circle me-2"></i>Status
                                                    </th>
                                                    <th className="py-3 px-4 text-center" style={{fontWeight: '600', color: '#495057'}}>
                                                        <i className="fas fa-cogs me-2"></i>Actions
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {corporates.map((corporate, index) => (
                                                    <tr key={corporate.id} className="border-bottom" style={{transition: 'all 0.2s'}}>
                                                        <td className="py-3 px-4">
                                                            <div className="d-flex align-items-center">
                                                                <div className="bg-primary bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center me-2" 
                                                                     style={{width: '40px', height: '40px'}}>
                                                                    <i className="fas fa-building text-primary"></i>
                                                                </div>
                                                                <div>
                                                                    <div className="fw-bold" style={{color: '#212529'}}>{corporate.company_name}</div>
                                                                    <small className="text-muted">{corporate.trade_license || 'N/A'}</small>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="py-3 px-4">{corporate.contact_person?.name || 'N/A'}</td>
                                                        <td className="py-3 px-4">
                                                            <i className="fas fa-envelope text-muted me-2"></i>
                                                            {corporate.email}
                                                        </td>
                                                        <td className="py-3 px-4">
                                                            <i className="fas fa-phone text-muted me-2"></i>
                                                            {corporate.phone || 'N/A'}
                                                        </td>
                                                        <td className="py-3 px-4">
                                                            <span className="badge bg-info bg-opacity-10 text-info fw-bold" style={{fontSize: '13px'}}>
                                                                ${(corporate.credit_limit || 0).toLocaleString()}
                                                            </span>
                                                        </td>
                                                        <td className="py-3 px-4">
                                                            {getStatusBadge(corporate.status)}
                                                        </td>
                                                        <td className="py-3 px-4">
                                                            <div className="d-flex gap-2 justify-content-center">
                                                                {corporate.status === 'pending' && (
                                                                    <>
                                                                        <button
                                                                            className="btn btn-sm d-flex align-items-center gap-1"
                                                                            onClick={() => handleAction(corporate, 'approve')}
                                                                            title="Approve Account"
                                                                            style={{
                                                                                borderRadius: '8px',
                                                                                padding: '8px 16px',
                                                                                fontWeight: '500',
                                                                                transition: 'all 0.3s ease',
                                                                                border: 'none',
                                                                                background: '#28a745',
                                                                                color: 'white',
                                                                                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                                                                            }}
                                                                            onMouseEnter={(e) => {
                                                                                e.currentTarget.style.transform = 'translateY(-2px)';
                                                                                e.currentTarget.style.boxShadow = '0 4px 12px rgba(40, 167, 69, 0.4)';
                                                                            }}
                                                                            onMouseLeave={(e) => {
                                                                                e.currentTarget.style.transform = 'translateY(0)';
                                                                                e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
                                                                            }}
                                                                        >
                                                                            <i className="fas fa-check-circle"></i>
                                                                            <span>Approve</span>
                                                                        </button>
                                                                        <button
                                                                            className="btn btn-sm d-flex align-items-center gap-1"
                                                                            onClick={() => handleAction(corporate, 'reject')}
                                                                            title="Reject Account"
                                                                            style={{
                                                                                borderRadius: '8px',
                                                                                padding: '8px 16px',
                                                                                fontWeight: '500',
                                                                                transition: 'all 0.3s ease',
                                                                                border: 'none',
                                                                                background: '#dc3545',
                                                                                color: 'white',
                                                                                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                                                                            }}
                                                                            onMouseEnter={(e) => {
                                                                                e.currentTarget.style.transform = 'translateY(-2px)';
                                                                                e.currentTarget.style.boxShadow = '0 4px 12px rgba(220, 53, 69, 0.4)';
                                                                            }}
                                                                            onMouseLeave={(e) => {
                                                                                e.currentTarget.style.transform = 'translateY(0)';
                                                                                e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
                                                                            }}
                                                                        >
                                                                            <i className="fas fa-times-circle"></i>
                                                                            <span>Reject</span>
                                                                        </button>
                                                                    </>
                                                                )}
                                                                {(corporate.status === 'approved' || corporate.status === 'active') && (
                                                                    <>
                                                                        <button
                                                                            className="btn btn-sm d-flex align-items-center gap-1"
                                                                            onClick={() => handleAction(corporate, 'creditTerms')}
                                                                            title="Update Credit Terms"
                                                                            style={{
                                                                                borderRadius: '8px',
                                                                                padding: '8px 16px',
                                                                                fontWeight: '500',
                                                                                transition: 'all 0.3s ease',
                                                                                border: 'none',
                                                                                background: '#007bff',
                                                                                color: 'white',
                                                                                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                                                                            }}
                                                                            onMouseEnter={(e) => {
                                                                                e.currentTarget.style.transform = 'translateY(-2px)';
                                                                                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 123, 255, 0.4)';
                                                                            }}
                                                                            onMouseLeave={(e) => {
                                                                                e.currentTarget.style.transform = 'translateY(0)';
                                                                                e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
                                                                            }}
                                                                        >
                                                                            <i className="fas fa-dollar-sign"></i>
                                                                            <span>Credit</span>
                                                                        </button>
                                                                        <button
                                                                            className="btn btn-sm d-flex align-items-center gap-1"
                                                                            onClick={() => handleAction(corporate, 'suspend')}
                                                                            title="Suspend Account"
                                                                            style={{
                                                                                borderRadius: '8px',
                                                                                padding: '8px 16px',
                                                                                fontWeight: '500',
                                                                                transition: 'all 0.3s ease',
                                                                                border: 'none',
                                                                                background: '#fd7e14',
                                                                                color: 'white',
                                                                                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                                                                            }}
                                                                            onMouseEnter={(e) => {
                                                                                e.currentTarget.style.transform = 'translateY(-2px)';
                                                                                e.currentTarget.style.boxShadow = '0 4px 12px rgba(253, 126, 20, 0.4)';
                                                                            }}
                                                                            onMouseLeave={(e) => {
                                                                                e.currentTarget.style.transform = 'translateY(0)';
                                                                                e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
                                                                            }}
                                                                        >
                                                                            <i className="fas fa-pause-circle"></i>
                                                                            <span>Suspend</span>
                                                                        </button>
                                                                    </>
                                                                )}
                                                                {corporate.status === 'suspended' && (
                                                                    <button
                                                                        className="btn btn-sm d-flex align-items-center gap-1"
                                                                        onClick={() => handleAction(corporate, 'reactivate')}
                                                                        title="Reactivate Account"
                                                                        style={{
                                                                            borderRadius: '8px',
                                                                            padding: '8px 16px',
                                                                            fontWeight: '500',
                                                                            transition: 'all 0.3s ease',
                                                                            border: 'none',
                                                                            background: '#17a2b8',
                                                                            color: 'white',
                                                                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                                                                        }}
                                                                        onMouseEnter={(e) => {
                                                                            e.currentTarget.style.transform = 'translateY(-2px)';
                                                                            e.currentTarget.style.boxShadow = '0 4px 12px rgba(23, 162, 184, 0.4)';
                                                                        }}
                                                                        onMouseLeave={(e) => {
                                                                            e.currentTarget.style.transform = 'translateY(0)';
                                                                            e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
                                                                        }}
                                                                    >
                                                                        <i className="fas fa-play-circle"></i>
                                                                        <span>Reactivate</span>
                                                                    </button>
                                                                )}
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <NoDataFound />
                                )}
                            </>
                        )}
                    </div>

                    {/* Pagination */}
                    {corporates.length > 0 && (
                        <div className="card-footer bg-white border-top-0 py-3">
                            <div className="d-flex justify-content-between align-items-center">
                                <p className="mb-0 text-muted" style={{fontSize: '14px'}}>
                                    Showing {startFrom} to {startFrom + corporates.length - 1} of {totalCountsPerPage} entries
                                </p>
                                <Pagination
                                    activePage={activePage}
                                    itemsCountPerPage={itemsCountsPerPage}
                                    totalItemsCount={totalCountsPerPage}
                                    pageRangeDisplayed={5}
                                    onChange={getCorporates}
                                    itemClass="page-item"
                                    linkClass="page-link"
                                    firstPageText="First"
                                    lastPageText="Last"
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Modals */}
            {showApproveModal && (
                <ApproveModal
                    show={showApproveModal}
                    onHide={() => setShowApproveModal(false)}
                    corporate={selectedCorporate}
                    onSuccess={() => {
                        setShowApproveModal(false);
                        getCorporates(activePage);
                    }}
                />
            )}

            {showRejectModal && (
                <RejectModal
                    show={showRejectModal}
                    onHide={() => setShowRejectModal(false)}
                    corporate={selectedCorporate}
                    onSuccess={() => {
                        setShowRejectModal(false);
                        getCorporates(activePage);
                    }}
                />
            )}

            {showCreditTermsModal && (
                <CreditTermsModal
                    show={showCreditTermsModal}
                    onHide={() => setShowCreditTermsModal(false)}
                    corporate={selectedCorporate}
                    onSuccess={() => {
                        setShowCreditTermsModal(false);
                        getCorporates(activePage);
                    }}
                />
            )}
        </>
    );
}

export default CorporateApprovals;
