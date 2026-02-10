import React, { useState } from "react";

/**
 * ShippingTab - Handles product shipping and dimensions
 * API Response Structure:
 * - shipping.weight, shipping.weight_unit
 * - shipping.dimensions: length, width, height, unit
 * - shipping.free_shipping
 * - shipping.estimated_delivery.express_available
 */
const ShippingTab = ({ data, onSave, isSaving, errors = {} }) => {
    // Form state - matches API field names exactly
    const [formData, setFormData] = useState({
        // Shipping options
        free_shipping: data?.shipping?.free_shipping || false,
        express_available: data?.shipping?.estimated_delivery?.express_available || false,
        // Weight and dimensions
        weight: data?.shipping?.weight || 0,
        length: data?.shipping?.dimensions?.length || 0,
        width: data?.shipping?.dimensions?.width || 0,
        height: data?.shipping?.dimensions?.height || 0,
    });

    const [validationErrors, setValidationErrors] = useState({});

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (validationErrors[field]) {
            setValidationErrors(prev => ({ ...prev, [field]: null }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Client-side validation
        const newErrors = {};
        if (formData.weight < 0) newErrors.weight = "Weight cannot be negative";
        if (formData.length < 0) newErrors.length = "Length cannot be negative";
        if (formData.width < 0) newErrors.width = "Width cannot be negative";
        if (formData.height < 0) newErrors.height = "Height cannot be negative";
        
        if (Object.keys(newErrors).length > 0) {
            setValidationErrors(newErrors);
            return;
        }

        // Build payload matching API documentation
        const payload = {
            free_shipping: formData.free_shipping,
            express_available: formData.express_available,
            weight: parseFloat(formData.weight) || 0,
            length: parseFloat(formData.length) || 0,
            width: parseFloat(formData.width) || 0,
            height: parseFloat(formData.height) || 0,
        };

        onSave(payload);
    };

    // Calculate volume
    const volume = formData.length * formData.width * formData.height;

    // Combine client and server errors
    const allErrors = { ...validationErrors, ...errors };

    return (
        <form onSubmit={handleSubmit}>
            <div className="row">
                {/* Shipping Options */}
                <div className="col-md-12 mb-3">
                    <div className="card bg-light">
                        <div className="card-body">
                            <h6 className="mb-3">
                                <span className="fas fa-shipping-fast me-2"></span>
                                Shipping Options
                            </h6>
                            <div className="row">
                                <div className="col-md-6">
                                    <div className="form-check">
                                        <input
                                            type="checkbox"
                                            className="form-check-input"
                                            id="free_shipping"
                                            checked={formData.free_shipping}
                                            onChange={(e) => handleChange('free_shipping', e.target.checked)}
                                        />
                                        <label className="form-check-label" htmlFor="free_shipping">
                                            <strong>
                                                <span className="fas fa-truck text-success me-1"></span>
                                                Free Shipping
                                            </strong>
                                            <br />
                                            <small className="text-muted">No shipping charge for this product</small>
                                        </label>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-check">
                                        <input
                                            type="checkbox"
                                            className="form-check-input"
                                            id="express_available"
                                            checked={formData.express_available}
                                            onChange={(e) => handleChange('express_available', e.target.checked)}
                                        />
                                        <label className="form-check-label" htmlFor="express_available">
                                            <strong>
                                                <span className="fas fa-bolt text-warning me-1"></span>
                                                Express Shipping Available
                                            </strong>
                                            <br />
                                            <small className="text-muted">Faster delivery option available</small>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Weight */}
                <div className="col-md-6">
                    <div className="mb-3">
                        <label className="form-label">Weight (kg)</label>
                        <input
                            type="number"
                            className={`form-control ${allErrors.weight ? 'is-invalid' : ''}`}
                            value={formData.weight}
                            onChange={(e) => handleChange('weight', e.target.value)}
                            step="0.01"
                            min="0"
                        />
                        {allErrors.weight && <div className="invalid-feedback">{allErrors.weight}</div>}
                        <small className="text-muted">Product weight in kilograms</small>
                    </div>
                </div>

                {/* Dimensions Header */}
                <div className="col-md-6"></div>

                <div className="col-md-12 mb-2">
                    <h6>
                        <span className="fas fa-ruler-combined me-2"></span>
                        Dimensions (cm)
                    </h6>
                </div>

                {/* Length */}
                <div className="col-md-4">
                    <div className="mb-3">
                        <label className="form-label">Length</label>
                        <input
                            type="number"
                            className={`form-control ${allErrors.length ? 'is-invalid' : ''}`}
                            value={formData.length}
                            onChange={(e) => handleChange('length', e.target.value)}
                            step="0.01"
                            min="0"
                        />
                        {allErrors.length && <div className="invalid-feedback">{allErrors.length}</div>}
                    </div>
                </div>

                {/* Width */}
                <div className="col-md-4">
                    <div className="mb-3">
                        <label className="form-label">Width</label>
                        <input
                            type="number"
                            className={`form-control ${allErrors.width ? 'is-invalid' : ''}`}
                            value={formData.width}
                            onChange={(e) => handleChange('width', e.target.value)}
                            step="0.01"
                            min="0"
                        />
                        {allErrors.width && <div className="invalid-feedback">{allErrors.width}</div>}
                    </div>
                </div>

                {/* Height */}
                <div className="col-md-4">
                    <div className="mb-3">
                        <label className="form-label">Height</label>
                        <input
                            type="number"
                            className={`form-control ${allErrors.height ? 'is-invalid' : ''}`}
                            value={formData.height}
                            onChange={(e) => handleChange('height', e.target.value)}
                            step="0.01"
                            min="0"
                        />
                        {allErrors.height && <div className="invalid-feedback">{allErrors.height}</div>}
                    </div>
                </div>

                {/* Shipping Summary */}
                <div className="col-md-12">
                    <div className="card border-info">
                        <div className="card-body">
                            <h6 className="card-title">
                                <span className="fas fa-box me-2"></span>
                                Package Summary
                            </h6>
                            <div className="row text-center">
                                <div className="col-md-4">
                                    <div className="border rounded p-3">
                                        <h5 className="text-muted mb-1">Weight</h5>
                                        <h4 className="mb-0">{parseFloat(formData.weight).toFixed(2)} kg</h4>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="border rounded p-3">
                                        <h5 className="text-muted mb-1">Dimensions</h5>
                                        <h4 className="mb-0">{formData.length} x {formData.width} x {formData.height} cm</h4>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="border rounded p-3">
                                        <h5 className="text-muted mb-1">Volume</h5>
                                        <h4 className="mb-0">{volume.toFixed(2)} cm³</h4>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Current Shipping Info from API */}
                {data?.shipping && (
                    <div className="col-md-12 mt-3">
                        <div className="card bg-light">
                            <div className="card-body">
                                <h6>Current Shipping Details</h6>
                                <div className="row">
                                    {data?.shipping?.ships_from && (
                                        <div className="col-md-6">
                                            <small>
                                                <strong>Ships From:</strong> {data.shipping.ships_from.city}, {data.shipping.ships_from.country}
                                            </small>
                                        </div>
                                    )}
                                    {data?.shipping?.estimated_delivery && (
                                        <div className="col-md-6">
                                            <small>
                                                <strong>Estimated Delivery:</strong> {data.shipping.estimated_delivery.min_days}-{data.shipping.estimated_delivery.max_days} days
                                            </small>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Submit Button */}
                <div className="col-md-12 mt-3">
                    <button type="submit" className="btn btn-primary" disabled={isSaving}>
                        {isSaving ? (
                            <>
                                <span className="spinner-border spinner-border-sm me-2"></span>
                                Saving...
                            </>
                        ) : (
                            <>
                                <span className="fas fa-save me-2"></span>
                                Save Shipping Info
                            </>
                        )}
                    </button>
                </div>
            </div>
        </form>
    );
};

export default ShippingTab;
