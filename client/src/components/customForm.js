import React, { useState } from "react";
import { Formik, Form, Field } from "formik";
import { CustomButton } from "./customButton";
import axios from "axios";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import priceMap from "../config/priceMap.json";
import 'react-toastify/dist/ReactToastify.css';
import Map from "./map";
import "leaflet/dist/leaflet.css";

const CustomForm = (props) => {
  const { _id } = useSelector(state => state.user);
  const { distance } = useSelector(state => state.location);

  const [formStep, setFormStep] = useState(1);
  const [totalPrice, setTotalPrice] = useState(0);
  const [formSubmitted, setFormSubmitted] = useState(false); // Added state for form submission

  const handleBackClick = () => {
    setFormStep(formStep - 1);
    setFormSubmitted(false); // Reset form submission state on going back
  };

  toast.success(JSON.stringify(props.orderLists));

  return (
    <Formik
      initialValues={props.orderList || {}}
      onSubmit={async (values, { resetForm }) => {
        if (formStep <= 2) {
          setFormStep(formStep + 1);
        } else {
          values.minimumDeliveryPrice = props.basePrice;
          values.categoryName = props.categoryName;
          values.senderId = _id;
          values.totalPrice = totalPrice;
          values.distance = distance;
          values.discount = priceMap[props.categoryName];
          values.orderStatus = 'Pending';
          values.photo = props.photo;

          try {
            await axios.post(`${process.env.REACT_APP_API_URL}/${props.endpoint}`, values);
            // Set the form submission state to true
            setFormSubmitted(true);
            // Reload the window upon successful form submission
            window.location.reload();
          } catch (error) {
            console.error(error);
            // Handle errors if needed
          }
        }

        const { weight, unitItems } = values;
        const finalPrice = weight * unitItems * props.basePrice * distance;
        setTotalPrice(finalPrice - ((finalPrice * priceMap[props.categoryName].discountPerUnitPrice) / 100));
      }}
    >
      {({ errors, touched }) => (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* Render the form only if formSubmitted state is false */}
          {!formSubmitted && (
            <Form>
              {formStep === 1 ? (
                <>
                  {props.itemDetails.map((item) => (
                    <div key={item}>
                      <Field
                        name={item}
                        placeholder={item}
                        type={item === "password" ? "password" : item === "pickupDate" ? 'date' : item === "pickupTime" ? 'time' : "text"}
                      />
                      {errors[item] && touched[item] ? (
                        <div className="validation-message">{errors[item]}</div>
                      ) : null}
                    </div>
                  ))}
                </>
              ) : null}

              {formStep === 2 && (
                <>
                  <Map />
                  <h2>Total distance is: {distance} km Rs. {totalPrice || 0}</h2>
                  <CustomButton name="Back" onClick={handleBackClick} />
                </>
              )}

              {formStep === 3 && (
                <>
                  {props.senderDetails.map((item) => (
                    <div key={item}>
                      <Field
                        name={item}
                        placeholder={item}
                        type={item === "password" ? "password" : "text"}
                      />
                      {errors[item] && touched[item] ? (
                        <div className="validation-message">{errors[item]}</div>
                      ) : null}
                    </div>
                  ))}
                  <CustomButton name="Back" onClick={handleBackClick} />
                </>
              )}

              <CustomButton
                name={formStep <= 2 ? "Next" : "Submit"}
                type="submit"
              />
            </Form>
          )}

          {/* Show a success message or take additional actions when the form is submitted */}
          {formSubmitted && (
            <div className="success-message">
              al
            </div>
          )}
        </div>
      )}
    </Formik>
  );
};

export default CustomForm;
