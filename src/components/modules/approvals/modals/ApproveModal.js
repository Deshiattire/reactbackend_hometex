import React, { useState, useEffect } from 'react';
import { Modal } from 'react-bootstrap';
import axios from 'axios';
import Swal from 'sweetalert2';
import Constants from '../../../../Constants';

function ApproveModal({ show, onHide, corporate, onSuccess }) {
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        initial_credit_limit: 50000,
        payment_terms: 'net_30',
        notes: ''
    });
    const [errors, setErrors] = useState({});
    const [paymentTermsOptions, setPaymentTermsOptions] = useState([]);

    useEffect(() => {
        // Fetch payment terms options
        axios.get(`${Constants.BASE_URL}/corporate/payment-terms-options`)
            .then((res) => {
                if (res.data.success && res.data.data) {
                    setPaymentTermsOptions(res.data.data);
                }
            })
            .catch((error) => {
                console.error('Failed to fetch payment terms:', error);
                // Fallback options
                setPaymentTermsOptions([
                    { value: 'prepaid', label: 'Prepaid' },
                    { value: 'net_15', label: 'Net 15 Days' },
                    { value: 'net_30', label: 'Net 30 Days' },
                    { value: 'net_45', label: 'Net 45 Days' },
                    { value: 'net_60', label: 'Net 60 Days' }
                ]);
            });
    }, []);

    const resetForm = () => {
        setFormData({
            initial_credit_limit: 50000,
            payment_terms: 'net_30',
            notes: ''
        });
        setErrors({});
        setIsLoading(false);
    };

    const handleModalHide = () => {
        resetForm();
        onHide();
    };

    const handleInput = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setErrors({});
    };

    const handleApprove = () => {
        Swal.fire({
            title: 'Confirm Approval',
            html: `<div style="text-align: left;">
                <p><strong>Company:</strong> ${corporate.company_name}</p>
                <p><strong>Credit Limit:</strong> $${formData.initial_credit_limit.toLocaleString()}</p>
                <p><strong>Payment Terms:</strong> ${paymentTermsOptions.find(opt => opt.value === formData.payment_terms)?.label || formData.payment_terms}</p>
                <p class="text-muted mt-2">Are you sure you want to approve this corporate account?</p>
            </div>`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#667eea',
            cancelButtonColor: '#6c757d',
            confirmButtonText: 'Yes, Approve',
            cancelButtonText: 'Cancel'
        }).then((result) => {
            if (result.isConfirmed) {
                setIsLoading(true);

                const token = localStorage.getItem('token');
                const config = {
                    method: 'post',
                    url: `${Constants.BASE_URL}/corporate/${corporate.id}/approve`,
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    data: formData
                };

                axios(config)
                    .then((res) => {
                        setIsLoading(false);
                        resetForm();
                        onHide();
                        
                        Swal.fire({
                            icon: 'success',
                            title: 'Approved!',
                            text: res.data.message || 'Corporate account approved successfully!',
                            timer: 2000,
                            showConfirmButton: false
                        });
                        onSuccess();
                    })
                    .catch((error) => {
                        setIsLoading(false);
                        
                        if (error.response?.status === 422 && error.response?.data?.errors) {
                            const validationErrors = error.response.data.errors;
                            const formErrors = {};
                            Object.keys(validationErrors).forEach(key => {
                                formErrors[key] = Array.isArray(validationErrors[key]) 
                                    ? validationErrors[key][0] 
                                    : validationErrors[key];
                            });
                            setErrors(formErrors);
                        } else if (error.response?.status !== 401) {
                            Swal.fire({
                                icon: 'error',
                                title: 'Error!',
                                text: error.response?.data?.message || 'Failed to approve account.',
                                confirmButtonText: 'OK'
                            });
                        }
                    });
            }
        });
    };

    if (!corporate) return null;

    return (
        <Modal show={show} onHide={handleModalHide} centered size="lg" animation={false}>
            <Modal.Header closeButton className="border-0 pb-0" style={{background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'}}>
                <Modal.Title className="text-white">
                    Approve Corporate Account
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className="p-4">
                <div className="alert alert-info mb-3" style={{borderRadius: '10px'}}>
                    <h6 className="mb-1 fw-bold">Review Account Details</h6>
                    <p className="mb-0" style={{fontSize: '14px'}}>
                        You are about to approve the corporate account. Please review the information before proceeding.
                    </p>
                </div>

                <div className="card border-0 shadow-sm mb-3" style={{borderRadius: '10px', background: '#f8f9fa'}}>
                    <div className="card-body">
                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <label className="text-muted mb-1" style={{fontSize: '12px', fontWeight: '600'}}>
                                    Company Name
                                </label>
                                <p className="mb-0 fw-bold" style={{fontSize: '15px'}}>{corporate.company_name}</p>
                            </div>
                            <div className="col-md-6 mb-3">
                                <label className="text-muted mb-1" style={{fontSize: '12px', fontWeight: '600'}}>
                                    Contact Person
                                </label>
                                <p className="mb-0" style={{fontSize: '14px'}}>{corporate.contact_person_name || 'N/A'}</p>
                            </div>
                            <div className="col-md-6 mb-0">
                                <label className="text-muted mb-1" style={{fontSize: '12px', fontWeight: '600'}}>
                                    Email
                                </label>
                                <p className="mb-0" style={{fontSize: '14px'}}>{corporate.email}</p>
                            </div>
                            <div className="col-md-6 mb-0">
                                <label className="text-muted mb-1" style={{fontSize: '12px', fontWeight: '600'}}>
                                    Phone
                                </label>
                                <p className="mb-0" style={{fontSize: '14px'}}>{corporate.phone || 'N/A'}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mb-3">
                    <label className="form-label fw-bold mb-2">
                        Initial Credit Limit ($)
                    </label>
                    <input
                        type="number"
                        name="initial_credit_limit"
                        className={`form-control ${errors.initial_credit_limit ? 'is-invalid' : ''}`}
                        value={formData.initial_credit_limit}
                        onChange={handleInput}
                        disabled={isLoading}
                        min="0"
                        step="1000"
                        style={{borderRadius: '8px'}}
                    />
                    {errors.initial_credit_limit && (
                        <div className="text-danger mt-1" style={{fontSize: '14px'}}>
                            {errors.initial_credit_limit}
                        </div>
                    )}
                </div>

                <div className="mb-3">
                    <label className="form-label fw-bold mb-2">
                        Payment Terms
                    </label>
                    <select
                        name="payment_terms"
                        className={`form-select ${errors.payment_terms ? 'is-invalid' : ''}`}
                        value={formData.payment_terms}
                        onChange={handleInput}
                        disabled={isLoading}
                        style={{borderRadius: '8px'}}
                    >
                        {paymentTermsOptions.map(option => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                    {errors.payment_terms && (
                        <div className="text-danger mt-1" style={{fontSize: '14px'}}>
                            {errors.payment_terms}
                        </div>
                    )}
                    <small className="text-muted">Select payment terms for this account</small>
                </div>

                <div className="mb-3">
                    <label className="form-label fw-bold mb-2">
                        Approval Notes (Optional)
                    </label>
                    <textarea
                        name="notes"
                        className="form-control"
                        rows="3"
                        value={formData.notes}
                        onChange={handleInput}
                        disabled={isLoading}
                        placeholder="Add any notes or special instructions..."
                        style={{borderRadius: '8px'}}
                    />
                </div>
            </Modal.Body>
            <Modal.Footer className="border-0 pt-0">
                <button 
                    className="btn btn-secondary px-4" 
                    onClick={handleModalHide}
                    disabled={isLoading}
                    style={{borderRadius: '8px'}}
                >
                    Cancel
                </button>
                <button 
                    className="btn btn-success px-4" 
                    onClick={handleApprove}
                    disabled={isLoading}
                    style={{borderRadius: '8px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', border: 'none'}}
                >
                    {isLoading ? (
                        <>
                            <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                            Approving...
                        </>
                    ) : (
                        'Approve Account'
                    )}
                </button>
            </Modal.Footer>
        </Modal>
    );
}

export default ApproveModal;
