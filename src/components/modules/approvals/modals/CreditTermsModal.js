import React, { useState, useEffect } from 'react';
import { Modal, Alert } from 'react-bootstrap';
import axios from 'axios';
import Constants from '../../../../Constants';

function CreditTermsModal({ show, onHide, corporate, onSuccess }) {
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        credit_limit: corporate?.credit_limit || 0,
        payment_terms: corporate?.payment_terms || 'net_30',
        notes: ''
    });
    const [errors, setErrors] = useState({});
    const [successMessage, setSuccessMessage] = useState('');
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
            credit_limit: corporate?.credit_limit || 0,
            payment_terms: corporate?.payment_terms || 'net_30',
            notes: ''
        });
        setErrors({});
        setSuccessMessage('');
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

    const handleUpdate = () => {
        setIsLoading(true);

        const token = localStorage.getItem('token');
        const config = {
            method: 'put',
            url: `${Constants.BASE_URL}/corporate/${corporate.id}/credit-terms`,
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            data: formData
        };

        axios(config)
            .then((res) => {
                setSuccessMessage(res.data.message || 'Credit terms updated successfully!');
                setTimeout(() => {
                    setIsLoading(false);
                    resetForm();
                    onHide();
                    onSuccess();
                }, 1500);
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
                    setErrors({ general: error.response?.data?.message || 'Failed to update credit terms.' });
                }
            });
    };

    if (!corporate) return null;

    return (
        <Modal show={show} onHide={handleModalHide} centered size="lg" animation={false}>
            <Modal.Header closeButton className="border-0 pb-0" style={{background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'}}>
                <Modal.Title className="text-white">
                    Update Credit Terms
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className="p-4">
                {successMessage && (
                    <Alert variant="success" className="mb-3">
                        {successMessage}
                    </Alert>
                )}
                {errors.general && (
                    <Alert variant="danger" className="mb-3">
                        {errors.general}
                    </Alert>
                )}
                
                <div className="alert alert-info mb-3" style={{borderRadius: '10px'}}>
                    <h6 className="mb-1 fw-bold">Update Credit Information</h6>
                    <p className="mb-0" style={{fontSize: '14px'}}>
                        Configure the credit terms and limits for {corporate.company_name}
                    </p>
                </div>

                <div className="mb-3">
                    <label className="form-label fw-bold mb-2">
                        Credit Limit ($)
                    </label>
                    <input
                        type="number"
                        name="credit_limit"
                        className={`form-control ${errors.credit_limit ? 'is-invalid' : ''}`}
                        value={formData.credit_limit}
                        onChange={handleInput}
                        disabled={isLoading}
                        min="0"
                        step="1000"
                        style={{borderRadius: '8px'}}
                    />
                    {errors.credit_limit && (
                        <div className="text-danger mt-1" style={{fontSize: '14px'}}>
                            {errors.credit_limit}
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
                        Notes (Optional)
                    </label>
                    <textarea
                        name="notes"
                        className="form-control"
                        rows="3"
                        value={formData.notes}
                        onChange={handleInput}
                        disabled={isLoading}
                        placeholder="Add any notes or explanations for this update..."
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
                    className="btn btn-primary px-4" 
                    onClick={handleUpdate}
                    disabled={isLoading}
                    style={{borderRadius: '8px', background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', border: 'none'}}
                >
                    {isLoading ? (
                        <>
                            <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                            Updating...
                        </>
                    ) : (
                        'Update Terms'
                    )}
                </button>
            </Modal.Footer>
        </Modal>
    );
}

export default CreditTermsModal;
