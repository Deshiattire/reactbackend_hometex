import React from 'react'
import { Link } from 'react-router-dom'
import GlobalFunction from '../../assets/GlobalFunction'

export default function SideBar() {
    const {hasAccessToProduct,hasAccessToSale} = GlobalFunction;
    const productExist = hasAccessToProduct();
    const saleExist = hasAccessToSale();
    const hasType = localStorage.employee_type;
    
    return (
        <div id="layoutSidenav_nav">
            <nav className="sb-sidenav accordion bg-theme-basic sb-sidenav-dark" id="sidenavAccordion">
                <div className="sb-sidenav-menu">
                    <div className="nav">
                        <div className="sb-sidenav-menu-heading">Core</div>
                        <Link className="nav-link" to="/">
                            <div className="sb-nav-link-icon"><i className="fas fa-tachometer-alt"></i></div>
                            Dashboard
                        </Link>
                        
                        {/* Approvals Section */}
                        {(!productExist && !saleExist) && (
                            <Link className="nav-link" to="/approvals">
                                <div className="sb-nav-link-icon"><i className="fas fa-clipboard-check"></i></div>
                                Approvals
                            </Link>
                        )}
                        
                        {/* Report start */}
                        {
                                    (!productExist && !saleExist)  &&
                                    <>
                        <div className="sb-sidenav-menu-heading">Reports</div>
                        <Link className="nav-link collapsed" to="#" data-bs-toggle="collapse" data-bs-target="#report" aria-expanded="false" aria-controls="collapseLayouts">
                            <div className="sb-nav-link-icon"><i className="fas fa-columns"></i></div>
                            Report
                            <div className="sb-sidenav-collapse-arrow"><i className="fas fa-angle-down"></i></div>
                        </Link>
                        <div className="collapse" id="report" aria-labelledby="headingOne" data-bs-parent="#sidenavAccordion">
                            <nav className="sb-sidenav-menu-nested nav">
                                <Link className="nav-link" to="/reports">Report List</Link>
                                {/* <Link className="nav-link" to="/orders/create">Create Order</Link> */}
                            </nav>
                        </div>
                        <div className="sb-sidenav-menu-heading">Transfer Product</div>
                        <Link className="nav-link collapsed" to="#" data-bs-toggle="collapse" data-bs-target="#tpfrom" aria-expanded="false" aria-controls="collapseLayouts">
                            <div className="sb-nav-link-icon"><i className="fas fa-columns"></i></div>
                            Transfer
                            <div className="sb-sidenav-collapse-arrow"><i className="fas fa-angle-down"></i></div>
                        </Link>
                        <div className="collapse" id="tpfrom" aria-labelledby="headingOne" data-bs-parent="#sidenavAccordion">
                            <nav className="sb-sidenav-menu-nested nav">
                                <Link className="nav-link" to="/product/transfer/list">List</Link>
                            </nav>
                        </div>
                        </>}
                        {/* Report end */}
                        {
                                    ((productExist && hasType !== "4") || (hasType !== "4"))  &&
                                    <>
                        <div className="sb-sidenav-menu-heading">Product</div>
                        <Link className="nav-link collapsed" to="#" data-bs-toggle="collapse" data-bs-target="#products" aria-expanded="false" aria-controls="collapseLayouts">
                            <div className="sb-nav-link-icon"><i className="fas fa-columns"></i></div>
                            Products
                            <div className="sb-sidenav-collapse-arrow"><i className="fas fa-angle-down"></i></div>
                        </Link>
                        <div className="collapse" id="products" aria-labelledby="headingOne" data-bs-parent="#sidenavAccordion">
                            <nav className="sb-sidenav-menu-nested nav">
                                <Link className="nav-link" to="/products">Products List</Link>
                                
                                      <Link className="nav-link" to="/product/create">Add Product</Link>
                                      <Link className="nav-link" to="/generate-bar-code">Barcode Generator</Link>
                                        {/* <Link className="nav-link" to="/product/trash">Trash Products</Link> */}
                            </nav>
                        </div>
                                    </>
                                }
                        
                        {/* Price Formula */}
                        {/* <Link className="nav-link collapsed" to="#" data-bs-toggle="collapse" data-bs-target="#priceFormula" aria-expanded="false" aria-controls="collapseLayouts">
                            <div className="sb-nav-link-icon"><i className="fas fa-columns"></i></div>
                            Price Formula
                            <div className="sb-sidenav-collapse-arrow"><i className="fas fa-angle-down"></i></div>
                        </Link>
                        <div className="collapse" id="priceFormula" aria-labelledby="headingOne" data-bs-parent="#sidenavAccordion">
                            <nav className="sb-sidenav-menu-nested nav">
                                <Link className="nav-link" to="/price_formula">Price Formula List</Link>
                                <Link className="nav-link" to="/price_formula/create">Add Price Formula</Link>
                            </nav>
                        </div> */}
                        {/* Price Formula End */}
                        {/* {
                            GlobalFunction.isAdmin() &&

                            <> */}
                            {
                                    (!productExist && !saleExist)  &&
                                    <>
                            <div className="sb-sidenav-menu-heading">Shops</div>
                        <Link className="nav-link collapsed" to="#" data-bs-toggle="collapse" data-bs-target="#shop" aria-expanded="false" aria-controls="collapseLayouts">
                            <div className="sb-nav-link-icon"><i className="fas fa-columns"></i></div>
                            Shop
                            <div className="sb-sidenav-collapse-arrow"><i className="fas fa-angle-down"></i></div>
                        </Link>
                        <div className="collapse" id="shop" aria-labelledby="headingOne" data-bs-parent="#sidenavAccordion">
                            <nav className="sb-sidenav-menu-nested nav">
                                <Link className="nav-link" to="/shops">Shop List</Link>
                                <Link className="nav-link" to="/shop/create">Add Shop</Link>
                            </nav>
                        </div>
                        <Link className="nav-link collapsed" to="#" data-bs-toggle="collapse" data-bs-target="#sales_manager" aria-expanded="false" aria-controls="collapseLayouts">
                            <div className="sb-nav-link-icon"><i className="fas fa-columns"></i></div>
                            Employee
                            <div className="sb-sidenav-collapse-arrow"><i className="fas fa-angle-down"></i></div>
                        </Link>
                        <div className="collapse" id="sales_manager" aria-labelledby="headingOne" data-bs-parent="#sidenavAccordion">
                            <nav className="sb-sidenav-menu-nested nav">
                                <Link className="nav-link" to="/employee">Employee List</Link>
                                <Link className="nav-link" to="/employee/create">Add Employee</Link>
                            </nav>
                        </div>
                        <div className="sb-sidenav-menu-heading">Management</div>
                        <Link className="nav-link collapsed" to="#" data-bs-toggle="collapse" data-bs-target="#collapseLayouts" aria-expanded="false" aria-controls="collapseLayouts">
                            <div className="sb-nav-link-icon"><i className="fas fa-columns"></i></div>
                            Category
                            <div className="sb-sidenav-collapse-arrow"><i className="fas fa-angle-down"></i></div>
                        </Link>
                        <div className="collapse" id="collapseLayouts" aria-labelledby="headingOne" data-bs-parent="#sidenavAccordion">
                            <nav className="sb-sidenav-menu-nested nav">
                                <Link className="nav-link" to="/category">Category List</Link>
                                <Link className="nav-link" to="/category/create">Add Category</Link>
                            </nav>
                        </div>
                        <Link className="nav-link collapsed" to="#" data-bs-toggle="collapse" data-bs-target="#sub-category" aria-expanded="false" aria-controls="collapseLayouts">
                            <div className="sb-nav-link-icon"><i className="fas fa-columns"></i></div>
                            Sub-Category
                            <div className="sb-sidenav-collapse-arrow"><i className="fas fa-angle-down"></i></div>
                        </Link>
                        <div className="collapse" id="sub-category" aria-labelledby="headingOne" data-bs-parent="#sidenavAccordion">
                            <nav className="sb-sidenav-menu-nested nav">
                                <Link className="nav-link" to="/sub-category">Sub Category List</Link>
                                <Link className="nav-link" to="/sub-category/create">Add Sub Category</Link>
                            </nav>
                        </div>
                        <Link className="nav-link collapsed" to="#" data-bs-toggle="collapse" data-bs-target="#child-sub-category" aria-expanded="false" aria-controls="collapseLayouts">
                            <div className="sb-nav-link-icon"><i className="fas fa-columns"></i></div>
                            Child-Sub-Category
                            <div className="sb-sidenav-collapse-arrow"><i className="fas fa-angle-down"></i></div>
                        </Link>
                        <div className="collapse" id="child-sub-category" aria-labelledby="headingOne" data-bs-parent="#sidenavAccordion">
                            <nav className="sb-sidenav-menu-nested nav">
                                <Link className="nav-link" to="/child-sub-category">Child Sub Category List</Link>
                                <Link className="nav-link" to="/child-sub-category/create">Add Child Sub Category</Link>
                            </nav>
                        </div>
                        <Link className="nav-link collapsed" to="#" data-bs-toggle="collapse" data-bs-target="#brand" aria-expanded="false" aria-controls="collapseLayouts">
                            <div className="sb-nav-link-icon"><i className="fas fa-columns"></i></div>
                            Brands
                            <div className="sb-sidenav-collapse-arrow"><i className="fas fa-angle-down"></i></div>
                        </Link>
                        <div className="collapse" id="brand" aria-labelledby="headingOne" data-bs-parent="#sidenavAccordion">
                            <nav className="sb-sidenav-menu-nested nav">
                                <Link className="nav-link" to="/brand">Brand List</Link>
                                <Link className="nav-link" to="/brand/create">Add Brand</Link>
                            </nav>
                        </div>
                        <Link className="nav-link collapsed" to="#" data-bs-toggle="collapse" data-bs-target="#supplier" aria-expanded="false" aria-controls="collapseLayouts">
                            <div className="sb-nav-link-icon"><i className="fas fa-columns"></i></div>
                            Suppliers
                            <div className="sb-sidenav-collapse-arrow"><i className="fas fa-angle-down"></i></div>
                        </Link>
                        <div className="collapse" id="supplier" aria-labelledby="headingOne" data-bs-parent="#sidenavAccordion">
                            <nav className="sb-sidenav-menu-nested nav">
                                <Link className="nav-link" to="/suppliers">Suppliers List</Link>
                                <Link className="nav-link" to="/supplier/create">Add Supplier</Link>
                            </nav>
                        </div>
                        <Link className="nav-link" to="/product-attributes">
                            <div className="sb-nav-link-icon"><i className="fas fa-table"></i></div>
                            Product Attributes
                        </Link>
                        <Link className="nav-link collapsed" to="#" data-bs-toggle="collapse" data-bs-target="#settings" aria-expanded="false" aria-controls="collapseLayouts">
                            <div className="sb-nav-link-icon"><i className="fas fa-columns"></i></div>
                            Settings
                            <div className="sb-sidenav-collapse-arrow"><i className="fas fa-angle-down"></i></div>
                        </Link>
                        <div className="collapse" id="settings" aria-labelledby="headingOne" data-bs-parent="#settingsAccordion">
                            <nav className="sb-sidenav-menu-nested nav">
                                <Link className="nav-link" to="/ecommerce/menu-list">Menu List</Link>
                                <Link className="nav-link" to="/ecommerce/menu-add">Add Menu</Link>
                            </nav>
                        </div>
                        </>}
                            {/* </>
                        } */}
                        {/* POS start */}
                        {
                                    ((saleExist && hasType !== "3") || (hasType !== "3"))  &&
                                    <>
                        
                        <div className="sb-sidenav-menu-heading">Pos System</div>
                        <Link className="nav-link collapsed" to="#" data-bs-toggle="collapse" data-bs-target="#order" aria-expanded="false" aria-controls="collapseLayouts">
                            <div className="sb-nav-link-icon"><i className="fas fa-columns"></i></div>
                            Sales
                            <div className="sb-sidenav-collapse-arrow"><i className="fas fa-angle-down"></i></div>
                        </Link>
                        <div className="collapse" id="order" aria-labelledby="headingOne" data-bs-parent="#sidenavAccordion">
                            <nav className="sb-sidenav-menu-nested nav">
                                <Link className="nav-link" to="/orders">Order List</Link>
                                <Link className="nav-link" to="/orders/create">Create Order</Link>
                            </nav>
                        </div>
                        {/* POS end */}
                        
                        </>}
                    </div>
                </div>
                <div className="sb-sidenav-footer bg-theme text-silver">
                    <div className="small">Logged in as:</div>
                    {localStorage.name !== undefined ? localStorage.name : null}
                </div>
            </nav>
        </div>
    )
}
