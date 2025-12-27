import React, { useState } from "react";

const PricingTab = ({ data, onSave, isSaving }) => {
    const [formData, setFormData] = useState({
        cost_price: data?.pricing?.cost_price || 0,
        regular_price: data?.pricing?.regular_price || 0,
        sale_price: data?.pricing?.sale_price || null,
        discount_type: data?.pricing?.discount?.type || "percentage",
        discount_value: data?.pricing?.discount?.value || 0,
        discount_start: data?.pricing?.discount?.start_date || "",
        discount_end: data?.pricing?.discount?.end_date || "",
    });

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Send flat structure as per API docs
        const payload = {
            cost_price: formData.cost_price,
            price: formData.regular_price,  // API expects 'price' not 'regular_price'
            sale_price: formData.sale_price,
        };

        onSave(payload);
    };

    const profitMargin = formData.regular_price - formData.cost_price;
    const profitPercentage = formData.cost_price > 0 
        ? ((profitMargin / formData.cost_price) * 100).toFixed(2) 
        : 0;

    return (
        <form onSubmit={handleSubmit}>
            <div className="row">
                <div className="col-md-6">
                    <div className="mb-3">
                        <label className="form-label">Cost Price</label>
                        <input
                            type="number"
                            className="form-control"
                            value={formData.cost_price}
                            onChange={(e) => handleChange('cost_price', parseFloat(e.target.value) || 0)}
                            step="0.01"
                        />
                    </div>
                </div>

                <div className="col-md-6">
                    <div className="mb-3">
                        <label className="form-label">Regular Price <span className="text-danger">*</span></label>
                        <input
                            type="number"
                            className="form-control"
                            value={formData.regular_price}
                            onChange={(e) => handleChange('regular_price', parseFloat(e.target.value) || 0)}
                            step="0.01"
                        />
                    </div>
                </div>

                <div className="col-md-6">
                    <div className="mb-3">
                        <label className="form-label">Sale Price</label>
                        <input
                            type="number"
                            className="form-control"
                            value={formData.sale_price || ""}
                            onChange={(e) => handleChange('sale_price', e.target.value ? parseFloat(e.target.value) : null)}
                            step="0.01"
                        />
                    </div>
                </div>

                <div className="col-md-6">
                    <div className="mb-3">
                        <label className="form-label">Discount Type</label>
                        <select
                            className="form-select"
                            value={formData.discount_type}
                            onChange={(e) => handleChange('discount_type', e.target.value)}
                        >
                            <option value="percentage">Percentage</option>
                            <option value="fixed">Fixed Amount</option>
                        </select>
                    </div>
                </div>

                <div className="col-md-6">
                    <div className="mb-3">
                        <label className="form-label">Discount Value</label>
                        <input
                            type="number"
                            className="form-control"
                            value={formData.discount_value}
                            onChange={(e) => handleChange('discount_value', parseFloat(e.target.value) || 0)}
                            step="0.01"
                        />
                    </div>
                </div>

                <div className="col-md-6">
                    <div className="mb-3">
                        <label className="form-label">Discount Start Date</label>
                        <input
                            type="datetime-local"
                            className="form-control"
                            value={formData.discount_start ? new Date(formData.discount_start).toISOString().slice(0, 16) : ""}
                            onChange={(e) => handleChange('discount_start', e.target.value)}
                        />
                    </div>
                </div>

                <div className="col-md-6">
                    <div className="mb-3">
                        <label className="form-label">Discount End Date</label>
                        <input
                            type="datetime-local"
                            className="form-control"
                            value={formData.discount_end ? new Date(formData.discount_end).toISOString().slice(0, 16) : ""}
                            onChange={(e) => handleChange('discount_end', e.target.value)}
                        />
                    </div>
                </div>

                {/* Pricing Summary */}
                <div className="col-md-12">
                    <div className="alert alert-info">
                        <h6>Pricing Summary</h6>
                        <div className="row">
                            <div className="col-md-4">
                                <strong>Cost Price:</strong> ৳{formData.cost_price.toFixed(2)}
                            </div>
                            <div className="col-md-4">
                                <strong>Regular Price:</strong> ৳{formData.regular_price.toFixed(2)}
                            </div>
                            <div className="col-md-4">
                                <strong>Profit Margin:</strong> ৳{profitMargin.toFixed(2)} ({profitPercentage}%)
                            </div>
                        </div>
                    </div>
                </div>

                {/* Current API Data Display */}
                <div className="col-md-12">
                    <div className="card bg-light">
                        <div className="card-body">
                            <h6>Current Price Details from API</h6>
                            <div className="row">
                                <div className="col-md-6">
                                    <small><strong>Price Range:</strong> ৳{data?.pricing?.price_range?.min} - ৳{data?.pricing?.price_range?.max}</small>
                                </div>
                                <div className="col-md-6">
                                    <small><strong>Tax Rate:</strong> {data?.pricing?.tax?.rate}%</small>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-md-12 mt-3">
                    <button type="submit" className="btn btn-primary" disabled={isSaving}>
                        {isSaving ? (
                            <>
                                <span className="spinner-border spinner-border-sm me-2"></span>
                                Saving...
                            </>
                        ) : (
                            <>
                                <i className="fas fa-save me-2"></i>
                                Save Pricing
                            </>
                        )}
                    </button>
                </div>
            </div>
        </form>
    );
};

export default PricingTab;
