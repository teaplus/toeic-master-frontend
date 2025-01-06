import React, { useState } from "react";
import "./test.css";
import AddQuestionForm from "../../../components/common/test/AddQuestionForm";
import TabsForm from "../../../components/common/test/TabsForm";
const CreateToeicTest = () => {
  return (
    <div className="p-6 min-h-screen mt-14 w-full">
      <div className="part w-full">
        <div className="question w-full">
          <TabsForm />
        </div>
      </div>
    </div>
  );
};

export default CreateToeicTest;
