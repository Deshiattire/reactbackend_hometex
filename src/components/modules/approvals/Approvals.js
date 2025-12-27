import React, { useState } from "react";
import Breadcrumb from "../../partoals/Breadcrumb";
import CorporateApprovals from "./CorporateApprovals";

function Approvals() {
    const [activeTab, setActiveTab] = useState('corporate');

    const tabs = [
        { id: 'corporate', label: 'Corporate Accounts', icon: 'fas fa-building' },
        { id: 'reviews', label: 'Product Reviews', icon: 'fas fa-star', disabled: true },
        { id: 'others', label: 'Other Approvals', icon: 'fas fa-check-circle', disabled: true }
    ];

    return (
        <>
            <Breadcrumb title={"Approvals Management"} />
            
            <div className="row">
                <div className="col-md-12">
                    <div className="card mb-4 shadow-sm border-0">
                        {/* Modern Tab Navigation */}
                        <div className="card-header bg-white border-bottom-0 pt-4 px-4">
                            <ul className="nav nav-pills nav-fill approval-tabs" role="tablist">
                                {tabs.map(tab => (
                                    <li className="nav-item" key={tab.id} role="presentation">
                                        <button
                                            className={`nav-link ${activeTab === tab.id ? 'active' : ''} ${tab.disabled ? 'disabled' : ''}`}
                                            onClick={() => !tab.disabled && setActiveTab(tab.id)}
                                            type="button"
                                            role="tab"
                                            disabled={tab.disabled}
                                            style={{
                                                borderRadius: '10px',
                                                margin: '0 5px',
                                                fontWeight: '500',
                                                transition: 'all 0.3s ease',
                                                border: 'none',
                                                padding: '12px 24px'
                                            }}
                                        >
                                            <i className={`${tab.icon} me-2`}></i>
                                            {tab.label}
                                            {tab.disabled && <span className="badge bg-secondary ms-2" style={{fontSize: '10px'}}>Coming Soon</span>}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Tab Content */}
                        <div className="card-body p-0">
                            <div className="tab-content">
                                {activeTab === 'corporate' && (
                                    <div className="tab-pane fade show active">
                                        <CorporateApprovals />
                                    </div>
                                )}
                                {activeTab === 'reviews' && (
                                    <div className="tab-pane fade show active p-5 text-center">
                                        <i className="fas fa-star" style={{fontSize: '4rem', color: '#ddd'}}></i>
                                        <h4 className="mt-3 text-muted">Product Reviews Approval</h4>
                                        <p className="text-muted">Coming soon...</p>
                                    </div>
                                )}
                                {activeTab === 'others' && (
                                    <div className="tab-pane fade show active p-5 text-center">
                                        <i className="fas fa-check-circle" style={{fontSize: '4rem', color: '#ddd'}}></i>
                                        <h4 className="mt-3 text-muted">Other Approvals</h4>
                                        <p className="text-muted">Coming soon...</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx="true">{`
                .approval-tabs .nav-link {
                    background-color: #f8f9fa;
                    color: #6c757d;
                }
                
                .approval-tabs .nav-link:hover:not(.disabled) {
                    background-color: #e9ecef;
                    color: #495057;
                    transform: translateY(-2px);
                    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
                }
                
                .approval-tabs .nav-link.active {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
                }
                
                .approval-tabs .nav-link.disabled {
                    background-color: #667eea;
                    color: #adb5bd;
                    opacity: 0.5;
                    cursor: not-allowed;
                }
            `}</style>
        </>
    );
}

export default Approvals;
