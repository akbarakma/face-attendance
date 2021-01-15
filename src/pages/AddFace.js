import React from "react";
import { useHistory } from "react-router-dom";

const AddFace = () => {
  const history = useHistory();
  return (
    <>
      <h1>TEST</h1>
      <button type="button" className="btn btn-primary mt-3" onClick={() => history.push("/")}>
        Back to Home
      </button>
    </>
  )
};

export default AddFace;
