import React, { useEffect, useState } from "react";
import { Link, redirect, useNavigate } from "react-router-dom";
import axios from "axios";
import Breadcrumb from "../../partoals/Breadcrumb";
import Constants from "../../../Constants";
import Swal from "sweetalert2";
import CardHeader from "../../partoals/miniComponents/CardHeader";
import AddCustomer from "../../partoals/modals/AddCustomer";
import ShowOrderConfirmation from "../../partoals/modals/ShowOrderConfirmation";
import Modal from 'react-bootstrap/Modal';
import { type } from "@testing-library/user-event/dist/type";

const OrderCreate = () => {

    const navigate = useNavigate();

    const [input, setInput] = useState({
        order_by: "id",
        per_page: 10,
        direction: "desc",
        search: "",
    });

    const [customerInput, setCustomerInput] = useState("");
    const [customers, setCustomers] = useState([]);

    const [modalShow, setModalShow] = useState(false);
    const [showOrderConfirmationModal, setShowOrderConfirmationModal] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState([]);

    const getPaymentMethod = () => {
        const token = localStorage.getItem("token");
        axios
            .get(`${Constants.BASE_URL}/get-payment-methods`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then((res) => {
                setPaymentMethod(res.data);
            });
    };

    const [itemsCountsPerPage, setItemsCountPerPage] = useState(0);
    const [totalCountsPerPage, setTotalCountPerPage] = useState(1);
    const [startFrom, setStartFrom] = useState(1);
    const [activePage, setActivePage] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [selectAttributeError, setSelectAttributeError] = useState(false);

    const [showAddCardModal, setShowAddCardModal] = useState(false);
    const [productWithAttributes, setProductWithAttributes] = useState({});
    const [selectedProductWithAttributes, setSelectedProductWithAttributes] = useState(
        {
            'productId': '',
            'attributesId': '',
            'name': '',
            'attribute_name': '',
            'original_price': '',
            'price': '',
            'discount_price': '',
            'sku': '',
            'in_stock': '',
            'image': '',
        }
    );




    const [products, setProducts] = useState([]);
    const [carts, setCarts] = useState({});
    const [cartItems, setCartItems] = useState([]);
    const [orderSummary, setOrderSummary] = useState({
        items: 0,
        amount: 0,
        discount: 0,
        pay_able: 0,
        customer: "",
        customer_id: 0,
        paid_amount: 0,
        due_amount: 0,
        payment_method_id: 1,
        trx_id: "",
    });

    const [order, setOrder] = useState({});

    const handleOrderPlace = () => {
        setIsLoading(true);
        const token = localStorage.getItem("token");
        const shopData = JSON.parse(localStorage.getItem("branch"));
        const shop_id = shopData.id;
        axios
            .post(
                `${Constants.BASE_URL}/order`,
                { carts: carts, orderSummary: orderSummary, shop_id: shop_id },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            )
            .then((res) => {
                if (res.data.flag != undefined) {
                    Swal.fire({
                        position: "top-end",
                        icon: res.data.cls,
                        title: res.data.msg,
                        showConfirmButton: false,
                        toast: true,
                        timer: 1500,
                    });
                    if (res.data.flag != undefined) {
                        setShowOrderConfirmationModal(false);
                        navigate(`/order/${res.data.order_id}`);
                    }
                    setIsLoading(false);
                }
            })
            .catch((error) => {
                setIsLoading(false);
                console.log(error);
                // handle error here, e.g. set an error state or display an error message
            });
    };

    const selectCustomer = (customer) => {
        setOrder((prevState) => ({ ...prevState, customer_id: customer.id }));
        setOrderSummary((prevState) => ({
            ...prevState,
            customer: customer.name + " - " + customer.phone,
        }));
        setOrderSummary((prevState) => ({
            ...prevState,
            customer_id: customer.id,
        }));
    };
    const handleCart = (id) => {
        products.map((product, index) => {
            if (product.id == id) {
                if (carts[id] == undefined) {
                    setCarts((prevState) => ({ ...prevState, [id]: product }));
                    setCarts((prevState) => ({
                        ...prevState,
                        [id]: {
                            ...prevState[id],
                            quantity: 1,
                        },
                    }));
                } else {
                    if (carts[id].stock > carts[id].quantity) {
                        setCarts((prevState) => ({
                            ...prevState,
                            [id]: {
                                ...prevState[id],
                                quantity: carts[id].quantity + 1,
                            },
                        }));
                    }
                }
            }
        });
    };


    const cartFunctionality = (productId, attributesId, other_fields) => {
        const existingIndex = cartItems.findIndex(item => item.productId === productId && item.attributesId === attributesId);
        if (existingIndex !== -1) {
            const updatedCartItems = [...cartItems];
            updatedCartItems[existingIndex].quantity++;
            setCartItems(updatedCartItems);
        } else {
            let item =
            {
                productId: productId, attributesId: attributesId,
                name: other_fields?.name, attribute_name: other_fields?.attribute_name,
                original_price: other_fields?.original_price, price: other_fields?.price,
                discount_price: other_fields?.discount_price, sku: other_fields?.sku, in_stock: other_fields?.in_stock,
                image: other_fields?.image,
                quantity: 1
            };
            setCartItems([...cartItems, item]);
        }
    }


    const removeFromCart = (productId, attributeId) => {
        const updatedCartItems = cartItems.filter(item => !(item.productId === productId && item.attributesId === attributeId));
        setCartItems(updatedCartItems);
    };

    const handleIncreaseDecriseItem = (productId, attributesId, increaseOrDecrise) => {
        const updatedProducts = cartItems.map(product => {
            if (product.productId === productId && product.attributesId === attributesId) {
                let quantity = product.quantity;
                if (increaseOrDecrise == 'inc') quantity = quantity + 1;
                else quantity = quantity - 1;
                return { ...product, quantity: quantity };
            }
            return product;
        });
        setCartItems(updatedProducts);
    };



    const handleCartAttributeWise = (product) => {
        setShowAddCardModal(true)
        setProductWithAttributes(product)
    }

    console.log("=>>>", productWithAttributes);
    const handleCartWithoutAttributeWise = (product) => {
        let other_fields = {
            'productId': +product.id,
            'attributesId': 0,
            'name': product.name,
            'attribute_name': '',
            'original_price': product.price,
            'price': product.sell_price.price,
            'discount_price': product.sell_price.discount,
            'sku': product.sku,
            'in_stock': product.stock,
            'image': product.primary_photo,
        }
        cartFunctionality(product.id, 0, other_fields)
    }

    const onChangeProductAttribute = (attributeId, product) => {
        let attribute_values = product?.attributes.find(item => item.id == attributeId);
        let attribute_name = '';
        let sell_price = product.sell_price.price;
        if (attribute_values) {
            attribute_name = attribute_values.attribute_name + ' ' + attribute_values.attribute_value;
            if (attribute_values?.math_sign == '+')
                sell_price = sell_price + parseFloat(attribute_values?.number)
            else if (attribute_values?.math_sign == '-')
                sell_price = sell_price - parseFloat(attribute_values?.number)
            else if (attribute_values?.math_sign == '*')
                sell_price = sell_price * parseFloat(attribute_values?.number)
        }

        if (attributeId) setSelectedProductWithAttributes({
            'productId': +product.id,
            'attributesId': +attributeId,
            'name': product.name,
            'attribute_name': attribute_name,
            'original_price': product.price,
            // 'price': product.sell_price.price,
            'price': sell_price,
            'discount_price': product.sell_price.discount,
            'sku': product.sku,
            'in_stock': product.stock,
            'image': product.primary_photo,
        })
        else setSelectedProductWithAttributes({ 'productId': '', 'attributesId': '' })
    }
    const addProductToCart = () => {
        const { productId, attributesId } = selectedProductWithAttributes
        if (productId && attributesId) {
            cartFunctionality(productId, attributesId, selectedProductWithAttributes)
            setSelectedProductWithAttributes({ 'productId': '', 'attributesId': '' })
            setShowAddCardModal(false)
            setSelectAttributeError(false)
        } else {
            setSelectAttributeError(true)
        }
    }


    const orderSummery = () => {
        let items = 0;
        let amount = 0;
        let discount = 0;
        let pay_able = 0;
        let paid_amount = 0;

        if (cartItems.length > 0) {
            cartItems.map((val, index) => {
                items += val.quantity;
                amount += val.price * val.quantity;
                discount += val.discount_price * val.quantity;
                pay_able += val.price * val.quantity;
            })
        }
        setOrderSummary((prevState) => ({
            ...prevState,
            items: items,
            amount: amount,
            discount: discount,
            pay_able: pay_able,
            paid_amount: pay_able,
        }));
    };




    const removeCart = (id) => {
        setCarts((current) => {
            const copy = { ...current };
            delete copy[id];
            return copy;
        });
    };

    const handleCustomerSearch = (e) => {
        setCustomerInput(e.target.value);
    };

    const handleDecrease = (id) => {
        if (carts[id].quantity > 1) {
            setCarts((prevState) => ({
                ...prevState,
                [id]: {
                    ...prevState[id],
                    quantity: carts[id].quantity - 1,
                },
            }));
        }
    };
    const handleIncrease = (id) => {
        if (carts[id].stock > carts[id].quantity) {
            setCarts((prevState) => ({
                ...prevState,
                [id]: {
                    ...prevState[id],
                    quantity: carts[id].quantity + 1,
                },
            }));
        }
    };




    const getCustomer = () => {
        setIsLoading(true);
        const token = localStorage.getItem("token");
        axios
            .get(`${Constants.BASE_URL}/customer?&search=${customerInput}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then((res) => {
                setCustomers(res.data);
                setIsLoading(false);
            });
    };

    // useEffect(()=>{
    //   getCustomer()
    // },[customerInput])

    const handleInput = (e) => {
        setInput((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }));
    };

    const getProducts = (pageNumber = 1) => {
        setIsLoading(true);
        const token = localStorage.getItem("token");
        axios
            .get(
                `${Constants.BASE_URL}/product?page=${pageNumber}&search=${input.search}&order_by=${input.order_by}&per_page=${input.per_page}&direction=${input.direction}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            )
            .then((res) => {
                if (res && res.data) {
                    setProducts(res.data.data);
                    setItemsCountPerPage(res.data.meta.per_page);
                    setStartFrom(res.data.meta.from);
                    setTotalCountPerPage(res.data.meta.total);
                    setActivePage(res.data.meta.current_page);
                } else {
                    // Handle the case where res.data or its properties are undefined.
                }
                setIsLoading(false);
            })
            .catch((error) => {
                setIsLoading(false);
                console.error(error);
                // Handle the axios request error here.
            });
    };

    const calculateOrderSummery = () => {
        let items = 0;
        let amount = 0;
        let discount = 0;
        let pay_able = 0;
        let paid_amount = 0;
        Object.keys(carts).map((key) => {
            items += carts[key].quantity;
            amount += carts[key].original_price * carts[key].quantity;
            discount += carts[key].sell_price.discount * carts[key].quantity;
            pay_able += carts[key].sell_price.price * carts[key].quantity;
        });
        setOrderSummary((prevState) => ({
            ...prevState,
            items: items,
            amount: amount,
            discount: discount,
            pay_able: pay_able,
            paid_amount: pay_able,
        }));
    };

    const handleOrderSummaryInput = (e) => {
        if (
            e.target.name == "paid_amount" &&
            orderSummary.pay_able >= e.target.value
        ) {
            setOrderSummary((prevState) => ({
                ...prevState,
                paid_amount: e.target.value,
                due_amount: orderSummary.pay_able - e.target.value,
            }));
        } else if (e.target.name == "payment_method_id") {
            setOrderSummary((prevState) => ({
                ...prevState,
                payment_method_id: e.target.value,
            }));
            if (e.target.value == 1) {
                setOrderSummary((prevState) => ({ ...prevState, trx_id: "" }));
            }
        } else if (e.target.name == "trx_id") {
            setOrderSummary((prevState) => ({
                ...prevState,
                trx_id: e.target.value,
            }));
        }
    };

    useEffect(() => {
        getProducts();
        getPaymentMethod();
    }, []);


    useEffect(() => {
        //sanjib need unblock
        // calculateOrderSummery();
    }, [carts]);


    useEffect(() => {
        orderSummery();
    }, [cartItems]);



    // console.log(productWithAttributes.attributes, 'productWithAttributes___')

    console.log(cartItems, 'my cart')

    return (
        <>
            <Breadcrumb title={"Create Order"} />
            <div className="row">
                <div className="col-md-12">
                    <div className="card">
                        <div className="card-header">
                            <CardHeader
                                title={"Create Order"}
                                link={"/orders"}
                                icon={"fa-list"}
                                button_text={"List"}
                            />
                        </div>
                        <div className="card-body">
                            <div className="row">
                                {/* Product List */}
                                <div className="col-md-4">
                                    <div className="card">
                                        <div className="card-header">
                                            <h5>Product List</h5>
                                        </div>
                                        <div className="card-body p-1">
                                            <div className="product-search-area mb-4 mt-2">
                                                <div className="input-group">
                                                    <input
                                                        className="form-control form-control-sm"
                                                        type={"search"}
                                                        name={"search"}
                                                        value={input.search}
                                                        onChange={handleInput}
                                                        placeholder={"search..."}
                                                    />
                                                    <button
                                                        onClick={getProducts}
                                                        className="input-group-text bg-theme text-white"
                                                    >
                                                        <i className="fa-solid fa-search" />
                                                    </button>
                                                </div>
                                            </div>


                                            <Modal
                                                centered
                                                show={showAddCardModal}
                                                onHide={() => setShowAddCardModal(false)}
                                            >
                                                <Modal.Header closeButton>
                                                    <Modal.Title id="contained-modal-title-vcenter">
                                                        {productWithAttributes?.name}
                                                    </Modal.Title>
                                                </Modal.Header>
                                                <Modal.Body>
                                                    <img className="order-product-photo img-thumbnail" src={productWithAttributes.primary_photo} alt={productWithAttributes?.name} />
                                                    <select onChange={(e) => {
                                                        onChangeProductAttribute(e.target.value, productWithAttributes)
                                                    }}>
                                                        <option>Select Arrtibute</option>
                                                        {typeof productWithAttributes.attributes != 'undefined' && productWithAttributes?.attributes.map((attr, ind) => {
                                                            return (<>
                                                                <option data-name={attr?.attribute_name + ' ' + attr?.attribute_value} value={attr?.id}> {attr?.attribute_name + ' ' + attr?.attribute_value} </option>
                                                            </>)
                                                        })}
                                                    </select>
                                                    <button
                                                        className="btn-success btn-sm ms-1"
                                                        onClick={(e) => { addProductToCart() }}
                                                    >
                                                        <i className="fa-solid fa-plus" />
                                                    </button>
                                                    {selectAttributeError && <><p>Please Select attribute</p></>}
                                                </Modal.Body>
                                            </Modal>


                                            {products.map((product, index) => {
                                                // console.log(product.attributes.length, '--', product.name, '--', 'product_loop')
                                                let has_attriutes = product.attributes.length > 0 ? 'yes' : 'no'
                                                return (
                                                    <>
                                                        <div className="d-flex align-items-center my-2 p-1 order-product-container position-relative" key={index} >
                                                            <div className="details-area">
                                                                <button
                                                                    className="btn-success btn-sm ms-1"
                                                                    // onClick={() => handleCart(product.id)}
                                                                    onClick={(e) => { has_attriutes == 'yes' ? handleCartAttributeWise(product) : handleCartWithoutAttributeWise(product) }}
                                                                >
                                                                    <i className="fa-solid fa-plus" />
                                                                </button>
                                                                <button className="btn-info btn-sm ms-1">
                                                                    <i className="fa-solid fa-eye " />
                                                                </button>
                                                            </div>
                                                            <div className="flex-shrink-0">
                                                                <img
                                                                    className="order-product-photo img-thumbnail"
                                                                    src={product.primary_photo}
                                                                    alt="Hometex Products"
                                                                />
                                                            </div>
                                                            <div className="flex-grow-1 ms-2">
                                                                <p className="text-theme">
                                                                    <strong>{product.name}</strong>
                                                                </p>
                                                                <p>
                                                                    <small>Original Price: {product.price}</small>
                                                                </p>
                                                                <p className={"text-theme"}>
                                                                    <small>
                                                                        <strong>
                                                                            Price: {product.sell_price.price}
                                                                            {product.sell_price.symbol} | Discount:
                                                                            {product.sell_price.discount}
                                                                            {product.sell_price.symbol}
                                                                        </strong>
                                                                    </small>
                                                                </p>
                                                                <p>
                                                                    <small>
                                                                        SKU: {product.sku} | Stock: {product.stock}
                                                                    </small>
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </>
                                                )
                                            })}
                                        </div>
                                    </div>
                                </div>
                                {/* Cart */}
                                <div className="col-md-4">
                                    <div className="card">
                                        <div className="card-header">
                                            <h5>Cart</h5>
                                        </div>
                                        <div className="card-body">
                                            <div className="order-summary mt-1">
                                                <p className="pb-2 m">
                                                    <strong>Customer: </strong>
                                                    <span className="text-theme">
                                                        
                                                        {orderSummary.customer}
                                                    </span>
                                                </p>
                                                <table className="table-sm table table-hover table-striped table-bordered">
                                                    <tbody>
                                                        <tr>
                                                            <th>Total Items</th>
                                                            <td className="text-end">{orderSummary.items}</td>
                                                        </tr>
                                                        <tr>
                                                            <th>price</th>
                                                            <td className="text-end">
                                                                {orderSummary.amount} ৳
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <th>Discount</th>
                                                            <td className="text-end">
                                                                - {orderSummary.discount} ৳
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <th>Net Payable</th>
                                                            <th className="text-end text-theme">
                                                                {orderSummary.pay_able} ৳
                                                            </th>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                            


                                            {
                                                cartItems.length > 0 && cartItems.map((item, index) => {
                                                    return (<>
                                                        <div className="d-flex align-items-center my-2 p-1 order-product-container position-relative" key={index}>
                                                            <div className="details-area">
                                                                <button className="btn-danger btn-sm ms-1" onClick={() => removeFromCart(item?.productId, item?.attributesId)}
                                                                >
                                                                    <i className="fa-solid fa-times" />
                                                                </button>
                                                                <button className="btn-info btn-sm ms-1"> <i className="fa-solid fa-eye " /> </button>
                                                            </div>

                                                            <div className="flex-shrink-0">
                                                                <img
                                                                    className="order-product-photo img-thumbnail"
                                                                    src={item?.image}
                                                                    alt="Hometex Products"
                                                                />
                                                            </div>

                                                            <div className="flex-grow-1 ms-2">
                                                                <p className="text-theme">
                                                                    <strong>{item.name}</strong>
                                                                </p>
                                                                <p>
                                                                    <small>Original Price: {item.original_price}</small>
                                                                </p>
                                                                <p className={"text-theme"}>
                                                                    <small>
                                                                        <strong>
                                                                            Price: {item.price}
                                                                            | Discount:
                                                                            {item.discount_price}
                                                                        </strong>
                                                                    </small>
                                                                </p>
                                                                <p className={"text-theme"}>
                                                                    <small>
                                                                        <strong>
                                                                            Total Price: {item.price * item.quantity}
                                                                        </strong>
                                                                    </small>
                                                                </p>
                                                                <p>
                                                                    <small>
                                                                        SKU: {item.sku} |
                                                                        Stock: {item.in_stock}
                                                                    </small>
                                                                </p>

                                                                {item?.attributesId > 0 && <p><small>Attribute : {item?.attribute_name}</small></p>}

                                                                <p>
                                                                    Quantity:
                                                                    <button
                                                                        // onClick={() => handleDecrease(carts[key].id)}
                                                                        onClick={() => handleIncreaseDecriseItem(item?.productId, item?.attributesId, 'dec')}
                                                                        disabled={item.quantity <= 1}
                                                                        className="quantity-button"
                                                                    >
                                                                        -
                                                                    </button>
                                                                    <span>{item.quantity}</span>
                                                                    <button
                                                                        // onClick={() => handleIncrease(carts[key].id)}
                                                                        onClick={() => handleIncreaseDecriseItem(item?.productId, item?.attributesId, 'inc')}
                                                                        disabled={
                                                                            item.in_stock <= item.quantity
                                                                        }
                                                                        className="quantity-button"
                                                                    >
                                                                        +
                                                                    </button>
                                                                </p>
                                                            </div>

                                                        </div>
                                                    </>)
                                                })
                                            }
                                        </div>
                                    </div>
                                </div>
                                {/* Customer Details */}
                                <div className="col-md-4">
                                    <div className="card">
                                        <div className="card-header">
                                            <div className="d-flex justify-content-between">
                                                <h5>Customer List</h5>
                                                <button
                                                    className="btn btn-sm btn-success"
                                                    onClick={() => setModalShow(true)}
                                                >
                                                    <i className="fa-solid fa-plus" />
                                                </button>
                                            </div>
                                        </div>
                                        <div className="card-body">
                                            <div className="input-group">
                                                <input
                                                    className="form-control form-control-sm"
                                                    type={"search"}
                                                    name={"search"}
                                                    value={customerInput}
                                                    onChange={handleCustomerSearch}
                                                    placeholder={"search..."}
                                                />
                                                <button
                                                    onClick={getCustomer}
                                                    className="input-group-text bg-theme text-white"
                                                >
                                                    <i className="fa-solid fa-search" />
                                                </button>
                                            </div>

                                            {/* customer add */}

                                            <ul className="customer-list">
                                                {customers.map((customer, index) => (
                                                    <li
                                                        className={
                                                            orderSummary.customer_id == customer.id
                                                                ? "text-theme"
                                                                : ""
                                                        }
                                                        onClick={() => selectCustomer(customer)}
                                                        key={index}
                                                    >
                                                        {customer.name} - {customer.phone}
                                                    </li>
                                                ))}
                                            </ul>
                                            <div className="d-grid mt-4">
                                                <button
                                                    disabled={
                                                        orderSummary.items == 0 ||
                                                        orderSummary.customer_id == 0
                                                    }
                                                    onClick={() => setShowOrderConfirmationModal(true)}
                                                    className={"btn theme-button"}
                                                >
                                                    Place Order
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <AddCustomer
                show={modalShow}
                onHide={() => setModalShow(false)}
                setModalShow={setModalShow}
            />
            <ShowOrderConfirmation
                show={showOrderConfirmationModal}
                onHide={() => setShowOrderConfirmationModal(false)}
                order_summary={orderSummary}
                carts={carts}
                is_loading={isLoading}
                handleOrderPlace={handleOrderPlace}
                handleOrderSummaryInput={handleOrderSummaryInput}
                paymentMethod={paymentMethod}
            />
        </>
    );
};
export default OrderCreate;
