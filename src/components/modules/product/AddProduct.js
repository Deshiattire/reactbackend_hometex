import React, { useEffect, useState } from "react";
import Breadcrumb from "../../partoals/Breadcrumb";
import Constants from "../../../Constants";
import Swal from "sweetalert2";
import CardHeader from "../../partoals/miniComponents/CardHeader";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Select from "react-select";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const AddProduct = () => {
    const navigate = useNavigate();
    const [input, setInput] = useState({ status: 1 });
    const [attribute_input, setAttribute_input] = useState({});
    const [specification_input, setSpecification_input] = useState({});
    const [errors, setErrors] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [categories, setCategories] = useState([]);
    const [subCategories, setSubCategories] = useState([]);
    const [childSubCategories, setChildSubCategories] = useState([]);
    const [brands, setBrands] = useState([]);
    const [allSubcategories, setAllSubcategories] = useState([]);
    const [allChildSubcategories, setAllChildSubcategories] = useState([]);
    const [countries, setCountries] = useState([]);
    const [shops, setShops] = useState([]);
    const [suppliers, setSuppliers] = useState([]);
    const [attributes, setAttributes] = useState([]);
    const [attributeFiled, setAttributeField] = useState([]);
    const [attributeFieldId, setAttributeFieldId] = useState(1);
    const [specificationFiled, setSpecificationFiled] = useState([]);
    const [specificationFiledId, setSpecificationFiledId] = useState(1);
    const [selectedShops, setSelectedShops] = useState([]);
    const [quantities, setQuantities] = useState({});
    const [totalStock, setTotalStock] = useState(0);
    const [selectedAttributeShops, setSelectedAttributeShops] = useState([]);
    const [attributeShopQuantities, setAttributeShopQuantities] = useState({});
    

    // const handleAttributeShopChange = selectedOptions => {

    //     console.log(selectedOptions, 'selectedOptions')
    //     setSelectedAttributeShops(selectedOptions);
    //     const newQuantities = { ...attributeShopQuantities };
    //     selectedOptions.forEach(option => {
    //         console.log(option, 'option')
    //         if (!newQuantities[option.value]) {
    //             newQuantities[option.value] = "";
    //         }
    //     });
    //     setAttributeShopQuantities(newQuantities);
    // };

    const handleAttributeShopChange = (row_no, e) => {
        setAttributeShopQuantities({
            ...attributeShopQuantities,
            [row_no]: e
        });
    };

    const handleAttributeQuantityChange = (shopId, quantity) => {
        setAttributeShopQuantities(prev => ({ ...prev, [shopId]: quantity }));
    };




    const handleDescriptionChange = (value) => {
        setInput((prevState) => ({
            ...prevState,
            description: value,
        }));
    };
    // Define shop_quantities variable
    const shop_quantities = selectedShops.map((shop) => ({
        shop_id: shop.value,
        quantity: quantities[shop.value] || 0,
    }));

    useEffect(() => {
        const newTotalStock = Object.values(quantities).reduce(
            (acc, currentQuantity) => acc + currentQuantity,
            0
        );
        setTotalStock(newTotalStock);
    }, [quantities]);

    const handleCheckbox = (event) => {
        const { name, checked } = event.target;
        setInput((prevState) => ({
            ...prevState,
            [name]: checked,
        }));
    };

    const handleSpecificationFieldRemove = (id) => {
        setSpecificationFiled((oldValues) =>
            oldValues.filter((specificationFiled) => specificationFiled !== id)
        );
        setSpecification_input((current) => {
            const copy = { ...current };
            delete copy[id];
            return copy;
        });
        setSpecificationFiledId(specificationFiledId - 1);
    };

    const handleSpecificationFields = (id) => {
        setSpecificationFiledId(specificationFiledId + 1);
        setSpecificationFiled((prevState) => [...prevState, specificationFiledId]);
    };

    const handleAttributeFieldsRemove = (id) => {
        setAttributeField((oldValues) =>
            oldValues.filter((attributeFiled) => attributeFiled !== id)
        );
        setAttribute_input((current) => {
            const copy = { ...current };
            delete copy[id];
            return copy;
        });
        setAttributeFieldId(attributeFieldId - 1);
    };

    const handleAttributeFields = (id) => {
        if (attributes.length >= attributeFieldId) {
            setAttributeFieldId(attributeFieldId + 1);
            setAttributeField((prevState) => [...prevState, attributeFieldId]);
        }
    };

    const handleSpecificationInput = (e, id) => {
        setSpecification_input((prevState) => ({
            ...prevState,
            [id]: {
                ...prevState[id],
                [e.target.name]: e.target.value,
            },
        }));
    };

    const updateTotalAttributeCost = () => {
        const totalAttributeCost = Object.values(attribute_input).reduce(
            (total, attribute) => {
                const attributeCost = parseFloat(attribute.attribute_cost) || 0;
                console.log("Current attribute cost: ", attributeCost);
                return total + attributeCost;
            },
            0
        );

        setInput((prevState) => ({
            ...prevState,
            cost: totalAttributeCost.toFixed(2),
        }));
    };

    const handleAttributeInput = (e, id) => {
        const { name, value } = e.target;
    
        setAttribute_input((prevState) => {
            let newState = { ...prevState };
    
            // Ensure the attribute entry and shop_quantities are initialized
            if (!newState[id]) {
                newState[id] = { shop_quantities: {} };
            } else if (!newState[id].shop_quantities) {
                newState[id].shop_quantities = {};
            }
    
            if (
                name === "attribute_id" ||
                name === "value_id" ||
                name === "math_sign" ||
                name === "number" ||
                name === "attribute_cost" ||
                name === "attribute_weight" ||
                name === "attribute_mesarment"
            ) {
                newState = {
                    ...newState,
                    [id]: {
                        ...newState[id],
                        [name]: value,
                    },
                };
            }
    
            // Special handling for shop quantities
            if (name.startsWith("shop_quantity_")) {
                const shopId = name.split("_")[2]; // Assuming name is structured as "shop_quantity_{shopId}"
                newState[id].shop_quantities = {
                    ...newState[id].shop_quantities,
                    [shopId]: value, // Store quantity using shopId as key
                };
            }
    
            if (name === "attribute_cost") {
                setTimeout(() => updateTotalAttributeCost(), 0); // Ensures recalculation happens after state update
            }
    
            return newState;
        });
    };
    
    

    useEffect(() => {
        updateTotalAttributeCost();

        return () => { };
    }, [attribute_input]);

    const getAddProductData = () => {
        const token = localStorage.getItem("token");
        axios
            .get(`${Constants.BASE_URL}/get-add-product-data`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then((res) => {
                setCategories(res.data.categories);
                setBrands(res.data.brands);
                setCountries(res.data.countries);
                setSuppliers(res.data.providers);
                setAttributes(res.data.attributes);
                setAllSubcategories(res.data.sub_categories);
                setAllChildSubcategories(res.data.child_sub_categories);
                setShops(res.data.shops);
            });
    };

    const shopIds = shop_quantities.map((item) => item.shop_id);

    const calculateTotalStock = (shopQuantities) => {
        let totalStock = 0;
        shopQuantities.forEach((shop) => {
            totalStock += parseInt(shop.quantity, 10);
        });
        return totalStock;
    };


    const handleInput = (e) => {
        const { name, value } = e.target;
        if (name === "name") {
            const slug = value.toLowerCase().replaceAll(" ", "-");
            setInput((prevState) => ({
                ...prevState,
                name: value,
                slug,
            }));
            return;
        }
        if (name === "category_id" || name === "sub_category_id") {
            const parsedId = parseInt(value, 10);
            if (!Number.isNaN(parsedId)) {
                const targetStateSetter = name === "category_id" ? setSubCategories : setChildSubCategories;
                const relatedData = name === "category_id" ? allSubcategories : allChildSubcategories;

                const filteredData = relatedData.filter(item => item[`${name}`] === parsedId);
                targetStateSetter(filteredData);

                if (name === "category_id") {
                    setChildSubCategories([]);
                }

                setInput((prevState) => ({ ...prevState, [name]: parsedId }));
                return;
            }
        }
        if (name === "cost") {
            if (value.trim() === "") {
                setInput((prevState) => ({ ...prevState, cost: "" }));
                return;
            }

            const numericCost = parseFloat(value);
            if (!Number.isNaN(numericCost)) {
                setInput((prevState) => ({ ...prevState, cost: numericCost }));
                return;
            } else {
                return;
            }
        }
        setInput((prevState) => ({ ...prevState, [name]: value }));
    };




    const handlePhoto = (e) => {
        let file = e.target.files[0];
        let reader = new FileReader();
        reader.onloadend = () => {
            setInput((prevState) => ({ ...prevState, photo: reader.result }));
        };
        reader.readAsDataURL(file);
    };

    const handleProductCreate = () => {
        setIsLoading(true);
        const token = localStorage.getItem("token");

        // Use the shop_quantities variable
        const payload = {
            ...input,
            shop_quantities: shop_quantities,
            stock: totalStock,
            shop_ids: shopIds
        };

        axios
            .post(`${Constants.BASE_URL}/product`, payload, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then((res) => {
                setIsLoading(false);
                Swal.fire({
                    position: "top-end",
                    icon: res.data.cls,
                    title: res.data.msg,
                    showConfirmButton: false,
                    toast: true,
                    timer: 1500,
                });
                if (res.data.product_id != undefined) {
                    navigate("/product/photo/" + res.data.product_id);
                }
            })
            .catch((errors) => {
                setIsLoading(false);
                if (errors.response.status == 422) {
                    setErrors(errors.response.data.errors);
                }
            });
    };

    useEffect(() => {
        getAddProductData();
    }, []);

    useEffect(() => {
        setInput((prevState) => ({ ...prevState, attributes: attribute_input }));
    }, [attribute_input]);

    useEffect(() => {
        setInput((prevState) => ({
            ...prevState,
            specifications: specification_input
        }));
    }, [specification_input]);

    const handleMulipleSelect = (e) => {
        let value = [];
        for (const item of e) {
            value.push(item.value);
        }
        setInput((prevState) => ({ ...prevState, shop_ids: value }));
    };

    useEffect(() => {
        let total = 0;
        for (const shop of selectedShops) {
            const quantity = quantities[shop.value] || 0;
            total += quantity;
        }
        setTotalStock(total);
    }, [selectedShops, quantities]);

    const handleShopSelect = (selectedOptions) => {
        setSelectedShops(selectedOptions);
    };

    const handleQuantityChange = (event, shopId) => {
        const newQuantities = { ...quantities };
        newQuantities[shopId] = parseInt(event.target.value, 10) || 0;
        setQuantities(newQuantities);
    };



    return (
        <>
            <Breadcrumb title={"Add Product"} />
            <div className="row">
                <div className="col-md-12">
                    <div className="card">
                        <div className="card-header">
                            <CardHeader
                                title={"Add Product"}
                                link={"/products"}
                                icon={"fa-list"}
                                button_text={"List"}
                            />
                        </div>
                        <div className="card-body">
                            <div className="row">
                                <div className="col-md-12">
                                    <label className="w-100 mt-4">
                                        <p>Select Shop(s)</p>
                                        <Select
                                            isMulti
                                            options={shops}
                                            onChange={handleShopSelect}
                                            placeholder="Select Shop(s)"
                                            value={selectedShops}
                                        />
                                    </label>
                                </div>

                                {selectedShops.map((shop) => (
                                    <div className="col-md-6" key={shop.value}>
                                        <label className="w-100 mt-4">
                                            <p>Product Stock for {shop.label}</p>
                                            <input
                                                className="form-control mt-2"
                                                type="number"
                                                name={`stock_${shop.value}`}
                                                value={quantities[shop.value] || ""}
                                                onChange={(e) => handleQuantityChange(e, shop.value)}
                                                placeholder={`Enter Product Stock for ${shop.label}`}
                                            />
                                        </label>
                                    </div>
                                ))}
                                <div className="col-md-6">
                                    <label className={"w-100 mt-4"}>
                                        <p>Name</p>
                                        <input
                                            className={
                                                errors.name != undefined
                                                    ? "form-control mt-2 is-invalid"
                                                    : "form-control mt-2"
                                            }
                                            type={"text"}
                                            name={"name"}
                                            value={input.name}
                                            onChange={handleInput}
                                            placeholder={"Enter Product name"}
                                        />
                                        <p className={"login-error-msg"}>
                                            <small>
                                                {errors.name != undefined ? errors.name[0] : null}
                                            </small>
                                        </p>
                                    </label>
                                </div>
                                <div className="col-md-6">
                                    <label className={"w-100 mt-4"}>
                                        <p>Slug</p>
                                        <input
                                            className={
                                                errors.slug != undefined
                                                    ? "form-control mt-2 is-invalid"
                                                    : "form-control mt-2"
                                            }
                                            type={"text"}
                                            name={"slug"}
                                            value={input.slug}
                                            onChange={handleInput}
                                            placeholder={"Enter Product slug"}
                                        />
                                        <p className={"login-error-msg"}>
                                            <small>
                                                {errors.slug != undefined ? errors.slug[0] : null}
                                            </small>
                                        </p>
                                    </label>
                                </div>
                                <div className="col-md-6">
                                    <label className={"w-100 mt-4"}>
                                        <p>Select Category</p>
                                        <select
                                            className={
                                                errors.category_id != undefined
                                                    ? "form-select mt-2 is-invalid"
                                                    : "form-select mt-2"
                                            }
                                            name={"category_id"}
                                            value={input.category_id}
                                            onChange={handleInput}
                                            placeholder={"Select product category"}
                                        >
                                            <option>Select Category</option>
                                            {categories.map((category, index) => (
                                                <option value={category.id} key={index}>
                                                    {category.name}
                                                </option>
                                            ))}
                                        </select>
                                        <p className={"login-error-msg"}>
                                            <small>
                                                {errors.category_id != undefined
                                                    ? errors.category_id[0]
                                                    : null}
                                            </small>
                                        </p>
                                    </label>
                                </div>
                                <div className="col-md-6">
                                    <label className={"w-100 mt-4"}>
                                        <p>Select Sub Category</p>
                                        <select
                                            className={
                                                errors.sub_category_id != undefined
                                                    ? "form-select mt-2 is-invalid"
                                                    : "form-select mt-2"
                                            }
                                            name={"sub_category_id"}
                                            value={input.sub_category_id}
                                            onChange={handleInput}
                                            placeholder={"Select product sub category"}
                                            disabled={input.category_id == undefined}
                                        >
                                            <option>Select Sub Category</option>
                                            {subCategories.map((sub_category, index) => (
                                                <option value={sub_category.id} key={index}>
                                                    {sub_category.name}
                                                </option>
                                            ))}
                                        </select>
                                        <p className={"login-error-msg"}>
                                            <small>
                                                {errors.sub_category_id != undefined
                                                    ? errors.sub_category_id[0]
                                                    : null}
                                            </small>
                                        </p>
                                    </label>
                                </div>
                                <div className="col-md-6">
                                    <label className={"w-100 mt-4"}>
                                        <p>Select Child Sub Category</p>
                                        <select
                                            className={
                                                errors.child_sub_category_id != undefined
                                                    ? "form-select mt-2 is-invalid"
                                                    : "form-select mt-2"
                                            }
                                            name={"child_sub_category_id"}
                                            value={input.child_sub_category_id}
                                            onChange={handleInput}
                                            placeholder={"Select product child sub category"}
                                            disabled={input.sub_category_id == undefined}
                                        >
                                            <option>Select Child Sub Category</option>
                                            {childSubCategories.map((child_sub_category, index) => (
                                                <option value={child_sub_category.id} key={index}>
                                                    {child_sub_category.name}
                                                </option>
                                            ))}
                                        </select>
                                        <p className={"login-error-msg"}>
                                            <small>
                                                {errors.child_sub_category_id != undefined
                                                    ? errors.child_sub_category_id[0]
                                                    : null}
                                            </small>
                                        </p>
                                    </label>
                                </div>
                                <div className="col-md-6">
                                    <label className={"w-100 mt-4"}>
                                        <p>Select Brand</p>
                                        <select
                                            className={
                                                errors.brand_id != undefined
                                                    ? "form-select mt-2 is-invalid"
                                                    : "form-select mt-2"
                                            }
                                            name={"brand_id"}
                                            value={input.brand_id}
                                            onChange={handleInput}
                                            placeholder={"Select product brand"}
                                        >
                                            <option>Select Brand</option>
                                            {brands.map((brand, index) => (
                                                <option value={brand.id} key={index}>
                                                    {brand.name}
                                                </option>
                                            ))}
                                        </select>
                                        <p className={"login-error-msg"}>
                                            <small>
                                                {errors.brand_id != undefined
                                                    ? errors.brand_id[0]
                                                    : null}
                                            </small>
                                        </p>
                                    </label>
                                </div>
                                <div className="col-md-6">
                                    <label className={"w-100 mt-4"}>
                                        <p>Select Product Origin</p>
                                        <select
                                            className={
                                                errors.country_id != undefined
                                                    ? "form-select mt-2 is-invalid"
                                                    : "form-select mt-2"
                                            }
                                            name={"country_id"}
                                            value={input.country_id}
                                            onChange={handleInput}
                                            placeholder={"Select product origin"}
                                        >
                                            <option>Select Product Origin</option>
                                            {countries.map((country, index) => (
                                                <option value={country.id} key={index}>
                                                    {country.name}
                                                </option>
                                            ))}
                                        </select>
                                        <p className={"login-error-msg"}>
                                            <small>
                                                {errors.country_id != undefined
                                                    ? errors.country_id[0]
                                                    : null}
                                            </small>
                                        </p>
                                    </label>
                                </div>
                                <div className="col-md-6">
                                    <label className={"w-100 mt-4"}>
                                        <p>Select Product Supplier</p>
                                        <select
                                            className={
                                                errors.supplier_id != undefined
                                                    ? "form-select mt-2 is-invalid"
                                                    : "form-select mt-2"
                                            }
                                            name={"supplier_id"}
                                            value={input.supplier_id}
                                            onChange={handleInput}
                                            placeholder={"Select product supplier"}
                                        >
                                            <option>Select Product Supplier</option>
                                            {suppliers.map((supplier, index) => (
                                                <option value={supplier.id} key={index}>
                                                    {supplier.name} - {supplier.phone}
                                                </option>
                                            ))}
                                        </select>
                                        <p className={"login-error-msg"}>
                                            <small>
                                                {errors.supplier_id != undefined
                                                    ? errors.supplier_id[0]
                                                    : null}
                                            </small>
                                        </p>
                                    </label>
                                </div>
                                <div className="col-md-6">
                                    <label className={"w-100 mt-4"}>
                                        <p>Status</p>
                                        <select
                                            className={
                                                errors.status != undefined
                                                    ? "form-select mt-2 is-invalid"
                                                    : "form-select mt-2"
                                            }
                                            name={"status"}
                                            value={input.status}
                                            onChange={handleInput}
                                            placeholder={"Select product status"}
                                        >
                                            <option value={1}>Active</option>
                                            <option value={0}>Inactive</option>
                                        </select>
                                        <p className={"login-error-msg"}>
                                            <small>
                                                {errors.status != undefined ? errors.status[0] : null}
                                            </small>
                                        </p>
                                    </label>
                                </div>

                                <div className="col-md-12">
                                    <div className="card my-4">
                                        <div className="card-header">
                                            <h5>Select Product Attribute</h5>
                                        </div>
                                        <div className="card-body">

                                            {/* attributeShopQuantities  */}


                                            {attributeFiled.map((id, ind) => {
                                                let data_obj = []
                                                if (attributeShopQuantities.hasOwnProperty(id)) {
                                                    data_obj = attributeShopQuantities[id]
                                                }

                                                return (<>
                                                    <div
                                                        key={ind}
                                                        className="row my-2 align-items-baseline"
                                                    >
                                                        <div className="col-md-2">
                                                            <label className={"w-100 mt-4"}>
                                                                <p>Select Attribute</p>
                                                                <select
                                                                    className="form-select mt-2"
                                                                    name={"attribute_id"}
                                                                    value={
                                                                        attribute_input[id] != undefined
                                                                            ? attribute_input[id].attribute_id
                                                                            : null
                                                                    }
                                                                    onChange={(e) => handleAttributeInput(e, id)}
                                                                    placeholder={"Select product attribute"}
                                                                >
                                                                    <option>Select Attribute</option>
                                                                    {attributes.map((value, index) => (
                                                                        <option value={value.id}>{value.name}</option>
                                                                    ))}
                                                                </select>
                                                                <p className={"login-error-msg"}>
                                                                    <small>
                                                                        {errors.attribute_id != undefined
                                                                            ? errors.attribute_id[0]
                                                                            : null}
                                                                    </small>
                                                                </p>
                                                            </label>
                                                        </div>
                                                        <div className="col-md-2">
                                                            <label className={"w-100 mt-4"}>
                                                                <p>Select Attribute Value</p>
                                                                <select
                                                                    className={"form-select mt-2"}
                                                                    name={"value_id"}
                                                                    value={
                                                                        attribute_input[id] != undefined
                                                                            ? attribute_input[id].value_id
                                                                            : null
                                                                    }
                                                                    onChange={(e) => handleAttributeInput(e, id)}
                                                                    placeholder={"Select product attribute value"}
                                                                >
                                                                    <option>Select Attribute Value</option>
                                                                    {attributes.map((value, index) => (
                                                                        <>
                                                                            {attribute_input[id] != undefined &&
                                                                                value.id == attribute_input[id].attribute_id
                                                                                ? value.value.map(
                                                                                    (atr_value, value_ind) => (
                                                                                        <option value={atr_value.id}>
                                                                                            {atr_value.name}
                                                                                        </option>
                                                                                    )
                                                                                )
                                                                                : null}
                                                                        </>
                                                                    ))}
                                                                </select>
                                                                <p className={"login-error-msg"}>
                                                                    <small>
                                                                        {errors.attribute_id != undefined
                                                                            ? errors.attribute_id[0]
                                                                            : null}
                                                                    </small>
                                                                </p>
                                                            </label>
                                                        </div>
                                                        {/*  */}
                                                        <div className="col-md-2">
                                                            <label className="w-100 mt-4">
                                                                <p>Select Mathematical Sign</p>
                                                                <select
                                                                    className="form-select mt-2"
                                                                    name="math_sign"
                                                                    value={attribute_input[id]?.math_sign || ""}
                                                                    onChange={(e) => handleAttributeInput(e, id)}
                                                                >
                                                                    <option value="">Select Sign</option>
                                                                    <option value="+">+</option>
                                                                    <option value="-">-</option>
                                                                    <option value="*">*</option>
                                                                    <option value="/">/</option>
                                                                </select>
                                                            </label>
                                                        </div>

                                                        <div className="col-md-2">
                                                            <label className="w-100 mt-4">
                                                                <p>Enter amount</p>
                                                                <input
                                                                    type="number"
                                                                    className="form-control mt-2"
                                                                    name="number"
                                                                    value={attribute_input[id]?.number || ""}
                                                                    onChange={(e) => handleAttributeInput(e, id)}
                                                                />
                                                            </label>
                                                        </div>
                                                        <div className="col-md-2">
                                                            <label className="w-100 mt-4">
                                                                <p>Product Cost</p>
                                                                <input
                                                                    type="number"
                                                                    className="form-control mt-2"
                                                                    name="attribute_cost"
                                                                    value={
                                                                        attribute_input[id]?.attribute_cost || ""
                                                                    }
                                                                    onChange={(e) => handleAttributeInput(e, id)}
                                                                />
                                                            </label>
                                                        </div>
                                                        <div className="col-md-2">
                                                            {/* Multi-Select Dropdown for Shops */}
                                                            <Select
                                                                options={shops} // Ensure 'shops' is in the format [{ value: 1, label: "Main Branch" }, ...]
                                                                isMulti
                                                                onChange={(e) => { handleAttributeShopChange(id, e) }}
                                                                // onChange={handleAttributeShopChange}
                                                                // onChange={(e) => { handleAttributeShopChange(id, e) }}
                                                                className="mb-3"
                                                                placeholder="Select Shops"
                                                            />

                                                            {/* Display Quantity Inputs for Selected Shops */}
                                                            {/* {selectedAttributeShops.map((shop) => (
                                                            <div key={shop.value} className="mb-2">
                                                                <label>{shop.label} Quantity</label>
                                                                <input
                                                                    type="number"
                                                                    className="form-control"
                                                                    // value={
                                                                    //     attributeShopQuantities[shop.value] || ""
                                                                    // }
                                                                    onChange={(e) =>
                                                                        handleAttributeQuantityChange(
                                                                            shop.value,
                                                                            e.target.value
                                                                        )
                                                                    }
                                                                />
                                                            </div>
                                                            ))} */}

                                                            {
                                                                data_obj.length > 0 && data_obj.map((shop, index) => {
                                                                    const inputName = `shop_quantity_${shop.value}`;
                                                                    return (
                                                                        <div key={shop.value} className="mb-2">
                                                                            <label>{shop.label} Quantity</label>
                                                                            <input
                                                                                type="number"
                                                                                className="form-control"
                                                                                name={inputName}
                                                                                value={attribute_input[id]?.shop_quantities?.[shop.value] || ""}
                                                                                onChange={(e) => handleAttributeInput(e, id)}
                                                                            />
                                                                        </div>
                                                                    );
                                                                })
                                                            }
                                                        </div>
                                                        <div className="col-md-2">
                                                            <label className="w-100 mt-4">
                                                                <p>Product Weight (Gram)</p>
                                                                <input
                                                                    type="number"
                                                                    className="form-control mt-2"
                                                                    name="attribute_weight"
                                                                    value={
                                                                        attribute_input[id]?.attribute_weight || ""
                                                                    }
                                                                    onChange={(e) => handleAttributeInput(e, id)}
                                                                />
                                                            </label>
                                                        </div>
                                                        <div className="col-md-2">
                                                            <label className="w-100 mt-4">
                                                                <p>Product Mesarment</p>
                                                                <input
                                                                    type="text"
                                                                    className="form-control mt-2"
                                                                    name="attribute_mesarment"
                                                                    value={
                                                                        attribute_input[id]?.attribute_mesarment || ""
                                                                    }
                                                                    onChange={(e) => handleAttributeInput(e, id)}
                                                                />
                                                            </label>
                                                        </div>
                                                        {/*  */}
                                                        <div className="col-md-2">
                                                            {attributeFiled.length - 1 == ind ? (
                                                                <button
                                                                    className={"btn btn-danger"}
                                                                    onClick={() => handleAttributeFieldsRemove(id)}
                                                                >
                                                                    <i className="fa-solid fa-minus" />
                                                                </button>
                                                            ) : null}
                                                        </div>
                                                    </div>
                                                </>)
                                            })}

                                            <div className="row">
                                                <div className="col-md-12 text-center">
                                                    <button
                                                        className={"btn btn-success"}
                                                        onClick={handleAttributeFields}
                                                    >
                                                        <i className="fa-solid fa-plus" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-12">
                                    <div className="card my-4">
                                        <div className="card-header">
                                            <h5>Product Specifications</h5>
                                        </div>
                                        <div className="card-body">
                                            {specificationFiled.map((id, ind) => (
                                                <div
                                                    key={ind}
                                                    className="row my-2 align-items-baseline"
                                                >
                                                    <div className="col-md-5">
                                                        <label className={"w-100 mt-4"}>
                                                            <p>Specification Name</p>
                                                            <input
                                                                className={"form-control mt-2"}
                                                                type={"text"}
                                                                name={"name"}
                                                                value={
                                                                    specification_input[id] != undefined
                                                                        ? specification_input[id].name
                                                                        : null
                                                                }
                                                                onChange={(e) =>
                                                                    handleSpecificationInput(e, id)
                                                                }
                                                                placeholder={"Enter Product Specification Name"}
                                                            />
                                                            <p className={"login-error-msg"}>
                                                                <small>
                                                                    {errors.name != undefined
                                                                        ? errors.name[0]
                                                                        : null}
                                                                </small>
                                                            </p>
                                                        </label>
                                                    </div>
                                                    <div className="col-md-5">
                                                        <label className={"w-100 mt-4"}>
                                                            <p>Specification Value</p>
                                                            <input
                                                                className="form-control mt-2"
                                                                type={"text"}
                                                                name={"value"}
                                                                value={
                                                                    specification_input[id] != undefined
                                                                        ? specification_input[id].value
                                                                        : null
                                                                }
                                                                onChange={(e) =>
                                                                    handleSpecificationInput(e, id)
                                                                }
                                                                placeholder={"Enter Product Specification Name"}
                                                            />
                                                            <p className={"login-error-msg"}>
                                                                <small>
                                                                    {errors.name != undefined
                                                                        ? errors.name[0]
                                                                        : null}
                                                                </small>
                                                            </p>
                                                        </label>
                                                    </div>
                                                    <div className="col-md-2">
                                                        {specificationFiled.length - 1 == ind ? (
                                                            <button
                                                                className={"btn btn-danger"}
                                                                onClick={() =>
                                                                    handleSpecificationFieldRemove(id)
                                                                }
                                                            >
                                                                <i className="fa-solid fa-minus" />
                                                            </button>
                                                        ) : null}
                                                    </div>
                                                </div>
                                            ))}

                                            <div className="row">
                                                <div className="col-md-12 text-center">
                                                    <button
                                                        className={"btn btn-success"}
                                                        onClick={handleSpecificationFields}
                                                    >
                                                        <i className="fa-solid fa-plus" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-md-12">
                                    <div className="card my-4">
                                        <div className="card-header">
                                            <h5>Product SEO Friendly Info</h5>
                                        </div>
                                        <div className="card-body">
                                            <div className="row">
                                                <div className="col-md-6">
                                                    <label className={"w-100 mt-4"}>
                                                        <p>Mata Title</p>
                                                        <input
                                                            className={"form-control mt-2"}
                                                            type="text"
                                                            name="meta_title"
                                                            value={input.meta_title}
                                                            onChange={handleInput}
                                                            placeholder={"Enter Product Meta Title"}
                                                        />
                                                        <p className={"login-error-msg"}>
                                                            <small>
                                                                {errors.meta_title != undefined
                                                                    ? errors.meta_title[0]
                                                                    : null}
                                                            </small>
                                                        </p>
                                                    </label>
                                                </div>
                                                <div className="col-md-6">
                                                    <label className={"w-100 mt-4"}>
                                                        <p>Mata Keyword</p>
                                                        <input
                                                            className={"form-control mt-2"}
                                                            type="text"
                                                            name="meta_keywords"
                                                            value={input.meta_keywords}
                                                            onChange={handleInput}
                                                            placeholder={"Enter Product Meta Keyword"}
                                                        />
                                                        <p className={"login-error-msg"}>
                                                            <small>
                                                                {errors.meta_keywords != undefined
                                                                    ? errors.meta_keywords[0]
                                                                    : null}
                                                            </small>
                                                        </p>
                                                    </label>
                                                </div>
                                                <div className="col-md-12">
                                                    <label className={"w-100 mt-4"}>
                                                        <p>Mata Description</p>
                                                        <input
                                                            className={"form-control mt-2"}
                                                            type="text"
                                                            name="meta_description"
                                                            value={input.meta_description}
                                                            onChange={handleInput}
                                                            placeholder={"Enter Product Meta Description"}
                                                        />
                                                        <p className={"login-error-msg"}>
                                                            <small>
                                                                {errors.meta_description != undefined
                                                                    ? errors.meta_description[0]
                                                                    : null}
                                                            </small>
                                                        </p>
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-md-12 my-4">
                                    <div className="card">
                                        <div className="card-header">
                                            <h5>Product Price and Stock</h5>
                                        </div>
                                        <div className="card-body">
                                            <div className="row">
                                                <div className="col-md-6">
                                                    <label className={"w-100 mt-4"}>
                                                        <p>Product Cost</p>
                                                        <input
                                                            className={
                                                                errors.cost != undefined
                                                                    ? "form-control mt-2 is-invalid"
                                                                    : "form-control mt-2"
                                                            }
                                                            type={"number"}
                                                            name={"cost"}
                                                            value={input.cost}
                                                            onChange={handleInput}
                                                            placeholder={"Enter Product Cost"}
                                                        />
                                                        <p className={"login-error-msg"}>
                                                            <small>
                                                                {errors.cost != undefined
                                                                    ? errors.cost[0]
                                                                    : null}
                                                            </small>
                                                        </p>
                                                    </label>
                                                </div>
                                                <div className="col-md-6">
                                                    <label className={"w-100 mt-4"}>
                                                        <p>Product Sale Price</p>
                                                        <input
                                                            className={
                                                                errors.price !== undefined
                                                                    ? "form-control mt-2 is-invalid"
                                                                    : "form-control mt-2"
                                                            }
                                                            type="number"
                                                            name="price"
                                                            value={input.price}
                                                            onChange={handleInput}
                                                            placeholder="Enter Product Price"
                                                        />
                                                        <p className={"login-error-msg"}>
                                                            <small>
                                                                {errors.price !== undefined
                                                                    ? errors.price[0]
                                                                    : null}
                                                            </small>
                                                        </p>
                                                    </label>
                                                </div>
                                                <div className="col-md-12">
                                                    <label className="w-100 mt-4">
                                                        <p>Price Formula</p>
                                                        <input
                                                            className="form-check-input"
                                                            type="checkbox"
                                                            name="usePriceFormula"
                                                            checked={input.usePriceFormula}
                                                            onChange={handleCheckbox}
                                                        />
                                                        <span>Use Price Formula</span>
                                                        {input.usePriceFormula && (
                                                            <input
                                                                className={
                                                                    errors.price_formula !== undefined
                                                                        ? "form-control mt-2 is-invalid"
                                                                        : "form-control mt-2"
                                                                }
                                                                type="text"
                                                                name="price_formula"
                                                                value={input.price_formula}
                                                                onChange={handleInput}
                                                                placeholder="Enter Product Price Formula"
                                                            />
                                                        )}
                                                        <p className="login-error-msg">
                                                            <small>
                                                                {errors.price_formula !== undefined
                                                                    ? errors.price_formula[0]
                                                                    : null}
                                                            </small>
                                                        </p>
                                                    </label>
                                                    {input.usePriceFormula && ( // Only show the following section if the checkbox is checked
                                                        <label className="w-100 mt-4">
                                                            <p>Field Limits (eg l:100-800;w:300-877)</p>
                                                            <input
                                                                className={
                                                                    errors.field_limit !== undefined
                                                                        ? "form-control mt-2 is-invalid"
                                                                        : "form-control mt-2"
                                                                }
                                                                type="text"
                                                                name="field_limit"
                                                                value={input.field_limit}
                                                                onChange={handleInput}
                                                                placeholder="l:0-120;w:0-120"
                                                            />
                                                            <p className="login-error-msg">
                                                                <small>
                                                                    {errors.field_limit !== undefined
                                                                        ? errors.field_limit[0]
                                                                        : null}
                                                                </small>
                                                            </p>
                                                        </label>
                                                    )}
                                                </div>

                                                <div className="col-md-6">
                                                    <label className={"w-100 mt-4"}>
                                                        <p>Discount %</p>
                                                        <input
                                                            className={
                                                                errors.discount_percent != undefined
                                                                    ? "form-control mt-2 is-invalid"
                                                                    : "form-control mt-2"
                                                            }
                                                            type={"number"}
                                                            name={"discount_percent"}
                                                            value={input.discount_percent}
                                                            onChange={handleInput}
                                                            placeholder={"Enter Product Discount (%)"}
                                                        />
                                                        <p className={"login-error-msg"}>
                                                            <small>
                                                                {errors.discount_percent != undefined
                                                                    ? errors.discount_percent[0]
                                                                    : null}
                                                            </small>
                                                        </p>
                                                    </label>
                                                </div>
                                                <div className="col-md-6">
                                                    <label className={"w-100 mt-4"}>
                                                        <p>Discount Fixed Amount</p>
                                                        <input
                                                            className={
                                                                errors.discount_fixed != undefined
                                                                    ? "form-control mt-2 is-invalid"
                                                                    : "form-control mt-2"
                                                            }
                                                            type={"number"}
                                                            name={"discount_fixed"}
                                                            value={input.discount_fixed}
                                                            onChange={handleInput}
                                                            placeholder={"Enter Product Discount Fixed"}
                                                        />
                                                        <p className={"login-error-msg"}>
                                                            <small>
                                                                {errors.discount_fixed != undefined
                                                                    ? errors.discount_fixed[0]
                                                                    : null}
                                                            </small>
                                                        </p>
                                                    </label>
                                                </div>
                                                <div className="col-md-6">
                                                    <label className={"w-100 mt-4"}>
                                                        <p>Discount Start Date</p>
                                                        <input
                                                            className={
                                                                errors.discount_start != undefined
                                                                    ? "form-control mt-2 is-invalid"
                                                                    : "form-control mt-2"
                                                            }
                                                            type={"datetime-local"}
                                                            name={"discount_start"}
                                                            value={input.discount_start}
                                                            onChange={handleInput}
                                                            placeholder={"Enter Discount Start Date"}
                                                        />
                                                        <p className={"login-error-msg"}>
                                                            <small>
                                                                {errors.discount_start != undefined
                                                                    ? errors.discount_start[0]
                                                                    : null}
                                                            </small>
                                                        </p>
                                                    </label>
                                                </div>
                                                <div className="col-md-6">
                                                    <label className={"w-100 mt-4"}>
                                                        <p>Discount End Date</p>
                                                        <input
                                                            className={
                                                                errors.discount_end != undefined
                                                                    ? "form-control mt-2 is-invalid"
                                                                    : "form-control mt-2"
                                                            }
                                                            type={"datetime-local"}
                                                            name={"discount_end"}
                                                            value={input.discount_end}
                                                            onChange={handleInput}
                                                            placeholder={"Enter Discount End Date"}
                                                        />
                                                        <p className={"login-error-msg"}>
                                                            <small>
                                                                {errors.discount_end != undefined
                                                                    ? errors.discount_end[0]
                                                                    : null}
                                                            </small>
                                                        </p>
                                                    </label>
                                                </div>
                                                <div className="col-md-6">
                                                    <label className="w-100 mt-4">
                                                        <p>Total Product Stock</p>
                                                        <input
                                                            className="form-control mt-2"
                                                            type="number"
                                                            name="total_stock"
                                                            value={totalStock}
                                                            readOnly
                                                            onChange={(e) => setTotalStock(e.target.value)}
                                                            placeholder="Total Product Stock"
                                                        />
                                                    </label>
                                                </div>
                                                <div className="col-md-6">
                                                    <label className={"w-100 mt-4"}>
                                                        <p>Prouct SKU</p>
                                                        <input
                                                            className={
                                                                errors.sku != undefined
                                                                    ? "form-control mt-2 is-invalid"
                                                                    : "form-control mt-2"
                                                            }
                                                            type={"text"}
                                                            name={"sku"}
                                                            value={input.sku}
                                                            onChange={handleInput}
                                                            placeholder={"Enter Product SKU"}
                                                        />
                                                        <p className={"login-error-msg"}>
                                                            <small>
                                                                {errors.sku != undefined ? errors.sku[0] : null}
                                                            </small>
                                                        </p>
                                                    </label>
                                                </div>
                                                <div className="col-md-12">
                                                    <label className={"w-100 mt-4"}>
                                                        <div className="row">
                                                            {/* Featured Product */}
                                                            <div className="col-md-4">
                                                                <p>Featured Product</p>
                                                                <div className="form-check">
                                                                    <input
                                                                        className="form-check-input"
                                                                        type="radio"
                                                                        name="isFeatured"
                                                                        value="1"
                                                                        checked={input.isFeatured === "1"}
                                                                        onChange={handleInput}
                                                                    />
                                                                    <label className="form-check-label">
                                                                        Yes
                                                                    </label>
                                                                </div>
                                                                <div className="form-check">
                                                                    <input
                                                                        className="form-check-input"
                                                                        type="radio"
                                                                        name="isFeatured"
                                                                        value="0"
                                                                        checked={input.isFeatured === "0"}
                                                                        onChange={handleInput}
                                                                    />
                                                                    <label className="form-check-label">No</label>
                                                                </div>
                                                            </div>

                                                            {/* New Product */}
                                                            <div className="col-md-4">
                                                                <p>New Product</p>
                                                                <div className="form-check">
                                                                    <input
                                                                        className="form-check-input"
                                                                        type="radio"
                                                                        name="isNew"
                                                                        value="1"
                                                                        checked={input.isNew === "1"}
                                                                        onChange={handleInput}
                                                                    />
                                                                    <label className="form-check-label">
                                                                        Yes
                                                                    </label>
                                                                </div>
                                                                <div className="form-check">
                                                                    <input
                                                                        className="form-check-input"
                                                                        type="radio"
                                                                        name="isNew"
                                                                        value="0"
                                                                        checked={input.isNew === "0"}
                                                                        onChange={handleInput}
                                                                    />
                                                                    <label className="form-check-label">No</label>
                                                                </div>
                                                            </div>

                                                            {/* Trending Product */}
                                                            <div className="col-md-4">
                                                                <p>Trending Product</p>
                                                                <div className="form-check">
                                                                    <input
                                                                        className="form-check-input"
                                                                        type="radio"
                                                                        name="isTrending"
                                                                        value="1"
                                                                        checked={input.isTrending === "1"}
                                                                        onChange={handleInput}
                                                                    />
                                                                    <label className="form-check-label">
                                                                        Yes
                                                                    </label>
                                                                </div>
                                                                <div className="form-check">
                                                                    <input
                                                                        className="form-check-input"
                                                                        type="radio"
                                                                        name="isTrending"
                                                                        value="0"
                                                                        checked={input.isTrending === "0"}
                                                                        onChange={handleInput}
                                                                    />
                                                                    <label className="form-check-label">No</label>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-md-12">
                                    <label className={"w-100 mt-4"}>
                                        <p>Description</p>
                                        <ReactQuill
                                            value={input.description}
                                            onChange={handleDescriptionChange}
                                        />
                                        <p className="login-error-msg">
                                            <small>
                                                {errors.description !== undefined
                                                    ? errors.description[0]
                                                    : null}
                                            </small>
                                        </p>
                                    </label>
                                </div>

                                <div className="col-md-12">
                                    <div className="row justify-content-center">
                                        <div className="col-md-4">
                                            <div className="d-grid mt-4">
                                                <button
                                                    className={"btn theme-button"}
                                                    onClick={handleProductCreate}
                                                    dangerouslySetInnerHTML={{
                                                        __html: isLoading
                                                            ? '<span className="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span> Loading...'
                                                            : "Add Product",
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};
export default AddProduct;
