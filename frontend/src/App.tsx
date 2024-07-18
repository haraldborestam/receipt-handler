import { useState, useEffect } from "react";
import "./App.css";
import AddReceipt from "./components/AddReceipt";
import ReceiptsList from "./components/ReceiptList";
import ViewReceipt from "./components/ViewReceipt";

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
  // Den här är för att visa/dölja komponenten ViewReceipt
  const [showViewReceiptWindow, setShowViewReceiptWindow] = useState(false);
  // Den här är för att sätta ett (1) enskilt receipt som ska granskas i komponenten ViewReceipt
  const [receiptToBeViewed, setReceiptToBeViewed] = useState<ReceiptType>();
  // -------------------------------------------------------------------------------------
  // Fetch receipts on mount
  useEffect(() => {
    fetch(`http://localhost:8080/api/receipt`)
      .then((response) => response.json())
      .then((data) => {
        setReceipts(data);
        setSearchResultReceipts(data);
      })
      .catch((error) => console.error("Error fetching receipts:", error));
  }, []);
  // -------------------------------------------------------------------------------------
  // Den här funktionen skickas till AddReceipt-komponenten som fyller den med ett nytt
  // receipt som då skickas tillbaka hit och som ReceiptsList-komponenten kan ta del av
  // och på så sätt lägga till i sin tabell. Så lite fram och tillbaka helt enkelt.
  const handleAddReceipt = (newReceipt: ReceiptType) => {
    console.log(
      "INFO: Nu körs funktionen handleAddReceipt i App.tsx \nTRIGGER: borde vara att nytt kvitto skapats i AddReceipt.tsx"
    );
    setReceipts((prevReceipts) => [...prevReceipts, newReceipt]);
    console.log(newReceipt);
    setShowAddReceiptWindow(false);
  };
  // -------------------------------------------------------------------------------------
  // Funktion för att dölja AddReceipt-komponenten.
  // Skickas till AddReceipt-komponenten som en Prop så att den kan skapa en stäng-knapp.
  const hideAddReceiptWindow = () => {
    setShowAddReceiptWindow(false);
  };
  // -------------------------------------------------------------------------------------
  // Funktion som ser till att ViewReceipt-fönstret visas med korrekt kvitto.
  // Skickas till ReceiptList-komponenten som en Prop så funktionen kan kopplas till en
  // onClick händelse för varje rad i tabellen.
  const handleViewReceipt = (receipt: ReceiptType) => {
    // 1: sätt aktuellt kvitto
    setReceiptToBeViewed(receipt);
    // 2: sätt visibility till true
    setShowViewReceiptWindow(true);
    // 3: dölj AddReceipt-komponenten
    setShowAddReceiptWindow(false);
  };
  // -------------------------------------------------------------------------------------
  // Funktion för att dölja ViewReceipt-komponenten.
  // Skickas till ViewReceipt-komponenten som en Prop så att den kan skapa en stäng-knapp.
  const hideViewReceiptWindow = () => {
    setShowViewReceiptWindow(false);
  };
  // -------------------------------------------------------------------------------------
  // Sökfunktion
  const [query, setQuery] = useState("");
  const [searchResultReceipts, setSearchResultReceipts] =
    useState<ReceiptType[]>(receipts);

  function searchFunc(e) {
    e.preventDefault();
    setSearchResultReceipts(
      receipts.filter(
        (receipt) =>
          receipt.text_content.includes(query) ||
          receipt.company.includes(query) ||
          receipt.date.includes(query) ||
          receipt.total_amount.includes(query)
      )
    );
    console.log(searchResultReceipts);
  }
  // -------------------------------------------------------------------------------------
  return (
    <>
      <div className="mega-container">
        <div className="first-container">
          <button
            className="button-add"
            onClick={() => {
              setShowAddReceiptWindow(!showAddReceiptWindow);
              setShowViewReceiptWindow(false);
            }}
          >
            Add receipt
          </button>
          <form onSubmit={searchFunc}>
            <input
              className="search-bar"
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search..."
            />
          </form>
          <ReceiptsList
            personId={1}
            receipts={(query && searchResultReceipts) || receipts}
            setReceipts={setReceipts}
            handleViewReceipt={handleViewReceipt}
          />
        </div>
        <div className="second-container">
          {showAddReceiptWindow && (
            <AddReceipt
              onAddReceipt={handleAddReceipt}
              hideWindow={hideAddReceiptWindow}
            />
          )}
          {showViewReceiptWindow && receiptToBeViewed && (
            <ViewReceipt
              receipt={receiptToBeViewed}
              hideWindow={hideViewReceiptWindow}
            />
          )}
        </div>
      </div>
    </>
  );
}

export default App;
