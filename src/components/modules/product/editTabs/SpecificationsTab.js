import React, { useState } from "react";

const SpecificationsTab = ({ data, onSave, isSaving }) => {
    const [specifications, setSpecifications] = useState(
        data?.specifications || []
    );

    const handleSpecChange = (index, field, value) => {
        setSpecifications(prev =>
            prev.map((spec, i) => (i === index ? { ...spec, [field]: value } : spec))
        );
    };

    const addSpecification = () => {
        setSpecifications(prev => [...prev, { key: "", value: "" }]);
    };

    const removeSpecification = (index) => {
        setSpecifications(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Filter out empty specifications
        const validSpecs = specifications.filter(spec => spec.key && spec.value);
        
        onSave({ specifications: validSpecs });
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="row">
                <div className="col-md-12">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <h6>Product Specifications</h6>
                        <button
                            type="button"
                            className="btn btn-sm btn-primary"
                            onClick={addSpecification}
                        >
                            <i className="fas fa-plus me-2"></i>
                            Add Specification
                        </button>
                    </div>
                </div>

                {specifications.length > 0 ? (
                    <div className="col-md-12">
                        <div className="table-responsive">
                            <table className="table table-bordered">
                                <thead className="table-light">
                                    <tr>
                                        <th style={{ width: "40%" }}>Key</th>
                                        <th style={{ width: "50%" }}>Value</th>
                                        <th style={{ width: "10%" }}>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {specifications.map((spec, index) => (
                                        <tr key={index}>
                                            <td>
                                                <input
                                                    type="text"
                                                    className="form-control form-control-sm"
                                                    value={spec.key}
                                                    onChange={(e) => handleSpecChange(index, 'key', e.target.value)}
                                                    placeholder="e.g., Material"
                                                />
                                            </td>
                                            <td>
                                                <input
                                                    type="text"
                                                    className="form-control form-control-sm"
                                                    value={spec.value}
                                                    onChange={(e) => handleSpecChange(index, 'value', e.target.value)}
                                                    placeholder="e.g., 100% Cotton"
                                                />
                                            </td>
                                            <td className="text-center">
                                                <button
                                                    type="button"
                                                    className="btn btn-sm btn-danger"
                                                    onClick={() => removeSpecification(index)}
                                                >
                                                    <i className="fas fa-trash"></i>
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ) : (
                    <div className="col-md-12">
                        <div className="alert alert-info">
                            <i className="fas fa-info-circle me-2"></i>
                            No specifications added yet. Click "Add Specification" to add product details.
                        </div>
                    </div>
                )}

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
                                Save Specifications
                            </>
                        )}
                    </button>
                </div>
            </div>
        </form>
    );
};

export default SpecificationsTab;
