import React from "react";
import Barcode from "react-barcode";
import GlobalFunction from "../../../assets/GlobalFunction";

const TruncateText = (text, maxLength) => {
  if (text.length > maxLength) {
    return text.substring(0, maxLength) + "...";
  }
  return text;
};

const BarCodePage = React.forwardRef((props, ref) => {
  const { selectedAttribute, products, columnCount, printing } = props;

  console.log("=========");
  console.log(ref);
  console.log("=========");

  const calculatePrice = (basePrice, mathSign, number) => {
    switch (mathSign) {
      case "+":
        return basePrice + number;
      case "-":
        return basePrice - number;
      case "*":
        return basePrice * number;
      case "/":
        return basePrice / number;
      default:
        return basePrice;
    }
  };

  const pages = [];
  for (let i = 0; i < products.length; i += columnCount) {
    const pageProducts = products.slice(i, i + columnCount);
    pages.push(pageProducts);
  }

  return (
    <div className="print-page" style={{ width: "55mm", height: "25mm" }}>
      {pages.map((page, pageIndex) => (
        <div key={pageIndex} className="" ref={ref}>
          {page.map((product, index) => (
            <div
              key={index}
              className="bar-code-item"
              style={{
                flex: `1 0 ${100 / columnCount}%`,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                fontSize: "9px",
                letterSpacing: ".15em",
                margin: "0px",
              }}
            >
              <p>
                <small style={{ fontSize: "12px" }}>
                  <b>{product?.brand?.name}</b>
                </small>
              </p>
              <div
                className="barcode"
                style={{ textAlign: "center", format: "CODE128" }}
              >
                <Barcode
                  value={product.sku}
                  width={1}
                  height={12}
                  fontSize={8}
                  margin={0}
                />
              </div>
              <p>
                <strong>{TruncateText(product?.name, 20)}</strong>
              </p>
                <p>
                  <b>
                    {selectedAttribute?.attributes?.name}:{" "}
                    {selectedAttribute?.attribute_value?.name}
                  </b>
                </p>
              <p>
                <b>
                  Price:
                  {product?.sell_price?.discount !== 0
                    ? GlobalFunction.formatPrice(product?.sell_price?.price)
                    : ""}
                  <span
                    className={
                      product?.sell_price?.discount !== 0 ? "deleted ms-2" : ""
                    }
                  >
                    {calculatePrice(
                    product.price,
                    selectedAttribute?.attribute_math_sign,
                    selectedAttribute?.attribute_number
                  )} {" + VAT"}
                  </span>
                </b>
              </p>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
});

export default BarCodePage;
