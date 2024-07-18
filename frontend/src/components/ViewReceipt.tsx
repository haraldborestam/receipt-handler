import { ReceiptType } from "./Types";
import DeleteIcon from "/delete-icon.svg";

type Props = {
  receipt: ReceiptType;
  hideWindow: () => void;
};

function ViewReceipt({ receipt, hideWindow }: Props) {
  return (
    <>
      <div className="view-receipt-box position-relative margin-top-100px margin-left-1em">
        <img
          src={DeleteIcon}
          alt="X"
          className="delete_icon upper-left-corner"
          onClick={() => hideWindow()}
        />
        <div className="view-receipt_image">
          <div className="image-preview">
            <img
              src={"http://localhost:8080/api/file/" + receipt.file_url}
              alt="image of receipt goes here"
            />
          </div>
        </div>
        Company: {receipt.company}
        <br></br>
        Amount: {receipt.total_amount}
        <br></br>
        Date: {receipt.date}
        <br></br>
        Text content: {receipt.text_content}
      </div>
    </>
  );
}

export default ViewReceipt;
