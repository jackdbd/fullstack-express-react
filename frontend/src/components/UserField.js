import React from "react";

const UserField = props => {
  const { label, input, meta } = props;
  return (
    <div>
      <label>{label}</label>
      <input {...input} style={{ marginBottom: "5px" }} />
      <div className="red-text" style={{ marginBottom: "20px" }}>
        {meta.touched && meta.error}
      </div>
    </div>
  );
};

export default UserField;
