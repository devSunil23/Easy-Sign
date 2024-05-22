import React from "react";

const LabelAndInput = ({
    name,
    id,
    value,
    onChange,
    placeholder,
    labelName,
    type = "text",
}) => {
    return (
        <div>
            <label htmlFor={id}>{labelName}</label>
            <input
                type={type}
                id={id}
                name={name}
                value={value}
                placeholder={placeholder}
                onChange={onChange}
            />
        </div>
    );
};

export default LabelAndInput;
