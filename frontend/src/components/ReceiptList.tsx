import { useState } from "react";
import BinIcon from "/bin-icon.svg";

type ReceiptType = {
  id: number;
  company: string;
  total_amount: string;
  date: string;
  text_content: string;
  file_url: string;
  person: string;
};

type Props = {
  personId: number;
  receipts: ReceiptType[];
  setReceipts: React.Dispatch<React.SetStateAction<ReceiptType[]>>;
  handleViewReceipt: (receipt: ReceiptType) => void;
  activeReceipt: number;
  handleActiveReceipt: (receiptId: number) => void;
  addReceipt: () => void;
};

function ReceiptsList({
  receipts,
  setReceipts,
  handleViewReceipt,
  activeReceipt,
  handleActiveReceipt,
  addReceipt,
}: Props) {
  const [error, setError] = useState<Error | null>(null);
  //const [activeReceipt, setActiveReceipt] = useState();

  const deleteReceipt = (id: number) => {
    fetch(`http://10.0.5.206:8080/api/${id}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        setReceipts((prevReceipts) =>
          prevReceipts.filter((receipt) => receipt.id !== id)
        );
      })
      .catch((error) => {
        setError(error);
      });
  };

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div>
      <table className="receipt-table">
        <thead>
          <tr>
            <th>Company</th>
            <th className="text-right">Total</th>
            <th>Date</th>
            <th className="text-center">
              <button className="button-add" onClick={() => addReceipt()}>
                Add
              </button>
            </th>
          </tr>
        </thead>
        <tbody>
          {receipts.map((receipt) => (
            <tr
              onClick={() => {
                handleViewReceipt(receipt);
                handleActiveReceipt(receipt.id);
              }}
              key={receipt.id}
              className={
                "receipt-table_row " +
                (activeReceipt && receipt.id == activeReceipt ? "active" : "")
              }
            >
              <td>{receipt.company}</td>
              <td className="text-right">{receipt.total_amount}</td>
              <td>{receipt.date}</td>
              <td className="text-center">
                <img
                  src={BinIcon}
                  alt="X"
                  className="bin_icon"
                  onClick={(e) => {
                    deleteReceipt(receipt.id);
                    e.stopPropagation();
                  }}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ReceiptsList;
