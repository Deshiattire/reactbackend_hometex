import React, { useState } from "react";

const ShippingTab = ({ data, onSave, isSaving }) => {
    const [formData, setFormData] = useState({
        weight: data?.shipping?.weight || 0,
        dimensions: data?.shipping?.dimensions 
            ? `${data.shipping.dimensions.length}x${data.shipping.dimensions.width}x${data.shipping.dimensions.height}`
            : "",
        shipping_class: data?.shipping?.shipping_class || "standard",
        shipping_cost: data?.shipping?.shipping_cost || 0,
        unit: data?.unit || "piece",
    });

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        const payload = {
            weight: formData.weight,
            dimensions: formData.dimensions,
            shipping_class: formData.shipping_class,
            shipping_cost: formData.shipping_cost,
            unit: formData.unit,
        };

        onSave(payload);
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="row">
                <div className="col-md-6">
                    <div className="mb-3">
                        <label className="form-label">Weight (kg)</label>
                        <input
                            type="number"
                            className="form-control"
                            value={formData.weight}
                            onChange={(e) => handleChange('weight', parseFloat(e.target.value) || 0)}
                            step="0.01"
                            min="0"
                        />
                    </div>
                </div>

                <div className="col-md-6">
                    <div className="mb-3">
                        <label className="form-label">Dimensions (LxWxH cm)</label>
                        <input
                            type="text"
                            className="form-control"
                            value={formData.dimensions}
                            onChange={(e) => handleChange('dimensions', e.target.value)}
                            placeholder="30x20x10"
                        />
                        <small className="text-muted">Format: Length x Width x Height</small>
                    </div>
                </div>

                <div className="col-md-6">
                    <div className="mb-3">
                        <label className="form-label">Unit</label>
                        <select
                            className="form-select"
                            value={formData.unit}
                            onChange={(e) => handleChange('unit', e.target.value)}
                        >
                            <option value="piece">Piece</option>
                            <option value="kg">Kilogram</option>
                            <option value="meter">Meter</option>
                            <option value="liter">Liter</option>
                            <option value="box">Box</option>
                            <option value="set">Set</option>
                        </select>
                    </div>
                </div>

                <div className="col-md-6">
                    <div className="mb-3">
                        <label className="form-label">Shipping Class</label>
                        <select
                            className="form-select"
                            value={formData.shipping_class}
                            onChange={(e) => handleChange('shipping_class', e.target.value)}
                        >
                            <option value="standard">Standard</option>
                            <option value="express">Express</option>
                            <option value="overnight">Overnight</option>
                            <option value="free">Free Shipping</option>
                        </select>
                    </div>
                </div>

                <div className="col-md-6">
                    <div className="mb-3">
                        <label className="form-label">Shipping Cost (৳)</label>
                        <input
                            type="number"
                            className="form-control"
                            value={formData.shipping_cost}
                            onChange={(e) => handleChange('shipping_cost', parseFloat(e.target.value) || 0)}
                            step="0.01"
                            min="0"
                        />
                    </div>
                </div>

                {/* Current Shipping Info from API */}
                <div className="col-md-12">
                    <div className="card bg-light">
                        <div className="card-body">
                            <h6>Current Shipping Details</h6>
                            <div className="row">
                                <div className="col-md-6">
                                    <small><strong>Ships From:</strong> {data?.shipping?.ships_from?.city}, {data?.shipping?.ships_from?.country}</small>
                                </div>
                                <div className="col-md-6">
                                    <small><strong>Estimated Delivery:</strong> {data?.shipping?.estimated_delivery?.min_days}-{data?.shipping?.estimated_delivery?.max_days} days</small>
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
