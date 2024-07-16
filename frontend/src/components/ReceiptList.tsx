import { useState } from "react";
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

type Props = {
  personId: number;
  receipts: ReceiptType[];
  setReceipts: React.Dispatch<React.SetStateAction<ReceiptType[]>>;
};

function ReceiptsList({ receipts, setReceipts }: Props) {
  const [error, setError] = useState<Error | null>(null);

  //http://localhost:8080
  const deleteReceipt = (id: number) => {
    fetch(`http://localhost:8080/api/${id}`, {
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
            <th className="text-center"></th>
          </tr>
        </thead>
        <tbody>
          {receipts.map((receipt) => (
            <tr key={receipt.id} className="receipt-table_row">
              <td>{receipt.company}</td>
              <td className="text-right">{receipt.total_amount}</td>
              <td>{receipt.date}</td>
              <td className="text-center">
                <img
                  src={DeleteIcon}
                  alt="X"
                  className="delete_icon"
                  onClick={() => deleteReceipt(receipt.id)}
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