import React, { useState } from "react";
import DeleteIcon from "/delete-icon.svg";

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
  const [company, setCompany] = useState("");
  const [total_amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [text_content, setTextContent] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);

      const formData = new FormData();
      formData.append("file", e.target.files[0]);

      try {
        const response = await fetch(
          "http://localhost:8080/api/textextraction",
          {
            method: "POST",
            body: formData,
          }
        );

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const extractedText = await response.json();

        setCompany(extractedText.company);
        setAmount(extractedText.total_amount);
        setDate(extractedText.date);
        setTextContent(extractedText.text_content);
      } catch (error) {
        console.error("Error:", error);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    if (file) {
      formData.append("file", file);
    }
    formData.append("company", company);
    formData.append("total_amount", total_amount);
    formData.append("date", date);
    formData.append("text_content", text_content);
    formData.append("person", "hardcoded.user@jwt.com");

    try {
      const response = await fetch("http://localhost:8080/api/create", {
        method: "POST",
        body: formData,
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
      <img
        src={DeleteIcon}
        alt="X"
        className="delete_icon"
        onClick={() => deleteReceipt(receipt.id)}
      />
      <h1>Add receipt</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="image">Upload Image</label>
        <input
          type="file"
          id="image"
          name="image"
          accept="image/*"
          onChange={handleImageUpload}
        />
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
