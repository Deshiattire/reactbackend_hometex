import React, { useState } from "react";

const InventoryTab = ({ data, onSave, isSaving }) => {
    const [stockByLocation, setStockByLocation] = useState(
        data?.inventory?.stock_by_location || []
    );

    const handleQuantityChange = (shopId, quantity) => {
        console.log('Updating shop', shopId, 'to quantity:', quantity);
        setStockByLocation(prev => {
            const updated = prev.map(shop =>
                shop.shop_id === shopId ? { ...shop, quantity: parseInt(quantity) || 0 } : shop
            );
            console.log('Updated stockByLocation:', updated);
            return updated;
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        console.log('Current stockByLocation before save:', stockByLocation);
        
        // Prepare stock by location data for the API
        const stockByLocationData = stockByLocation.map(shop => ({
            shop_id: shop.shop_id,
            quantity: shop.quantity || 0
        }));
        
        // Send only per-location stock as the API expects
        const payload = {
            stock_by_location: stockByLocationData
        };

        console.log('Saving inventory with payload:', JSON.stringify(payload, null, 2));
        onSave(payload);
    };

    const totalStock = stockByLocation.reduce((sum, shop) => sum + (shop.quantity || 0), 0);
    const totalReserved = stockByLocation.reduce((sum, shop) => sum + (shop.reserved || 0), 0);
    const totalAvailable = totalStock - totalReserved;

    return (
        <form onSubmit={handleSubmit}>
            <div className="row">
                {/* Inventory Summary */}
                <div className="col-md-12 mb-4">
                    <div className="row">
                        <div className="col-md-3">
                            <div className="card text-center">
                                <div className="card-body">
                                    <h3 className="text-primary">{totalStock}</h3>
                                    <small>Total Stock</small>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-3">
                            <div className="card text-center">
                                <div className="card-body">
                                    <h3 className="text-warning">{totalReserved}</h3>
                                    <small>Reserved</small>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-3">
                            <div className="card text-center">
                                <div className="card-body">
                                    <h3 className="text-success">{totalAvailable}</h3>
                                    <small>Available</small>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-3">
                            <div className="card text-center">
                                <div className="card-body">
                                    <h3 className="text-info">{data?.inventory?.sold_count || 0}</h3>
                                    <small>Sold</small>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stock by Location */}
                <div className="col-md-12">
                    <h6 className="mb-3">Stock by Location</h6>
                    <div className="table-responsive">
                        <table className="table table-bordered">
                            <thead className="table-light">
                                <tr>
                                    <th>Shop Name</th>
                                    <th style={{ width: "150px" }}>Quantity</th>
                                    <th style={{ width: "100px" }}>Reserved</th>
                                    <th style={{ width: "100px" }}>Available</th>
                                </tr>
                            </thead>
                            <tbody>
                                {stockByLocation.map((shop) => (
                                    <tr key={shop.shop_id}>
                                        <td>{shop.shop_name}</td>
                                        <td>
                                            <input
                                                type="number"
                                                className="form-control form-control-sm"
                                                value={shop.quantity}
                                                onChange={(e) => handleQuantityChange(shop.shop_id, e.target.value)}
                                                min="0"
                                            />
                                        </td>
                                        <td className="text-center">{shop.reserved || 0}</td>
                                        <td className="text-center">
                                            {(shop.quantity || 0) - (shop.reserved || 0)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot className="table-light">
                                <tr>
                                    <th>Total</th>
                                    <th>{totalStock}</th>
                                    <th>{totalReserved}</th>
                                    <th>{totalAvailable}</th>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>

                {/* Additional Inventory Info */}
                <div className="col-md-12 mt-3">
                    <div className="card bg-light">
                        <div className="card-body">
                            <h6>Inventory Settings</h6>
                            <div className="row">
                                <div className="col-md-4">
                                    <small><strong>Stock Status:</strong> {data?.inventory?.stock_status}</small>
                                </div>
                                <div className="col-md-4">
                                    <small><strong>Low Stock Threshold:</strong> {data?.inventory?.low_stock_threshold}</small>
                                </div>
                                <div className="col-md-4">
                                    <small><strong>Manage Stock:</strong> {data?.inventory?.manage_stock ? 'Yes' : 'No'}</small>
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
                                Update Inventory
                            </>
                        )}
                    </button>
                </div>
            </div>
        </form>
    );
};

export default InventoryTab;
