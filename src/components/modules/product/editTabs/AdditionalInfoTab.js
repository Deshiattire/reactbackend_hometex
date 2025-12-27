import React, { useState } from "react";

const AdditionalInfoTab = ({ data, onSave, isSaving }) => {
    const [formData, setFormData] = useState({
        material: data?.material || "",
        color: data?.color || "",
        size: data?.size || "",
        manufacturer: data?.manufacturer?.name || "",
        country_of_origin: data?.country_of_origin?.name || "",
        warranty_info: data?.warranty?.details || "",
        return_policy: data?.return_policy?.conditions || "",
    });

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        const payload = {
            material: formData.material,
            color: formData.color,
            size: formData.size,
            manufacturer: formData.manufacturer,
            country_of_origin: formData.country_of_origin,
            warranty_info: formData.warranty_info,
            return_policy: formData.return_policy,
        };

        onSave(payload);
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="row">
                <div className="col-md-12 mb-3">
                    <h6>Product Details</h6>
                </div>

                <div className="col-md-6">
                    <div className="mb-3">
                        <label className="form-label">Material</label>
                        <input
                            type="text"
                            className="form-control"
                            value={formData.material}
                            onChange={(e) => handleChange('material', e.target.value)}
                            placeholder="e.g., 100% Cotton"
                        />
                    </div>
                </div>

                <div className="col-md-6">
                    <div className="mb-3">
                        <label className="form-label">Color</label>
                        <input
                            type="text"
                            className="form-control"
                            value={formData.color}
                            onChange={(e) => handleChange('color', e.target.value)}
                            placeholder="e.g., Blue, Red, Mixed"
                        />
                    </div>
                </div>

                <div className="col-md-6">
                    <div className="mb-3">
                        <label className="form-label">Size</label>
                        <input
                            type="text"
                            className="form-control"
                            value={formData.size}
                            onChange={(e) => handleChange('size', e.target.value)}
                            placeholder="e.g., Medium, 90x108"
                        />
                    </div>
                </div>

                <div className="col-md-6">
                    <div className="mb-3">
                        <label className="form-label">Manufacturer</label>
                        <input
                            type="text"
                            className="form-control"
                            value={formData.manufacturer}
                            onChange={(e) => handleChange('manufacturer', e.target.value)}
                            placeholder="Manufacturer name"
                        />
                    </div>
                </div>

                <div className="col-md-6">
                    <div className="mb-3">
                        <label className="form-label">Country of Origin</label>
                        <input
                            type="text"
                            className="form-control"
                            value={formData.country_of_origin}
                            onChange={(e) => handleChange('country_of_origin', e.target.value)}
                            placeholder="e.g., Bangladesh, China"
                        />
                    </div>
                </div>

                <div className="col-md-12 mt-3">
                    <h6>Warranty & Returns</h6>
                </div>

                <div className="col-md-12">
                    <div className="mb-3">
                        <label className="form-label">Warranty Information</label>
                        <textarea
                            className="form-control"
                            rows="3"
                            value={formData.warranty_info}
                            onChange={(e) => handleChange('warranty_info', e.target.value)}
                            placeholder="e.g., 12 months manufacturer warranty"
                        />
                    </div>
                </div>

                <div className="col-md-12">
                    <div className="mb-3">
                        <label className="form-label">Return Policy</label>
                        <textarea
                            className="form-control"
                            rows="3"
                            value={formData.return_policy}
                            onChange={(e) => handleChange('return_policy', e.target.value)}
                            placeholder="e.g., 7 days return policy, product must be in original condition"
                        />
                    </div>
                </div>

                {/* Display Current API Info */}
                <div className="col-md-12">
                    <div className="card bg-light">
                        <div className="card-body">
                            <h6>Current Information from API</h6>
                            <div className="row">
                                <div className="col-md-6">
                                    <small><strong>Brand:</strong> {data?.brand?.name || 'N/A'}</small>
                                </div>
                                <div className="col-md-6">
                                    <small><strong>Supplier:</strong> {data?.supplier?.name || 'N/A'}</small>
                                </div>
                                <div className="col-md-6">
                                    <small><strong>Warranty:</strong> {data?.warranty?.has_warranty ? `${data.warranty.duration} ${data.warranty.duration_unit}` : 'None'}</small>
                                </div>
                                <div className="col-md-6">
                                    <small><strong>Returnable:</strong> {data?.return_policy?.returnable ? `Yes (${data.return_policy.return_window_days} days)` : 'No'}</small>
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
                                Save Additional Info
                            </>
                        )}
                    </button>
                </div>
            </div>
        </form>
    );
};

export default AdditionalInfoTab;
