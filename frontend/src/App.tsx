import { useState, useEffect } from "react";
import "./App.css";
import AddReceipt from "./components/AddReceipt";
import Menu from "./components/Menu";
import ReceiptsList from "./components/ReceiptList";

type ReceiptType = {
  id: number;
  company: string;
  total_amount: string;
  date: string;
  text_content: string;
  file_url: string;
  person: string;
};

function App() {
  const [showAddReceiptWindow, setShowAddReceiptWindow] = useState(false);
  const [receipts, setReceipts] = useState<ReceiptType[]>([]);

  // Fetch receipts on mount
  useEffect(() => {
    fetch(`http://localhost:8080/api/receipt`)
      .then((response) => response.json())
      .then((data) => setReceipts(data))
      .catch((error) => console.error("Error fetching receipts:", error));
  }, []);

  const handleAddReceipt = (newReceipt: ReceiptType) => {
    setReceipts((prevReceipts) => [...prevReceipts, newReceipt]);
    setShowAddReceiptWindow(false);
  };

  return (
    <>
      <Menu heading="P O P" />
      <button
        className="button-add"
        onClick={() => setShowAddReceiptWindow(!showAddReceiptWindow)}
      >
        Add receipt
      </button>
      <ReceiptsList
        personId={1}
        receipts={receipts}
        setReceipts={setReceipts}
      />
      {showAddReceiptWindow && <AddReceipt onAddReceipt={handleAddReceipt} />}
    </>
  );
}

export default App;
