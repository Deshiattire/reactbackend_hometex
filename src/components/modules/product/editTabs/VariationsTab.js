import React from "react";

const VariationsTab = ({ data }) => {
    const variations = data?.variations || [];

    if (!data?.has_variations || variations.length === 0) {
        return (
            <div className="alert alert-info">
                <i className="fas fa-info-circle me-2"></i>
                This product has no variations.
            </div>
        );
    }

    return (
        <div className="row">
            <div className="col-md-12">
                <h6 className="mb-3">Product Variations ({variations.length})</h6>
                <div className="table-responsive">
                    <table className="table table-bordered">
                        <thead className="table-light">
                            <tr>
                                <th>SKU</th>
                                <th>Name</th>
                                <th>Attributes</th>
                                <th>Regular Price</th>
                                <th>Sale Price</th>
                                <th>Stock</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {variations.map((variation) => (
                                <tr key={variation.id}>
                                    <td><code>{variation.sku}</code></td>
                                    <td>{variation.name}</td>
                                    <td>
                                        {Object.entries(variation.attributes || {}).map(([key, value]) => (
                                            <span key={key} className="badge bg-secondary me-1">
                                                {key}: {value}
                                            </span>
                                        ))}
                                    </td>
                                    <td>৳{variation.pricing?.regular_price}</td>
                                    <td>
                                        {variation.pricing?.sale_price ? (
                                            <span className="text-danger">৳{variation.pricing.sale_price}</span>
                                        ) : (
                                            <span className="text-muted">—</span>
                                        )}
                                    </td>
                                    <td>
                                        <span className={`badge ${
                                            variation.inventory?.stock_quantity > 10 ? 'bg-success' :
                                            variation.inventory?.stock_quantity > 0 ? 'bg-warning' : 'bg-danger'
                                        }`}>
                                            {variation.inventory?.stock_quantity || 0}
                                        </span>
                                    </td>
                                    <td>
                                        <span className={`badge ${
                                            variation.inventory?.stock_status === 'in_stock' ? 'bg-success' : 'bg-danger'
                                        }`}>
                                            {variation.inventory?.stock_status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="alert alert-warning mt-3">
                    <i className="fas fa-exclamation-triangle me-2"></i>
                    <strong>Note:</strong> To edit variations, please use the dedicated variations management page.
                </div>
            </div>
        </div>
    );
};

export default VariationsTab;
