import React, { useState } from "react";

const RelationsTab = ({ data, onSave, isSaving }) => {
    const [relatedProductIds, setRelatedProductIds] = useState(
        Array.isArray(data?.related_products) ? data.related_products.map(p => p.id).join(', ') : ""
    );
    
    const [tagIds, setTagIds] = useState(
        Array.isArray(data?.tags) ? data.tags.map(t => t.id).join(', ') : ""
    );

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Convert comma-separated strings to arrays of integers
        const related_ids = relatedProductIds
            .split(',')
            .map(id => parseInt(id.trim()))
            .filter(id => !isNaN(id));
        
        const tag_id_array = tagIds
            .split(',')
            .map(id => parseInt(id.trim()))
            .filter(id => !isNaN(id));

        const payload = {
            related_product_ids: related_ids,
            tag_ids: tag_id_array,
        };

        onSave(payload);
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="row">
                <div className="col-md-12 mb-3">
                    <h6>Product Relations</h6>
                </div>

                {/* Related Products */}
                <div className="col-md-12">
                    <div className="mb-3">
                        <label className="form-label">Related Product IDs</label>
                        <input
                            type="text"
                            className="form-control"
                            value={relatedProductIds}
                            onChange={(e) => setRelatedProductIds(e.target.value)}
                            placeholder="e.g., 1, 5, 12, 25"
                        />
                        <small className="form-text text-muted">
                            Enter product IDs separated by commas
                        </small>
                    </div>
                </div>

                {/* Current Related Products Display */}
                {Array.isArray(data?.related_products) && data.related_products.length > 0 && (
                    <div className="col-md-12">
                        <div className="card bg-light mb-3">
                            <div className="card-body">
                                <h6 className="mb-3">Current Related Products</h6>
                                <div className="table-responsive">
                                    <table className="table table-sm table-bordered">
                                        <thead>
                                            <tr>
                                                <th>ID</th>
                                                <th>Name</th>
                                                <th>SKU</th>
                                                <th>Price</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {data.related_products.map((product) => (
                                                <tr key={product.id}>
                                                    <td>{product.id}</td>
                                                    <td>{product.name}</td>
                                                    <td>{product.sku}</td>
                                                    <td>৳{product.regular_price}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Tags */}
                <div className="col-md-12">
                    <div className="mb-3">
                        <label className="form-label">Tag IDs</label>
                        <input
                            type="text"
                            className="form-control"
                            value={tagIds}
                            onChange={(e) => setTagIds(e.target.value)}
                            placeholder="e.g., 3, 7, 15"
                        />
                        <small className="form-text text-muted">
                            Enter tag IDs separated by commas
                        </small>
                    </div>
                </div>

                {/* Current Tags Display */}
                {Array.isArray(data?.tags) && data.tags.length > 0 && (
                    <div className="col-md-12">
                        <div className="card bg-light mb-3">
                            <div className="card-body">
                                <h6 className="mb-2">Current Tags</h6>
                                <div>
                                    {data.tags.map((tag) => (
                                        <span key={tag.id} className="badge bg-secondary me-2 mb-2">
                                            #{tag.id} - {tag.name}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Categories Display (Read-only info) */}
                <div className="col-md-12">
                    <div className="card bg-light mb-3">
                        <div className="card-body">
                            <h6>Current Categories (Read-only)</h6>
                            <div className="row">
                                <div className="col-md-4">
                                    <small>
                                        <strong>Category:</strong><br />
                                        {data?.category ? `#${data.category.id} - ${data.category.name}` : 'N/A'}
                                    </small>
                                </div>
                                <div className="col-md-4">
                                    <small>
                                        <strong>Sub Category:</strong><br />
                                        {data?.sub_category ? `#${data.sub_category.id} - ${data.sub_category.name}` : 'N/A'}
                                    </small>
                                </div>
                                <div className="col-md-4">
                                    <small>
                                        <strong>Child Sub Category:</strong><br />
                                        {data?.child_sub_category ? `#${data.child_sub_category.id} - ${data.child_sub_category.name}` : 'N/A'}
                                    </small>
                                </div>
                            </div>
                            <div className="row mt-2">
                                <div className="col-md-6">
                                    <small>
                                        <strong>Brand:</strong><br />
                                        {data?.brand ? `#${data.brand.id} - ${data.brand.name}` : 'N/A'}
                                    </small>
                                </div>
                                <div className="col-md-6">
                                    <small>
                                        <strong>Supplier:</strong><br />
                                        {data?.supplier ? `#${data.supplier.id} - ${data.supplier.name}` : 'N/A'}
                                    </small>
                                </div>
                            </div>
                            <small className="text-muted d-block mt-2">
                                Note: Category, Brand, and Supplier selection to be implemented
                            </small>
                        </div>
                    </div>
                </div>

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
                                Save Relations
                            </>
                        )}
                    </button>
                </div>
            </div>
        </form>
    );
};

export default RelationsTab;
