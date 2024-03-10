import React, { useState } from "react";
import { Formik, Form, Field } from "formik";
import { CustomButton } from "./customButton";
import axios from "axios";
import * as Yup from 'yup';
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

  const MessagesSchema = Yup.object().shape({

    productName : Yup.string()
      .min(3, 'Too Short!')
      .max(50, 'Too Long!')
      .required('Required'),
      
      pickupDate : Yup.date()
      .required('Required'),

      pickupTime : Yup.string()
      .required('Required'),

      weight : Yup.string()
      .matches(/^[0-9]+kg$/, 'Weight must be a number')
      .required('Required'),

      unitItems : Yup.string()
      .matches(/^[0-9]+$/, 'Items must be a number')
      .required('Required'),

      maxLength : Yup.string()
      .matches(/^[0-9]+m$/, 'Length must be a number')


  });
 
  return (
    <Formik
      initialValues={props.orderList || {}}
      validationSchema={MessagesSchema}
      onSubmit={async (values, { resetForm, }) => {
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
           
          }
        }

        const { weight, unitItems } = values;
        const finalPrice = weight * unitItems * props.basePrice * distance;
        setTotalPrice(finalPrice - ((finalPrice * priceMap[props.categoryName].discountPerUnitPrice) / 100));
      }}

      
    >
      {({ errors, touched, setFieldValue, setFieldTouched  }) => (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
         
          {!formSubmitted && (
            <Form>
              {formStep === 1 ? (
                <>
                  {props.itemDetails.map((item) => (
                    <div key={item}>
                      <Field
                        name={item}
                        placeholder={item}
                        onChange={(e) => {
                          let value = e.target.value;
                      
                          if (item === 'weight') {
                            
                            value = value.replace(/\D/g, '');
                            setFieldValue(item, `${value}kg`);
                          } else if (item === 'maxLength') {
                            
                            value = value.replace(/\D/g, '');
                            setFieldValue(item, `${value}m`);
                          } else {
                            setFieldValue(item, value);
                          }
                        
                        }}
                        
                        type={item === "password" ? "password" : item === "pickupDate" ? 'date' : item === "pickupTime" ? 'time' : "text"}
                      />
                      {errors[item] && touched[item] ? (
                        <div>{errors[item]}</div>
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
                        <div>{errors[item]}</div>
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

         
          {formSubmitted && (
            <div className="success-message">
              <p>Sucessfully submitted</p>
            </div>
          )}
        </div>
      )}
    </Formik>
  );
};

export default CustomForm;
