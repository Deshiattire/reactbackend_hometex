import React, { useState } from 'react';
import { Modal } from 'react-bootstrap';
import axios from 'axios';
import Swal from 'sweetalert2';
import Constants from '../../../../Constants';

function RejectModal({ show, onHide, corporate, onSuccess }) {
    const [isLoading, setIsLoading] = useState(false);
    const [reason, setReason] = useState('');
    const [allowResubmission, setAllowResubmission] = useState(true);
    const [errors, setErrors] = useState({});

    const resetForm = () => {
        setReason('');
        setAllowResubmission(true);
        setErrors({});
        setIsLoading(false);
    };

    const handleModalHide = () => {
        resetForm();
        onHide();
    };

    const handleReject = () => {
        // Validation
        if (!reason.trim()) {
            setErrors({ reason: 'Rejection reason is required' });
            return;
        }

        Swal.fire({
            title: 'Confirm Rejection',
            html: `<div style="text-align: left;">
                <p><strong>Company:</strong> ${corporate.company_name}</p>
                <p><strong>Reason:</strong> ${reason}</p>
                <p class="text-danger mt-2">Are you sure you want to reject this corporate account?</p>
            </div>`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#dc3545',
            cancelButtonColor: '#6c757d',
            confirmButtonText: 'Yes, Reject',
            cancelButtonText: 'Cancel'
        }).then((result) => {
            if (result.isConfirmed) {
                setIsLoading(true);
                setErrors({});

                const token = localStorage.getItem('token');
                const requestData = {
                    rejection_reason: reason,  // API expects 'rejection_reason' not 'reason'
                    allow_resubmission: allowResubmission ? 1 : 0
                };
                
                console.log('Sending reject request:', requestData);
                
                const config = {
                    method: 'post',
                    url: `${Constants.BASE_URL}/corporate/${corporate.id}/reject`,
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    data: requestData
                };

                axios(config)
                    .then((res) => {
                        setIsLoading(false);
                        resetForm();
                        onHide();
                        
                        Swal.fire({
                            icon: 'success',
                            title: 'Rejected!',
                            text: res.data.message || 'Corporate account has been rejected.',
                            timer: 2000,
                            showConfirmButton: false
                        });
                        onSuccess();
                    })
                    .catch((error) => {
                        setIsLoading(false);
                        
                        console.log('Error Response:', error.response);
                        console.log('Error Data:', error.response?.data);
                        
                        if (error.response?.status === 422 && error.response?.data?.errors) {
                            const validationErrors = error.response.data.errors;
                            console.log('Validation Errors:', validationErrors);
                            const formErrors = {};
                            Object.keys(validationErrors).forEach(key => {
                                // Map API field names to form field names
                                const formFieldName = key === 'rejection_reason' ? 'reason' : key;
                                formErrors[formFieldName] = Array.isArray(validationErrors[key]) 
                                    ? validationErrors[key][0] 
                                    : validationErrors[key];
                            });
                            setErrors(formErrors);
                        } else if (error.response?.status !== 401) {
                            Swal.fire({
                                icon: 'error',
                                title: 'Error!',
                                text: error.response?.data?.message || 'Failed to reject account.',
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
            <Modal.Header closeButton className="border-0 pb-0" style={{background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'}}>
                <Modal.Title className="text-white">
                    Reject Corporate Account
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className="p-4">
                <div className="alert alert-warning mb-3" style={{borderRadius: '10px'}}>
                    <h6 className="mb-1 fw-bold">Important Notice</h6>
                    <p className="mb-0" style={{fontSize: '14px'}}>
                        Rejecting this account will notify the company and prevent them from accessing corporate features.
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
                                    Email
                                </label>
                                <p className="mb-0" style={{fontSize: '14px'}}>{corporate.email}</p>
                            </div>
                            <div className="col-md-12 mb-0">
                                <label className="text-muted mb-1" style={{fontSize: '12px', fontWeight: '600'}}>
                                    Submitted On
                                </label>
                                <p className="mb-0" style={{fontSize: '14px'}}>
                                    {corporate.created_at ? new Date(corporate.created_at).toLocaleDateString('en-US', { 
                                        year: 'numeric', 
                                        month: 'long', 
                                        day: 'numeric' 
                                    }) : 'N/A'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mb-3">
                    <label className="form-label fw-bold mb-2">
                        Reason for Rejection <span className="text-danger">*</span>
                    </label>
                    <textarea
                        className={`form-control ${errors.reason ? 'is-invalid' : ''}`}
                        rows="4"
                        placeholder="Please provide a detailed reason for rejecting this application..."
                        value={reason}
                        onChange={(e) => {
                            setReason(e.target.value);
                            setErrors({});
                        }}
                        disabled={isLoading}
                        style={{borderRadius: '8px'}}
                    />
                    {errors.reason && (
                        <div className="text-danger mt-1" style={{fontSize: '14px'}}>
                            {errors.reason}
                        </div>
                    )}
                    <small className="text-muted">
                        This reason will be sent to the applicant via email.
                    </small>
                </div>

                <div className="mb-3">
                    <div className="form-check">
                        <input
                            className="form-check-input"
                            type="checkbox"
                            id="allowResubmission"
                            checked={allowResubmission}
                            onChange={(e) => setAllowResubmission(e.target.checked)}
                            disabled={isLoading}
                        />
                        <label className="form-check-label" htmlFor="allowResubmission">
                            Allow resubmission of application
                        </label>
                    </div>
                    <small className="text-muted ms-4">
                        If checked, the company can submit a new application.
                    </small>
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
                    className="btn btn-danger px-4" 
                    onClick={handleReject}
                    disabled={isLoading}
                    style={{borderRadius: '8px', background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', border: 'none'}}
                >
                    {isLoading ? (
                        <>
                            <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                            Rejecting...
                        </>
                    ) : (
                        'Reject Account'
                    )}
                </button>
            </Modal.Footer>
        </Modal>
    );
}

export default RejectModal;
