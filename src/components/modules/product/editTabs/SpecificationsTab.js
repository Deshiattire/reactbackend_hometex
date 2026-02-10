import React, { useState } from "react";

/**
 * SpecificationsTab - Handles product specifications (key-value pairs)
 * API Fields per documentation: specifications[].key, specifications[].value
 * Maps to product_specifications table: name, value columns
 */
const SpecificationsTab = ({ data, onSave, isSaving, errors = {} }) => {
    // Initialize specifications from data
    const getInitialSpecs = () => {
        if (data?.specifications && Array.isArray(data.specifications) && data.specifications.length > 0) {
            return data.specifications.map((spec, index) => ({
                id: index + 1,
                key: spec.key || spec.name || "",
                value: spec.value || "",
            }));
        }
        return [{ id: 1, key: "", value: "" }];
    };

    const [specifications, setSpecifications] = useState(getInitialSpecs());
    const [validationErrors, setValidationErrors] = useState({});

    const handleSpecChange = (id, field, value) => {
        setSpecifications(prev => 
            prev.map(spec => 
                spec.id === id ? { ...spec, [field]: value } : spec
            )
        );
        // Clear errors
        if (validationErrors[`spec_${id}_${field}`]) {
            setValidationErrors(prev => ({ ...prev, [`spec_${id}_${field}`]: null }));
        }
    };

    const addSpecification = () => {
        const newId = Math.max(...specifications.map(s => s.id), 0) + 1;
        setSpecifications(prev => [...prev, { id: newId, key: "", value: "" }]);
    };

    const removeSpecification = (id) => {
        if (specifications.length > 1) {
            setSpecifications(prev => prev.filter(spec => spec.id !== id));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Validate specifications
        const newErrors = {};
        const validSpecs = specifications.filter(spec => spec.key.trim() || spec.value.trim());

        validSpecs.forEach(spec => {
            if (spec.key.trim() && !spec.value.trim()) {
                newErrors[`spec_${spec.id}_value`] = "Value is required when key is provided";
            }
            if (spec.value.trim() && !spec.key.trim()) {
                newErrors[`spec_${spec.id}_key`] = "Key is required when value is provided";
            }
        });

        if (Object.keys(newErrors).length > 0) {
            setValidationErrors(newErrors);
            return;
        }

        // Build payload - API expects: specifications: [{ name: string, value: string }]
        const specsPayload = specifications
            .filter(spec => spec.key.trim() && spec.value.trim())
            .map(spec => ({
                name: spec.key.trim(),
                value: spec.value.trim(),
            }));

        const payload = {
            specifications: specsPayload,
        };

        onSave(payload);
    };

    // Common specifications templates
    const commonSpecs = [
        { key: "Material", placeholder: "e.g., 100% Cotton, Polyester" },
        { key: "Size", placeholder: "e.g., Queen, King, Twin" },
        { key: "Color", placeholder: "e.g., White, Blue, Red" },
        { key: "Thread Count", placeholder: "e.g., 200, 300, 400" },
        { key: "GSM", placeholder: "e.g., 120, 180, 250" },
        { key: "Care Instructions", placeholder: "e.g., Machine Washable" },
    ];

    const addFromTemplate = (specKey) => {
        const exists = specifications.some(s => s.key.toLowerCase() === specKey.toLowerCase());
        if (!exists) {
            const newId = Math.max(...specifications.map(s => s.id), 0) + 1;
            setSpecifications(prev => [...prev, { id: newId, key: specKey, value: "" }]);
        }
    };

    // Merge client and server errors
    const allErrors = { ...validationErrors, ...errors };

    return (
        <form onSubmit={handleSubmit}>
            <div className="row">
                {/* Quick Add Templates */}
                <div className="col-md-12 mb-4">
                    <div className="card bg-light">
                        <div className="card-body">
                            <h6 className="mb-3">
                                <span className="fas fa-magic me-2"></span>
                                Quick Add Common Specifications
                            </h6>
                            <div className="d-flex flex-wrap gap-2">
                                {commonSpecs.map((spec, index) => (
                                    <button
                                        key={index}
                                        type="button"
                                        className="btn btn-outline-secondary btn-sm"
                                        onClick={() => addFromTemplate(spec.key)}
                                        disabled={specifications.some(s => s.key.toLowerCase() === spec.key.toLowerCase())}
                                    >
                                        <span className="fas fa-plus me-1"></span>
                                        {spec.key}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Specifications List */}
                <div className="col-md-12">
                    <div className="card">
                        <div className="card-header d-flex justify-content-between align-items-center">
                            <h6 className="mb-0">
                                <span className="fas fa-list me-2"></span>
                                Product Specifications
                            </h6>
                            <span className="badge bg-info">
                                {specifications.filter(s => s.key && s.value).length} specifications
                            </span>
                        </div>
                        <div className="card-body">
                            {specifications.map((spec, index) => (
                                <div key={spec.id} className="row mb-3 align-items-start">
                                    <div className="col-md-5">
                                        <label className="form-label small text-muted">
                                            Specification Key
                                        </label>
                                        <input
                                            type="text"
                                            className={`form-control ${allErrors[`spec_${spec.id}_key`] ? 'is-invalid' : ''}`}
                                            value={spec.key}
                                            onChange={(e) => handleSpecChange(spec.id, 'key', e.target.value)}
                                            placeholder="e.g., Material"
                                        />
                                        {allErrors[`spec_${spec.id}_key`] && (
                                            <div className="invalid-feedback">{allErrors[`spec_${spec.id}_key`]}</div>
                                        )}
                                    </div>
                                    <div className="col-md-5">
                                        <label className="form-label small text-muted">
                                            Value
                                        </label>
                                        <input
                                            type="text"
                                            className={`form-control ${allErrors[`spec_${spec.id}_value`] ? 'is-invalid' : ''}`}
                                            value={spec.value}
                                            onChange={(e) => handleSpecChange(spec.id, 'value', e.target.value)}
                                            placeholder="e.g., 100% Cotton"
                                        />
                                        {allErrors[`spec_${spec.id}_value`] && (
                                            <div className="invalid-feedback">{allErrors[`spec_${spec.id}_value`]}</div>
                                        )}
                                    </div>
                                    <div className="col-md-2 d-flex align-items-end">
                                        <button
                                            type="button"
                                            className="btn btn-outline-danger btn-sm mt-4"
                                            onClick={() => removeSpecification(spec.id)}
                                            disabled={specifications.length === 1}
                                            title="Remove specification"
                                        >
                                            <span className="fas fa-trash"></span>
                                        </button>
                                    </div>
                                    {index < specifications.length - 1 && (
                                        <div className="col-12">
                                            <hr className="my-2" />
                                        </div>
                                    )}
                                </div>
                            ))}

                            <button
                                type="button"
                                className="btn btn-outline-primary"
                                onClick={addSpecification}
                            >
                                <span className="fas fa-plus me-2"></span>
                                Add Specification
                            </button>
                        </div>
                    </div>
                </div>

                {/* Specifications Preview */}
                {specifications.filter(s => s.key && s.value).length > 0 && (
                    <div className="col-md-12 mt-4">
                        <div className="card border-success">
                            <div className="card-header bg-success text-white">
                                <span className="fas fa-eye me-2"></span>
                                Preview
                            </div>
                            <div className="card-body">
                                <table className="table table-sm table-bordered mb-0">
                                    <tbody>
                                        {specifications
                                            .filter(s => s.key && s.value)
                                            .map((spec, index) => (
                                                <tr key={index}>
                                                    <td className="fw-bold" style={{ width: "40%" }}>
                                                        {spec.key}
                                                    </td>
                                                    <td>{spec.value}</td>
                                                </tr>
                                            ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {/* Tips */}
                <div className="col-md-12 mt-4">
                    <div className="alert alert-info">
                        <h6>
                            <span className="fas fa-lightbulb me-2"></span>
                            Tips for Specifications
                        </h6>
                        <ul className="mb-0 small">
                            <li>Include all relevant product details like material, size, dimensions, weight.</li>
                            <li>Use consistent naming conventions across products.</li>
                            <li>Empty specifications will not be saved.</li>
                            <li>Specifications help customers compare products and make decisions.</li>
                        </ul>
                    </div>
                </div>

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
