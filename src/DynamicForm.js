import React, { useState } from 'react';
import './DynamicForm.css'; // Importing CSS styles

const DynamicForm = () => {
    const [formFields, setFormFields] = useState([]);
    const [formData, setFormData] = useState({});
    const [submittedData, setSubmittedData] = useState([]);
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState(""); // State to track error messages

    const apiResponses = {
        userInfo: [
            { name: "firstName", type: "text", label: "First Name", required: true },
            { name: "lastName", type: "text", label: "Last Name", required: true },
            { name: "age", type: "number", label: "Age", required: false }
        ],
        addressInfo: [
            { name: "street", type: "text", label: "Street", required: true },
            { name: "city", type: "text", label: "City", required: true },
            { name: "state", type: "select", label: "State", options: ["California", "Texas", "New York"], required: true },
            { name: "zipCode", type: "text", label: "Zip Code", required: false }
        ],
        paymentInfo: [
            { name: "cardNumber", type: "text", label: "Card Number", required: true },
            { name: "expiryDate", type: "date", label: "Expiry Date", required: true },
            { name: "cvv", type: "password", label: "CVV", required: true },
            { name: "cardholderName", type: "text", label: "Cardholder Name", required: true }
        ]
    };

    const handleSelectionChange = (e) => {
        const selectedForm = e.target.value;
        setFormFields(apiResponses[selectedForm] || []);
        setFormData({});
        setProgress(0);
        setError(""); // Clear any previous error
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));

        // Update progress
        const filledFields = Object.keys(formData).filter(key => formData[key]);
        setProgress((filledFields.length / formFields.length) * 100);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Check if form type is selected
        if (formFields.length === 0) {
            setError("Please select a form type before submitting.");
            return;
        }

        // Check if required fields are filled
        const unfilledFields = formFields.filter(field => field.required && !formData[field.name]);
        if (unfilledFields.length > 0) {
            setError("Please fill out all required fields.");
            return;
        }

        // Save data and reset form
        setError(""); // Clear error
        setSubmittedData([...submittedData, formData]);
        alert("Form Submitted Successfully!");
        setFormData({});
        setProgress(0);
    };

    const renderForm = () => {
        return formFields.map((field) => {
            const { name, type, label, required, options } = field;
            const value = formData[name] || "";

            let input;
            if (type === "select") {
                input = (
                    <select
                        name={name}
                        className="form-input"
                        onChange={handleInputChange}
                        required={required}
                    >
                        <option value="">Select...</option>
                        {options.map((opt) => (
                            <option key={opt} value={opt}>{opt}</option>
                        ))}
                    </select>
                );
            } else {
                input = (
                    <input
                        type={type}
                        name={name}
                        className="form-input"
                        value={value}
                        onChange={handleInputChange}
                        required={required}
                    />
                );
            }

            return (
                <div key={name} className="form-group">
                    <label className="form-label">{label}</label>
                    {input}
                </div>
            );
        });
    };

    return (
        <>
            <div className="background-wrapper"> {/* Moving background wrapper */}
                <div className="form-container">
                    <h1 className="form-title">Dynamic Form</h1>
                    {error && <p className="error-text">{error}</p>} {/* Error message */}
                    <select className="form-select" onChange={handleSelectionChange}>
                        <option value="">Select Form Type</option>
                        <option value="userInfo">User Information</option>
                        <option value="addressInfo">Address Information</option>
                        <option value="paymentInfo">Payment Information</option>
                    </select>

                    <form className="dynamic-form" onSubmit={handleSubmit}>
                        {renderForm()}
                        <button type="submit" className="submit-button">Submit</button>
                        <div className="progress-bar-container">
                            <div className="progress-bar" style={{ width: `${progress}%` }}></div>
                        </div>
                        <p className="progress-text">{progress.toFixed(0)}% completed</p>
                    </form>

                    {submittedData.length > 0 && (
    <table className="submitted-data-table">
        <thead>
            <tr><th>Submitted Data</th></tr>
        </thead>
        <tbody>
            {submittedData.map((data, index) => (
                <tr key={index}>
                    <td>
                        {Object.entries(data).map(([key, value]) => (
                            <div key={key}>
                                <strong>{key}:</strong> {value}
                            </div>
                        ))}
                    </td>
                </tr>
            ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </>
    );
};

export default DynamicForm;
