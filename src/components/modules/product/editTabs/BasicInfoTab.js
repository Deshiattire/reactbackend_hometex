import React, { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const BasicInfoTab = ({ data, onSave, isSaving }) => {
    const [formData, setFormData] = useState({
        name: data?.name || "",
        slug: data?.slug || "",
        sku: data?.sku || "",
        description: data?.description || "",
        short_description: data?.short_description || "",
        status: data?.status || "active",
        type: data?.type || "simple",
        category_id: data?.category?.id || "",
        sub_category_id: data?.sub_category?.id || "",
        child_sub_category_id: data?.child_sub_category?.id || "",
        brand_id: data?.brand?.id || "",
        country_id: data?.country_of_origin?.id || "",
        tags: data?.tags || [],
        is_featured: data?.badges?.is_featured || false,
        is_new_arrival: data?.badges?.is_new || false,
        is_best_seller: data?.badges?.is_bestseller || false,
        is_on_sale: data?.badges?.is_on_sale || false,
    });

    const [errors, setErrors] = useState({});

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) setErrors(prev => ({ ...prev, [field]: null }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        const newErrors = {};
        if (!formData.name.trim()) newErrors.name = "Name is required";
        if (!formData.sku.trim()) newErrors.sku = "SKU is required";
        
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        // Send flat structure as per API docs
        const payload = {
            name: formData.name,
            sku: formData.sku,
            slug: formData.slug,
            description: formData.description,
            short_description: formData.short_description,
            status: formData.status,
            is_featured: formData.is_featured ? 1 : 0,
            is_new_arrival: formData.is_new_arrival ? 1 : 0,
            is_best_seller: formData.is_best_seller ? 1 : 0,
            is_on_sale: formData.is_on_sale ? 1 : 0,
        };

        onSave(payload);
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="row">
                {/* Basic Info */}
                <div className="col-md-6">
                    <div className="mb-3">
                        <label className="form-label">Product Name <span className="text-danger">*</span></label>
                        <input
                            type="text"
                            className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                            value={formData.name}
                            onChange={(e) => handleChange('name', e.target.value)}
                        />
                        {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                    </div>
                </div>

                <div className="col-md-6">
                    <div className="mb-3">
                        <label className="form-label">SKU <span className="text-danger">*</span></label>
                        <input
                            type="text"
                            className={`form-control ${errors.sku ? 'is-invalid' : ''}`}
                            value={formData.sku}
                            onChange={(e) => handleChange('sku', e.target.value)}
                        />
                        {errors.sku && <div className="invalid-feedback">{errors.sku}</div>}
                    </div>
                </div>

                <div className="col-md-6">
                    <div className="mb-3">
                        <label className="form-label">Slug</label>
                        <input
                            type="text"
                            className="form-control"
                            value={formData.slug}
                            onChange={(e) => handleChange('slug', e.target.value)}
                        />
                    </div>
                </div>

                <div className="col-md-6">
                    <div className="mb-3">
                        <label className="form-label">Status</label>
                        <select
                            className="form-select"
                            value={formData.status}
                            onChange={(e) => handleChange('status', e.target.value)}
                        >
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                            <option value="draft">Draft</option>
                        </select>
                    </div>
                </div>

                <div className="col-md-6">
                    <div className="mb-3">
                        <label className="form-label">Product Type</label>
                        <input
                            type="text"
                            className="form-control"
                            value={formData.type}
                            disabled
                            readOnly
                        />
                        <small className="text-muted">Type cannot be changed after creation</small>
                    </div>
                </div>

                <div className="col-md-12">
                    <div className="mb-3">
                        <label className="form-label">Short Description</label>
                        <textarea
                            className="form-control"
                            rows="3"
                            value={formData.short_description}
                            onChange={(e) => handleChange('short_description', e.target.value)}
                        />
                    </div>
                </div>

                <div className="col-md-12">
                    <div className="mb-3">
                        <label className="form-label">Description</label>
                        <ReactQuill
                            value={formData.description}
                            onChange={(value) => handleChange('description', value)}
                            theme="snow"
                        />
                    </div>
                </div>

                {/* Display Read-Only Category Info */}
                <div className="col-md-12">
                    <div className="alert alert-info">
                        <h6>Category Information</h6>
                        <div><strong>Category:</strong> {data?.category?.name || 'N/A'}</div>
                        <div><strong>Sub Category:</strong> {data?.sub_category?.name || 'N/A'}</div>
                        <div><strong>Child Sub Category:</strong> {data?.child_sub_category?.name || 'N/A'}</div>
                        <div><strong>Brand:</strong> {data?.brand?.name || 'N/A'}</div>
                        <div><strong>Country:</strong> {data?.country_of_origin?.name || 'N/A'}</div>
                    </div>
                </div>

                {/* Tags */}
                <div className="col-md-12">
                    <div className="mb-3">
                        <label className="form-label">Tags</label>
                        <div className="d-flex flex-wrap gap-2">
                            {formData.tags && formData.tags.map((tag, index) => (
                                <span key={index} className="badge bg-primary">{tag}</span>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Product Badges */}
                <div className="col-md-12">
                    <div className="card bg-light">
                        <div className="card-body">
                            <h6 className="mb-3">Product Badges</h6>
                            <div className="row">
                                <div className="col-md-3">
                                    <div className="form-check">
                                        <input
                                            type="checkbox"
                                            className="form-check-input"
                                            id="is_featured"
                                            checked={formData.is_featured}
                                            onChange={(e) => handleChange('is_featured', e.target.checked)}
                                        />
                                        <label className="form-check-label" htmlFor="is_featured">
                                            Featured Product
                                        </label>
                                    </div>
                                </div>
                                <div className="col-md-3">
                                    <div className="form-check">
                                        <input
                                            type="checkbox"
                                            className="form-check-input"
                                            id="is_new_arrival"
                                            checked={formData.is_new_arrival}
                                            onChange={(e) => handleChange('is_new_arrival', e.target.checked)}
                                        />
                                        <label className="form-check-label" htmlFor="is_new_arrival">
                                            New Arrival
                                        </label>
                                    </div>
                                </div>
                                <div className="col-md-3">
                                    <div className="form-check">
                                        <input
                                            type="checkbox"
                                            className="form-check-input"
                                            id="is_best_seller"
                                            checked={formData.is_best_seller}
                                            onChange={(e) => handleChange('is_best_seller', e.target.checked)}
                                        />
                                        <label className="form-check-label" htmlFor="is_best_seller">
                                            Best Seller
                                        </label>
                                    </div>
                                </div>
                                <div className="col-md-3">
                                    <div className="form-check">
                                        <input
                                            type="checkbox"
                                            className="form-check-input"
                                            id="is_on_sale"
                                            checked={formData.is_on_sale}
                                            onChange={(e) => handleChange('is_on_sale', e.target.checked)}
                                        />
                                        <label className="form-check-label" htmlFor="is_on_sale">
                                            On Sale
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Submit Button */}
                <div className="col-md-12">
                    <button type="submit" className="btn btn-primary" disabled={isSaving}>
                        {isSaving ? (
                            <>
                                <span className="spinner-border spinner-border-sm me-2"></span>
                                Saving...
                            </>
                        ) : (
                            <>
                                <i className="fas fa-save me-2"></i>
                                Save Changes
                            </>
                        )}
                    </button>
                </div>
            </div>
        </form>
    );
};

export default BasicInfoTab;
