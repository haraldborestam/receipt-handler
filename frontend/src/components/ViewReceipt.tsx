import { ReceiptType } from "./Types";
import DeleteIcon from "/delete-icon.svg";

// Den här ska ta emot props för att:
// - Visa receipt, dvs en receipt-prop
// - Dölja rutan, dvs en funktion för hideWindow

type Props = {
  receipt: ReceiptType;
  hideWindow: () => void;
};

function ViewReceipt({ receipt, hideWindow }: Props) {
  return (
    <>
      <div className="view-receipt-box position-relative">
        <img
          src={DeleteIcon}
          alt="X"
          className="delete_icon upper-left-corner"
          onClick={() => hideWindow()}
        />
        {receipt.total_amount || "hello"}
        {receipt.date}
        {receipt.text_content}
      </div>
    </>
  );
}

export default ViewReceipt;
