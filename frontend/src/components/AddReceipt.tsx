import React, { useState } from "react";

type ReceiptType = {
  id: number;
  company: string;
  total_amount: string;
  date: string;
  text_content: string;
  file_url: string;
  person: string;
};

type AddReceiptProps = {
  onAddReceipt: (newReceipt: ReceiptType) => void;
};

function AddReceipt({ onAddReceipt }: AddReceiptProps) {
  const [company, setCompany] = useState("7Eleven");
  const [total_amount, setAmount] = useState("1234");
  const [date, setDate] = useState("2024-12-31");
  const [text_content, setTextContent] = useState(
    "Propane and propane accessories"
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newReceipt = {
      company,
      total_amount,
      date,
      text_content: "",
      file_url: "",
      person: "hardcoded.user@jwt.com",
    };

    try {
      const response = await fetch("http://localhost:8080/api/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newReceipt),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const createdReceipt = await response.json();
      onAddReceipt(createdReceipt);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="add-receipt-box">
      <h1>Add receipt</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="company">Purchased from</label>
        <input
          type="text"
          id="company"
          name="company"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
        />
        <label htmlFor="amount">Amount</label>
        <input
          type="text"
          id="amount"
          name="amount"
          value={total_amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <label htmlFor="date">Date</label>
        <input
          type="text"
          id="date"
          name="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <label htmlFor="text_content">Text content</label>
        <input
          type="text"
          id="text_input"
          name="text_input"
          value={text_content}
          onChange={(e) => setTextContent(e.target.value)}
        />
        <input
          type="submit"
          value="Add new receipt"
          className="submit-button"
        />
      </form>
    </div>
  );
}

export default AddReceipt;
