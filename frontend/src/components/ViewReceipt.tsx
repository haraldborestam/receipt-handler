import { ReceiptType } from "./Types";
import DeleteIcon from "/delete-icon.svg";

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
        <button className="edit-button upper-right-corner">edit</button>
        <form className="add-receipt-form">
          <div className="dropzonea">
            <div className="image-preview">
              <img
                src={"http://10.0.5.206:8080/api/file/" + receipt.file_url}
                alt="Image preview"
              />
            </div>
          </div>
          <label htmlFor="company">Purchased from</label>
          <input
            type="text"
            id="company"
            name="company"
            value={receipt.company}
            readOnly
          />
          <label htmlFor="amount">Amount</label>
          <input
            type="text"
            id="amount"
            name="amount"
            value={receipt.total_amount}
            readOnly
          />
          <label htmlFor="date">Date</label>
          <input
            type="text"
            id="date"
            name="date"
            value={receipt.date}
            readOnly
          />
          <label htmlFor="text_content">Text content</label>
          <textarea
            id="text_input"
            name="text_input"
            value={receipt.text_content}
            readOnly
          />
        </form>
      </div>
    </>
  );
}

export default ViewReceipt;
