import React from "react";
import AccommodationsForm from "./AccomodationsForm.jsx";
import AdminNav from "../../components/AdminNav.jsx";

const AddPlace = () => {
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <AdminNav />
      <AccommodationsForm />
    </div>
  );
};

export default AddPlace;
