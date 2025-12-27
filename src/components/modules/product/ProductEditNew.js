import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import Constants from "../../../Constants";
import Breadcrumb from "../../partoals/Breadcrumb";
import CardHeader from "../../partoals/miniComponents/CardHeader";
import Loader from "../../partoals/miniComponents/Loader";
import BasicInfoTab from "./editTabs/BasicInfoTab";
import PricingTab from "./editTabs/PricingTab";
import InventoryTab from "./editTabs/InventoryTab";
import SEOTab from "./editTabs/SEOTab";
import VariationsTab from "./editTabs/VariationsTab";
import MediaTab from "./editTabs/MediaTab";
import ShippingTab from "./editTabs/ShippingTab";
import SpecificationsTab from "./editTabs/SpecificationsTab";
import AdditionalInfoTab from "./editTabs/AdditionalInfoTab";
import RelationsTab from "./editTabs/RelationsTab";

// Create axios instance with authentication
const apiClient = axios.create({
    baseURL: Constants.BASE_URL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
});

// Add token if available
const token = localStorage.getItem('token');
if (token) {
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

const ProductEditNew = () => {
    const { id } = useParams();
    
    const [activeTab, setActiveTab] = useState("basic");
    const [hoveredTab, setHoveredTab] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [productData, setProductData] = useState(null);

    useEffect(() => {
        // Restore saved tab on mount
        const savedTab = sessionStorage.getItem('productEditActiveTab');
        if (savedTab) {
            console.log('Restoring tab:', savedTab);
            setActiveTab(savedTab);
            sessionStorage.removeItem('productEditActiveTab');
        }
    }, []);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setIsLoading(true);
                const response = await apiClient.get(`/products/${id}`);
                console.log("Product fetched successfully:", response.data);
                setProductData(response.data.data);
            } catch (error) {
                console.error("Error fetching product:", error);
                console.error("Error details:", error.response?.data);
                
                // Show error but keep form visible with empty/default data
                Swal.fire({
                    icon: "warning",
                    title: "Backend Error",
                    html: `
                        <p><strong>Message:</strong> ${error.response?.data?.message || 'Failed to load product'}</p>
                        <p class="text-danger"><small>${error.response?.data?.errors || ''}</small></p>
                        <p class="mt-3"><strong>This is a backend SQL issue that needs to be fixed.</strong></p>
                        <p>The form will display with default values.</p>
                    `,
                    confirmButtonText: 'Continue Anyway',
                    width: 600,
                });
                
                // Set default empty product data to allow form to render
                setProductData({
                    id: id,
                    name: "Loading failed - Backend error",
                    sku: "",
                    slug: "",
                    description: "",
                    short_description: "",
                    status: "active",
                    type: "simple",
                    category: null,
                    sub_category: null,
                    child_sub_category: null,
                    brand: null,
                    country_of_origin: null,
                    tags: [],
                    pricing: {
                        cost_price: 0,
                        regular_price: 0,
                        sale_price: null,
                        discount: { type: "percentage", value: 0 },
                        price_range: { min: 0, max: 0 }
                    },
                    inventory: {
                        stock_quantity: 0,
                        stock_by_location: [],
                        sold_count: 0
                    },
                    variations: [],
                    has_variations: false,
                    media: { gallery: [], videos: [] },
                    seo: {
                        meta_title: "",
                        meta_description: "",
                        meta_keywords: []
                    }
                });
            } finally {
                setIsLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    const handleSave = async (updatedData) => {
        try {
            // Save current tab before reload
            sessionStorage.setItem('productEditActiveTab', activeTab);
            
            console.log('Sending to API:', JSON.stringify(updatedData, null, 2));
            
            const response = await apiClient.put(`/product/${id}`, updatedData);
            
            console.log('API Response:', response.data);

            Swal.fire({
                icon: "success",
                title: "Success",
                text: "Product updated successfully. Check console for details.",
                showConfirmButton: true
            });

            // Temporarily disabled reload to see logs
            // setTimeout(() => {
            //     window.location.href = window.location.href;
            // }, 1000);

        } catch (error) {
            console.error("Error updating product:", error);
            Swal.fire({
                icon: "error",
                title: "Error",
                text: error.response?.data?.message || "Failed to update product",
            });
        }
    };

    const tabs = [
        { id: "basic", label: "Basic Info", icon: "fa-info-circle" },
        { id: "pricing", label: "Pricing", icon: "fa-dollar-sign" },
        { id: "inventory", label: "Inventory", icon: "fa-box" },
        { id: "shipping", label: "Shipping", icon: "fa-truck" },
        { id: "specifications", label: "Specifications", icon: "fa-list-alt" },
        { id: "additional", label: "Additional Info", icon: "fa-plus-circle" },
        { id: "relations", label: "Relations", icon: "fa-link" },
        { id: "variations", label: "Variations", icon: "fa-layer-group" },
        { id: "media", label: "Media", icon: "fa-image" },
        { id: "seo", label: "SEO", icon: "fa-search" },
    ];

    if (isLoading) {
        return (
            <>
                <Breadcrumb title="Edit Product" />
                <div className="card">
                    <div className="card-body">
                        <Loader />
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <Breadcrumb title={`Edit: ${productData?.name || 'Product'}`} />
            <div className="row">
                <div className="col-md-12">
                    <div className="card">
                        <div className="card-header">
                            <CardHeader
                                title={`Edit Product - ${productData?.name}`}
                                link="/products"
                                icon="fa-list"
                                button_text="Back to List"
                            />
                        </div>

                        <div className="card-body">
                            {/* Tabs Navigation */}
                            <ul className="nav nav-tabs mb-0" role="tablist" style={{ 
                                borderBottom: 'none',
                                backgroundColor: 'transparent',
                                padding: '0'
                            }}>
                                {tabs.map(tab => {
                                    const isActive = activeTab === tab.id;
                                    const isHovered = hoveredTab === tab.id;
                                    const showHoverStyle = !isActive && isHovered;
                                    
                                    return (
                                    <li className="nav-item" key={tab.id}>
                                        <button
                                            onClick={() => setActiveTab(tab.id)}
                                            type="button"
                                            style={{
                                                border: isActive ? '1px solid #6f42c1' : '1px solid #662999',
                                                borderBottom: isActive ? 'none' : '1px solid #662999',
                                                borderRadius: '8px 8px 0 0',
                                                marginRight: '0.25rem',
                                                marginBottom: isActive ? '-1px' : '0',
                                                color: isActive || showHoverStyle ? '#ffffff' : '#b8b8b8',
                                                backgroundColor: isActive ? '#6f42c1' : showHoverStyle ? '#8e4dd1' : '#a22bff',
                                                cursor: 'pointer',
                                                fontWeight: isActive ? '600' : '500',
                                                padding: '0.75rem 1.25rem',
                                                transition: 'none',
                                                fontSize: '0.95rem',
                                                position: 'relative',
                                                zIndex: isActive ? '2' : '1',
                                                opacity: '1',
                                                outline: 'none',
                                                borderColor: showHoverStyle ? '#6f42c1' : (isActive ? '#6f42c1' : '#662999')
                                            }}
                                            onMouseEnter={() => setHoveredTab(tab.id)}
                                            onMouseLeave={() => setHoveredTab(null)}
                                        >
                                            <i className={`fas ${tab.icon} me-2`}></i>
                                            {tab.label}
                                        </button>
                                    </li>
                                    );
                                })}
                            </ul>
                            <div style={{ 
                                borderTop: '1px solid #dee2e6',
                                marginTop: '-1px',
                                paddingTop: '1.5rem'
                            }}>

                            {/* Tab Content */}
                            {activeTab === "basic" && (
                                <BasicInfoTab
                                    data={productData} 
                                    onSave={handleSave}
                                    isSaving={isSaving}
                                />
                            )}
                            {activeTab === "pricing" && (
                                <PricingTab
                                    data={productData} 
                                    onSave={handleSave}
                                    isSaving={isSaving}
                                />
                            )}
                            {activeTab === "inventory" && (
                                <InventoryTab
                                    data={productData} 
                                    onSave={handleSave}
                                    isSaving={isSaving}
                                />
                            )}
                            {activeTab === "shipping" && (
                                <ShippingTab
                                    data={productData} 
                                    onSave={handleSave}
                                    isSaving={isSaving}
                                />
                            )}
                            {activeTab === "specifications" && (
                                <SpecificationsTab
                                    data={productData} 
                                    onSave={handleSave}
                                    isSaving={isSaving}
                                />
                            )}
                            {activeTab === "additional" && (
                                <AdditionalInfoTab
                                    data={productData} 
                                    onSave={handleSave}
                                    isSaving={isSaving}
                                />
                            )}
                            {activeTab === "relations" && (
                                <RelationsTab
                                    data={productData} 
                                    onSave={handleSave}
                                    isSaving={isSaving}
                                />
                            )}
                            {activeTab === "variations" && (
                                <VariationsTab
                                    data={productData} 
                                    onSave={handleSave}
                                    isSaving={isSaving}
                                />
                            )}
                            {activeTab === "media" && (
                                <MediaTab
                                    data={productData} 
                                    onSave={handleSave}
                                    isSaving={isSaving}
                                />
                            )}
                            {activeTab === "seo" && (
                                <SEOTab
                                    data={productData} 
                                    onSave={handleSave}
                                    isSaving={isSaving}
                                />
                            )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ProductEditNew;
