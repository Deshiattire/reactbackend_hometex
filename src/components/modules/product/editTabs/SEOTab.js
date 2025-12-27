import React, { useState } from "react";

const SEOTab = ({ data, onSave, isSaving }) => {
    const [formData, setFormData] = useState({
        meta_title: data?.seo?.meta_title || "",
        meta_description: data?.seo?.meta_description || "",
        meta_keywords: data?.seo?.meta_keywords || [],
        og_title: data?.seo?.og_title || "",
        og_description: data?.seo?.og_description || "",
    });

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleKeywordsChange = (value) => {
        const keywords = value.split(',').map(k => k.trim()).filter(k => k);
        setFormData(prev => ({ ...prev, meta_keywords: keywords }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Send flat structure as per API docs
        const payload = {
            meta_title: formData.meta_title,
            meta_description: formData.meta_description,
            meta_keywords: Array.isArray(formData.meta_keywords) 
                ? formData.meta_keywords.join(', ') 
                : formData.meta_keywords,
        };

        onSave(payload);
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="row">
                {/* Meta Title */}
                <div className="col-md-12">
                    <div className="mb-3">
                        <label className="form-label">Meta Title</label>
                        <input
                            type="text"
                            className="form-control"
                            value={formData.meta_title}
                            onChange={(e) => handleChange('meta_title', e.target.value)}
                            maxLength="60"
                        />
                        <small className="text-muted">
                            {formData.meta_title.length}/60 characters
                        </small>
                    </div>
                </div>

                {/* Meta Description */}
                <div className="col-md-12">
                    <div className="mb-3">
                        <label className="form-label">Meta Description</label>
                        <textarea
                            className="form-control"
                            rows="3"
                            value={formData.meta_description}
                            onChange={(e) => handleChange('meta_description', e.target.value)}
                            maxLength="160"
                        />
                        <small className="text-muted">
                            {formData.meta_description.length}/160 characters
                        </small>
                    </div>
                </div>

                {/* Meta Keywords */}
                <div className="col-md-12">
                    <div className="mb-3">
                        <label className="form-label">Meta Keywords</label>
                        <input
                            type="text"
                            className="form-control"
                            value={Array.isArray(formData.meta_keywords) ? formData.meta_keywords.join(', ') : ''}
                            onChange={(e) => handleKeywordsChange(e.target.value)}
                            placeholder="keyword1, keyword2, keyword3"
                        />
                        <small className="text-muted">Separate keywords with commas</small>
                    </div>
                </div>

                {/* Open Graph Title */}
                <div className="col-md-12">
                    <div className="mb-3">
                        <label className="form-label">Open Graph Title</label>
                        <input
                            type="text"
                            className="form-control"
                            value={formData.og_title}
                            onChange={(e) => handleChange('og_title', e.target.value)}
                        />
                    </div>
                </div>

                {/* Open Graph Description */}
                <div className="col-md-12">
                    <div className="mb-3">
                        <label className="form-label">Open Graph Description</label>
                        <textarea
                            className="form-control"
                            rows="2"
                            value={formData.og_description}
                            onChange={(e) => handleChange('og_description', e.target.value)}
                        />
                    </div>
                </div>

                {/* SEO Tips */}
                <div className="col-md-12">
                    <div className="alert alert-info">
                        <h6><i className="fas fa-lightbulb me-2"></i>SEO Best Practices</h6>
                        <ul className="mb-0">
                            <li>Keep meta title under 60 characters</li>
                            <li>Meta description should be 150-160 characters</li>
                            <li>Use relevant keywords naturally</li>
                            <li>Make titles unique and descriptive</li>
                            <li>Open Graph tags improve social media sharing</li>
                        </ul>
                    </div>
                </div>

                {/* Current SEO Data */}
                <div className="col-md-12">
                    <div className="card bg-light">
                        <div className="card-body">
                            <h6>Additional SEO Information</h6>
                            <div><small><strong>Canonical URL:</strong> {data?.seo?.canonical_url || 'Auto-generated'}</small></div>
                            <div><small><strong>Twitter Card:</strong> {data?.seo?.twitter_card || 'Not set'}</small></div>
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
                                Save SEO Settings
                            </>
                        )}
                    </button>
                </div>
            </div>
        </form>
    );
};

export default SEOTab;
