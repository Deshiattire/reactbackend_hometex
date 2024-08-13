import React, { useEffect, useState } from "react";
import Breadcrumb from "../../partoals/Breadcrumb";
import Constants from "../../../Constants";
import Swal from "sweetalert2";
import CardHeader from "../../partoals/miniComponents/CardHeader";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Select from "react-select";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const ProductEdit = () => {
    const navigate = useNavigate();
    const params = useParams();
    const [attribute_input, setAttribute_input] = useState({});
    const [specification_input, setSpecification_input] = useState([{ name: '', value: '' }]);
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
    const [attributesAll, setAttributesAll] = useState([]);
    const [attributeFiled, setAttributeField] = useState([]);
 
    const [specificationFiled, setSpecificationFiled] = useState([]);
    const [specificationFiledId, setSpecificationFiledId] = useState(1);
    const [selectedShops, setSelectedShops] = useState([]);
    const [quantities, setQuantities] = useState({});
    const [totalStock, setTotalStock] = useState(0);
    const [input, setInput] = useState({});
    const [attributeShopQuantities, setAttributeShopQuantities] = useState({});
    const [attribute_obj, setAttribute_obj] = useState({});
    const [changedAttributes, setChangedAttributes] = useState({});



    const handleDescriptionChange = (value) => {
        setInput((prevState) => ({
            ...prevState,
            description: value,
        }));
    };

    const handleAttributeShopQuantityChange = (attributeId, shopId, quantity) => {
        setAttributeField((prevState) =>
            prevState.map((attr) =>
                attr.id === attributeId
                    ? {
                        ...attr,
                        shop_quantities: attr.shop_quantities.map((sq) =>
                            sq.shop_id === shopId ? { ...sq, quantity: parseInt(quantity) || 0 } : sq
                        ),
                    }
                    : attr
            )
        );
        // Update changedAttributes to reflect the quantity change
        setChangedAttributes(prevState => ({
            ...prevState,
            [attributeId]: {
                ...prevState[attributeId],
                shop_quantities: prevState[attributeId]?.shop_quantities?.map(sq =>
                    sq.shop_id === shopId ? { ...sq, quantity: parseInt(quantity) || 0 } : sq
                ) || []
            }
        }));
    

    };
    const handleSpecificationChange = (index, field, value) => {
        const newSpecifications = [...specification_input];
        newSpecifications[index][field] = value;
        setSpecification_input(newSpecifications);
    };
    const getProduct = () => {
        const token = localStorage.getItem("token");
        const config = {
            method: "get",
            maxBodyLength: Infinity,
            url: `${Constants.BASE_URL}/product/${params.id}`,
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };

        axios
            .request(config)
            .then((response) => {
                const costValue = response.data.data.cost.replace(/[৳,]/g, "");
                const priceValue = response.data.data.price.replace(/[৳,]/g, "");
                const shopData = response.data.data.shops;

                const transformedSpecifications = response.data.data.specifications.map(spec => ({
                    value: spec.value,
                    name: spec.name,
                }));

                setSpecificationFiled(transformedSpecifications || []);
                setSpecification_input(transformedSpecifications || []);

                setAttributeField(response.data.data.attributes.map(attr => ({
                    ...attr,
                    shop_quantities: attr.shop_quantities || []
                })));

                const uniqueShopData = [];
                const shopIds = new Set();

                shopData.forEach((shop) => {
                    if (!shopIds.has(shop.shop_id)) {
                        uniqueShopData.push(shop);
                        shopIds.add(shop.shop_id);
                    }
                });

                const discountPercentValue = parseFloat(response.data.data.discount_percent);
                const discountFixedValue = parseFloat(response.data.data.discount_fixed);
                const discountEndDate = response.data.data.discount_end ? new Date(response.data.data.discount_end) : null;
                const formattedDiscountEnd = discountEndDate ? discountEndDate.toISOString().slice(0, 16) : null;
                const discountStartDate = response.data.data.discount_start ? new Date(response.data.data.discount_start) : null;
                const formattedDiscountStart = discountStartDate ? discountStartDate.toISOString().slice(0, 16) : null;

                const productAttributes = response.data.data.attributes ? [response.data.data.attributes] : [];

                const shopQuantities = {};
                uniqueShopData.forEach((shop) => {
                    shopQuantities[shop.shop_id] = shop.shop_quantity;
                });
                setInput({
                    attributes: response.data.data.attributes,
                    shops: uniqueShopData,
                    name: response.data.data.name,
                    slug: response.data.data.slug,
                    category_id: response.data.data.category?.id,
                    sub_category_id: response.data.data.sub_category?.id,
                    child_sub_category_id: response.data.data.child_sub_category?.id,
                    country_id: response.data.data.country?.id,
                    brand_id: response.data.data.brand?.id,
                    supplier_id: response.data.data.supplier?.id,
                    description: response.data.data.description,
                    cost: costValue ? Number(costValue) : null,
                    price: priceValue ? Number(priceValue) : null,
                    isFeatured: response.data.data.isFeatured === 1 ? true : false,
                    isNew: response.data.data.isNew === 1 ? true : false,
                    isTrending: response.data.data.isTrending === 1 ? true : false,
                    sku: response.data.data.sku,
                    discount_start: formattedDiscountStart,
                    discount_end: formattedDiscountEnd,
                    discount_fixed: discountFixedValue,
                    discount_percent: discountPercentValue,
                    price_formula: response.data.data.price_formula,
                    field_limit: response.data.data.field_limit,
                    status: response.data.data.status == "Active" ? 1 : 0,
                });
                setAttributes(productAttributes);
                setQuantities(shopQuantities);
                setSelectedShops(uniqueShopData.map((shop) => ({
                    value: shop.shop_id,
                    label: shop.shop_name,
                    quantity: shop.shop_quantity
                })));
                setAttributeField(response.data.data.attributes);
            })
            .catch((error) => {
                console.error(error);
            });
    };
    useEffect(() => {
        getProduct();
    }, []);

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

    const handleSpecificationInput = (e, index) => {
        const { name, value } = e.target;
        const updatedSpecifications = [...specification_input];
        updatedSpecifications[index] = { ...updatedSpecifications[index], [name]: value };
        setSpecification_input(updatedSpecifications);
    };


    const handleSpecificationFieldRemove = (index) => {
        setSpecificationFiled((prevState) => prevState.filter((_, i) => i !== index));
        setSpecification_input((prevState) => prevState.filter((_, i) => i !== index));
    };

    const handleSpecificationFields = () => {
        setSpecificationFiledId((prevId) => prevId + 1);
        setSpecificationFiled((prevState) => [...prevState, specificationFiledId]);
        setSpecification_input((prevState) => [...prevState, { name: '', value: '' }]);
    };


    const handleAttributeFieldsRemove = (index) => {
        setAttributeField((prevState) => {
            const newState = prevState.filter((_, i) => i !== index);
            console.log("Updated attributeField after removal:", newState);
            return newState;
        });

        // Update the attribute_input state
        setAttribute_input((prevState) => {
            const newState = { ...prevState };
            if (attributeFiled[index]) {
                delete newState[attributeFiled[index].id];
            }
            return newState;
        });

        // If you're tracking changes for API updates, add this
        setChangedAttributes((prevState) => {
            const newState = { ...prevState };
            if (attributeFiled[index].id in newState) {
                newState[attributeFiled[index].id] = { ...newState[attributeFiled[index].id], deleted: true };
            }
            return newState;
        });
    };




    const handleAttributeFields = () => {
        setAttributeField((prevState) => {
            const newId = Math.max(...prevState.map(attr => attr.id), 0) + 1;
            return [...prevState, {
                id: newId,
                attribute_id: '',
                value_id: '',
                attribute_value: '',
                math_sign: '',
                number: '',
                attribute_cost: '',
                attribute_weight: '',
                attribute_mesarment: '',
                shop_quantities: [],
                isNew: true
            }];
        });
    };


    const handleAttributeInput = (e, id, attributeName, index) => {
        const { name, value } = e.target;
        console.log("handleAttributeInput called with id:", id, "name:", name, "value:", value, "attributeName:", attributeName, "index:", index);

        setAttribute_input((prevState) => ({
            ...prevState,
            [id]: {
                ...prevState[id],
                [name]: value,
                ...(name === 'attribute_value_id' ? { attribute_value: attributeName } : {}),
            },
        }));

        // Update attributeField state as well
        setAttributeField((prevState) =>
            prevState.map((attr) =>
                attr.id === id
                    ? {
                        ...attr,
                        [name]: value,
                        ...(name === 'attribute_value_id' ? { attribute_value: attributeName } : {}),
                    }
                    : attr
            )
        );
    };

    useEffect(() => {
        console.log("Attribute input changed:", attribute_input);
        // Assuming setInput is a function to update the main input state
        setInput((prevState) => ({ ...prevState, attributes: attribute_input }));
    }, [attribute_input]);

    useEffect(() => {
        console.log("Input state updated with attributes:", input.attributes);
    }, [input]);
    useEffect(() => {
        console.log("Attribute input changed:", attribute_input); // Add this line
        setInput((prevState) => ({ ...prevState, attributes: attribute_input }));
    }, [attribute_input]);

    // Add additional logging to ensure the input state is updated correctly
    useEffect(() => {
        console.log("Input state updated with attributes:", input.attributes);
    }, [input]);


    useEffect(() => {
        console.log("Attribute input changed:", attribute_input); // Add this line
        setInput((prevState) => ({ ...prevState, attributes: attribute_input }));
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
                setAttributesAll(res.data.attributes);
                setAllSubcategories(res.data.sub_categories);
                setAllChildSubcategories(res.data.child_sub_categories);
                setShops(res.data.shops);
            });
    };

    const shopIds = shop_quantities.map((item) => item.shop_id);
    
    useEffect(() => {
        if (input.category_id) {
            const sub_category = allSubcategories.filter(
                (item) => item.category_id == input.category_id
            );
            setSubCategories(sub_category);
        }
    
        if (input.sub_category_id) {
            const child_sub_category = allChildSubcategories.filter(
                (item) => item.sub_category_id == input.sub_category_id
            );
            setChildSubCategories(child_sub_category);
        }
    }, [input.category_id, input.sub_category_id]);
    

    const handleInput = (e) => {
        if (e.target.name === "name") {
            let slug = e.target.value;
            slug = slug.toLowerCase();
            slug = slug.replaceAll(" ", "-");
            setInput((prevState) => ({ ...prevState, slug: slug }));
        } else if (e.target.name === "category_id") {
            let category_id = parseInt(e.target.value);
            if (!Number.isNaN(category_id)) {
                let sub_category = allSubcategories.filter((item, index) => {
                    return item.category_id == category_id;
                });
                setSubCategories(sub_category);
                setChildSubCategories([]);
            }
        } else if (e.target.name === "sub_category_id") {
            let sub_category_id = parseInt(e.target.value);
            if (!Number.isNaN(sub_category_id)) {
                let child_sub_category_id = allChildSubcategories.filter(
                    (item, index) => {
                        return item.sub_category_id == sub_category_id;
                    }
                );
                setChildSubCategories(child_sub_category_id);
            }
        }

        setInput((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }));
        
    };


    // Update handleShopSelect to set selectedShops
    const handleShopSelect = (selectedOptions) => {
        setSelectedShops(selectedOptions);
    };

    // Update handleQuantityChange to set quantities
    const handleQuantityChange = (event, shopId) => {
        const newQuantities = { ...quantities };
        newQuantities[shopId] = parseInt(event.target.value, 10) || 0;
        setQuantities(newQuantities);
    };


    const handleProductUpdate = () => {
        setIsLoading(true);
        const token = localStorage.getItem("token");
        
        const updatedAttributes = attributeFiled.map(attr => ({
            ...attr,
            shop_quantities: attr.shop_quantities.map(sq => ({
                shop_id: sq.shop_id,
                quantity: sq.quantity
            }))
        }));
    
        const updatedInput = { ...input };
    
        updatedInput.shops = selectedShops.map((selectedShop) => {
            const shopId = selectedShop.value;
            const quantity = quantities[shopId] || 0;
            const shop_name = selectedShop.label;
            return { shop_id: shopId, shop_name: shop_name, quantity: quantity };
        });
    
        const attributeEntries = updatedAttributes.map((attribute) => {
            return {
                attribute_id: attribute.attribute_id,
                id: attribute.id,
                value_id: attribute_input[attribute.id]?.value_id || attribute.value_id,
                math_sign: attribute_input[attribute.id]?.math_sign || attribute.math_sign,
                number: attribute_input[attribute.id]?.number || attribute.number,
                attribute_cost: attribute_input[attribute.id]?.attribute_cost || attribute.attribute_cost,
                attribute_weight: attribute_input[attribute.id]?.attribute_weight || attribute.attribute_weight,
                attribute_mesarment: attribute_input[attribute.id]?.attribute_mesarment || attribute.attribute_mesarment,
                shop_quantities: attribute.shop_quantities,
            };
        });
    
        console.log("Data being sent to backend:", updatedAttributes);
    
        // Add information about deleted attributes
        const deletedAttributes = Object.keys(changedAttributes)
            .filter(id => changedAttributes[id].deleted)
            .map(id => ({ id, deleted: true }));
    
        const payload = {
            ...updatedInput,
            stock: totalStock,
            shop_ids: shopIds,
            attributes: [...attributeEntries, ...deletedAttributes],
            specifications: specification_input,
        };
        console.log(payload);
    
        axios.put(`${Constants.BASE_URL}/product/${params.id}`, payload, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then((res) => {
                setIsLoading(false);
                if (res.data.product_id !== undefined) {
                    getProduct();
                }
                Swal.fire({
                    position: "top-end",
                    icon: res.data.cls,
                    title: res.data.msg,
                    showConfirmButton: false,
                    toast: true,
                    timer: 1500,
                });
                if (res.data.product_id !== undefined) {
                    navigate("/product/photo/" + res.data.product_id);
                }
            })
            .catch((errors) => {
                setIsLoading(false);
                if (errors.response.status === 422) {
                    setErrors(errors.response.data.errors);
                }
            });
    };
    
    useEffect(() => {
        getAddProductData();
    }, []);



    useEffect(() => {
        setInput((prevState) => ({
            ...prevState,
            specifications: specification_input,
        }));
    }, [specification_input]);

    console.log(specification_input);

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

    const handleAttributeShopChange = (attributeId, selectedOptions) => {
        setAttributeField((prevState) =>
            prevState.map((attr) =>
                attr.id === attributeId
                    ? {
                        ...attr,
                        shop_quantities: attr.shop_quantities.map(sq => {
                            const selectedShop = selectedOptions.find(option => option.value === sq.shop_id);
                            if (selectedShop) {
                                return sq; // Keep existing shop and its quantity
                            }
                            return null; // This shop was deselected
                        }).filter(Boolean) // Remove null values
                          .concat(
                            selectedOptions
                              .filter(option => !attr.shop_quantities.some(sq => sq.shop_id === option.value))
                              .map(option => ({
                                shop_id: option.value,
                                shop_name: option.label,
                                quantity: 0,
                              }))
                          ),
                    }
                    : attr
            )
        );
    };

    // Sanjib - 

    attributesAll.length > 0 && attributesAll.map((val, ind) => {
        attribute_obj[val.id] = val.value;
    })

    const onChangeArrtibute = (e, id, attributeName) => {
        const { name, value } = e.target;
        console.log("onChangeArrtibute called with id:", id, "name:", name, "value:", value, "attributeName:", attributeName);

        setAttribute_input((prevState) => {
            const newState = {
                ...prevState,
                [id]: {
                    ...prevState[id],
                    [name]: value,
                    attribute_name: attributeName,
                },
            };

            console.log("Updated attribute_input (onChangeArrtibute):", newState);
            return newState;
        });
    };

    // Corrected onChangeAttribute function
    const onChangeAttribute = (e, id, attributeName) => {
        const { name, value } = e.target;

        setAttribute_input((prevState) => ({
            ...prevState,
            [id]: {
                ...prevState[id],
                [name]: value,
                attribute_name: attributeName,
                attribute_value: '',
                attribute_value_id: '',
            },
        }));

        // Update attributeField state
        setAttributeField((prevState) =>
            prevState.map((attr) =>
                attr.id === id
                    ? {
                        ...attr,
                        [name]: value,
                        attribute_name: attributeName,
                        attribute_value: '',
                        attribute_value_id: '',
                    }
                    : attr
            )
        );
    };
    const onChangeAmount = (e, id) => {
        const { name, value } = e.target;

        setAttributeField((prevState) => {
            const newState = prevState.map((item) => (item.id === id ? { ...item, [name]: value } : item));
            return newState;
        });

        setAttribute_input((prevState) => {
            const newState = {
                ...prevState,
                [id]: {
                    ...prevState[id],
                    [name]: value,
                },
            };
            return newState;
        });

        setChangedAttributes((prevState) => {
            const newState = {
                ...prevState,
                [id]: {
                    ...prevState[id],
                    [name]: value,
                },
            };
            return newState;
        });
    };




    return (
        <>
            <Breadcrumb title={"Edit Product"} />
            <div className="row">
                <div className="col-md-12">
                    <div className="card">
                        <div className="card-header">
                            <CardHeader
                                title={"Edit Product"}
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
                                                name={`shop_quantity_${shop.shop_id}`}
                                                value={shop.quantity || ''}
                                                onChange={(e) => handleQuantityChange(e, shop.value,e.target.value)}
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
                                            value={input.category_id || ""}
                                            onChange={handleInput}
                                            placeholder={"Select product category"}
                                        >
                                            <option>Select Category</option>
                                            {categories.map((category, index) => {

                                                return (
                                                    <>
                                                        <option value={category.id} key={index}> {category.name} </option>
                                                    </>
                                                )
                                            }

                                            )}
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
                                            value={input.sub_category_id || ""}
                                            onChange={handleInput}
                                            placeholder={"Select product sub category"}
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
                                            value={input.child_sub_category_id || ""}
                                            onChange={handleInput}
                                            placeholder={"Select product child sub category"}
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

                                <div className="row align-items-end">
                                    <div className="card my-4">
                                        <div className="card-header">
                                            <h5>Select Product Attribute</h5>
                                        </div>
                                        <div className="card-body">
                                            {attributeFiled.map((value, index) => (
                                                <div key={value.id} className="attribute-box mb-4 p-3 border rounded">
                                                    <div className="row align-items-baseline">
                                                        <div className="col-md-3">
                                                            <label className="w-100">
                                                                <p>Select Attribute</p>
                                                                <select
                                                                    className="form-select"
                                                                    name="attribute_id"
                                                                    value={value.attribute_id || ''}
                                                                    onChange={(e) => onChangeAttribute(e, value.id, e.target.options[e.target.selectedIndex].text)}
                                                                >
                                                                    <option value="">Select Attribute</option>
                                                                    {attributesAll.map((attrValue, attrIndex) => (
                                                                        <option key={attrIndex} value={attrValue.id}>
                                                                            {attrValue.name}
                                                                        </option>
                                                                    ))}
                                                                </select>
                                                            </label>
                                                        </div>

                                                        <div className="col-md-3">
                                                            <label className="w-100">
                                                                <p>Select Attribute Value</p>
                                                                <select
                                                                    className="form-select"
                                                                    name="value_id"
                                                                    value={value.value_id || ''}
                                                                    onChange={(e) => handleAttributeInput(e, value.id, e.target.options[e.target.selectedIndex].text)}
                                                                >
                                                                    <option value="">Select Attribute Value</option>
                                                                    {attribute_obj[value.attribute_id]?.map((val, indz) => (
                                                                        <option key={indz} value={val.id}>
                                                                            {val.name}
                                                                        </option>
                                                                    ))}
                                                                </select>
                                                            </label>
                                                        </div>

                                                        <div className="col-md-3">
                                                            <label className="w-100">
                                                                <p>Select Mathematical Sign</p>
                                                                <select
                                                                    className="form-select"
                                                                    name="math_sign"
                                                                    value={value.math_sign || ''}
                                                                    onChange={(e) => handleAttributeInput(e, value.id)}
                                                                >
                                                                    <option value="">Select Sign</option>
                                                                    <option value="+">+</option>
                                                                    <option value="-">-</option>
                                                                    <option value="*">*</option>
                                                                    <option value="/">/</option>
                                                                </select>
                                                            </label>
                                                        </div>

                                                        <div className="col-md-3">
                                                            <label className="w-100">
                                                                <p>Enter amount</p>
                                                                <input
                                                                    type="number"
                                                                    className="form-control"
                                                                    name="number"
                                                                    value={value.number || ''}
                                                                    onChange={(e) => handleAttributeInput(e, value.id)}
                                                                />
                                                            </label>
                                                        </div>

                                                        <div className="col-md-3">
                                                            <label className="w-100">
                                                                <p>Select Shops</p>
                                                                <Select
                                                                    options={shops}
                                                                    isMulti
                                                                    value={value.shop_quantities?.map(sq => ({ value: sq.shop_id, label: sq.shop_name })) || []}
                                                                    onChange={(selectedOptions) => handleAttributeShopChange(value.id, selectedOptions)}
                                                                    className="mb-3"
                                                                    placeholder="Select Shops"
                                                                />
                                                            </label>
                                                            {value.shop_quantities?.map((shop) => (
                                                                <div key={shop.shop_id} className="mb-2">
                                                                    <label>{shop.shop_name} Quantity</label>
                                                                    <input
                                                                        type="number"
                                                                        className="form-control"
                                                                        name={`shop_quantity_${shop.shop_id}`}
                                                                        value={shop.quantity || ''}
                                                                        onChange={(e) => handleAttributeShopQuantityChange(value.id, shop.shop_id, e.target.value)}
                                                                    />
                                                                </div>
                                                            ))}
                                                        </div>

                                                        <div className="col-md-3">
                                                            <label className="w-100">
                                                                <p>Product Cost</p>
                                                                <input
                                                                    type="number"
                                                                    className="form-control"
                                                                    name="attribute_cost"
                                                                    value={value.attribute_cost || ''}
                                                                    onChange={(e) => handleAttributeInput(e, value.id)}
                                                                />
                                                            </label>
                                                        </div>

                                                        <div className="col-md-3">
                                                            <label className="w-100">
                                                                <p>Product Weight (Gram)</p>
                                                                <input
                                                                    type="number"
                                                                    className="form-control"
                                                                    name="attribute_weight"
                                                                    value={value.attribute_weight || ''}
                                                                    onChange={(e) => handleAttributeInput(e, value.id)}
                                                                />
                                                            </label>
                                                        </div>

                                                        <div className="col-md-2">
                                                            <label className="w-100">
                                                                <p>Product Measurement</p>
                                                                <input
                                                                    type="text"
                                                                    className="form-control"
                                                                    name="attribute_mesarment"
                                                                    value={value.attribute_mesarment || ''}
                                                                    onChange={(e) => handleAttributeInput(e, value.id)}
                                                                />
                                                            </label>
                                                        </div>

                                                        {/* <div className="col-md-1 mt-4">
                                                            {value.shop_quantities && (

                                                            <button
                                                                className="btn btn-danger"
                                                                onClick={() => handleAttributeFieldsRemove(index)}
                                                            >
                                                                <i className="fa-solid fa-minus" />
                                                            </button>
                                                            )}
                                                        </div> */}
                                                        <div className="col-md-1 mt-4">
                                                        {value.isNew && (
                                                            <button
                                                                type="button"
                                                                className="btn btn-danger"
                                                                onClick={() => handleAttributeFieldsRemove(index)}
                                                            >
                                                                <i className="fa-solid fa-minus" />
                                                            </button>
                                                        )}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}

                                            <div className="row">
                                                <div className="col-md-12 text-center">
                                                    <button
                                                        className="btn btn-success mt-3"
                                                        onClick={handleAttributeFields}
                                                    >
                                                        <i className="fa-solid fa-plus" /> Add Attribute
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

                                            <div>
                                                {specification_input.map((spec, index) => (
                                                    <div key={index} className="specification-field d-flex align-items-center mb-2">
                                                        <input
                                                            type="text"
                                                            name="name"
                                                            value={spec.name}
                                                            className="form-control me-2"
                                                            onChange={(e) => handleSpecificationChange(index, 'name', e.target.value)}
                                                        />
                                                        <input
                                                            type="text"
                                                            name="value"
                                                            value={spec.value}
                                                            className="form-control me-2"
                                                            onChange={(e) => handleSpecificationChange(index, 'value', e.target.value)}
                                                        />
                                                        <button type="button" className="btn btn-danger" onClick={() => handleSpecificationFieldRemove(index)}>
                                                            <i className="fa-solid fa-minus" />
                                                        </button>
                                                    </div>
                                                ))}
                                                {/* <button type="button" onClick={handleSpecificationFields}>Add Specification</button> */}
                                            </div>

                                            {/* <button onClick={handleSpecificationFields}>Add Specification</button> */}


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
                                                        <p className="login-error-msg">
                                                            <small>
                                                                {errors.price_formula !== undefined
                                                                    ? errors.price_formula[0]
                                                                    : null}
                                                            </small>
                                                        </p>
                                                    </label>
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
                                                            value={input.discount_percent || ""}
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
                                                            value={input.discount_fixed || ""}
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
                                                            value={input.discount_start || ""}
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
                                                            value={input.discount_end || ""}
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
                                                                        checked={input.isFeatured === true}
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
                                                                        checked={input.isFeatured === false}
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
                                                                        checked={input.isNew === true}
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
                                                                        checked={input.isNew === false}
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
                                                                        checked={input.isTrending === true}
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
                                                                        checked={input.isTrending === false}
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
                                                    onClick={handleProductUpdate}
                                                    dangerouslySetInnerHTML={{
                                                        __html: isLoading
                                                            ? '<span className="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span> Loading...'
                                                            : "Update Product",
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
export default ProductEdit;