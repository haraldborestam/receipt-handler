import React, { useState, useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import DeleteIcon from "/delete-icon.svg";
import loadingGif from "/loading.gif";
import UploadIcon from "/upload-icon.svg";
import heic2any from "heic2any";

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
  hideWindow: () => void;
};

function AddReceipt({ onAddReceipt, hideWindow }: AddReceiptProps) {
  const [company, setCompany] = useState("");
  const [total_amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [text_content, setTextContent] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      const selectedFile = acceptedFiles[0];
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
      handleImageUpload(selectedFile);
    }
  }, []);

  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: "image/*",
  });

  const handleImageUpload = async (file: File) => {
    setIsLoading(true);
    const formData = new FormData();

    // ----------------------------------
    // ------- Convert Heic file --------
    console.log("FILE TYPE IS: " + file.type);
    if (file.type === "image/heic") {
      console.log("HEIC file detected. Commencing conversion process");

      try {
        // Wait for the HEIC to JPEG conversion
        const convertedBlob = await heic2any({
          blob: file,
          toType: "image/jpeg",
          quality: 0.2, // should reduce the file size
        });

        // Create a new File from the Blob
        const jpegFile = new File(
          [convertedBlob],
          file.name.replace(/\.[^/.]+$/, ".jpeg"),
          {
            type: "image/jpeg",
            lastModified: Date.now(),
          }
        );

        // We set file because it will be used later when doing submit (i.e. create new receipt)
        setFile(jpegFile);
        formData.append("file", jpegFile);
      } catch (error) {
        console.error("Conversion to JPEG failed:", error);
        return; // Stop submission if conversion fails
      }
    } else {
      formData.append("file", file);
    }
    // ----------------------------------

    try {
      const response = await fetch(
        "http://10.0.5.206:8080/api/textextraction",
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
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    // if file exists then we append it to formData
    if (file) {
      if (file.type === "image/heic") {
        console.log(
          "yes the filetype is a heic. so we will try to convert it.... :D "
        );

        try {
          // Wait for the HEIC to JPEG conversion
          const convertedBlob = await heic2any({
            blob: file,
            toType: "image/jpeg",
          });

          // Create a new File from the Blob
          const jpegFile = new File(
            [convertedBlob],
            file.name.replace(/\.[^/.]+$/, ".jpeg"),
            {
              type: "image/jpeg",
              lastModified: Date.now(),
            }
          );

          // Append the JPEG file to the FormData
          console.log("--- --- heic image converted and appends now --- ---");
          formData.append("file", jpegFile);
        } catch (error) {
          console.error("Conversion to JPEG failed:", error);
          return; // Stop submission if conversion fails
        }
      } else {
        formData.append("file", file);
      }
    }
    console.log("pom baw nu skickar vi till servern");
    formData.append("company", company);
    formData.append("total_amount", total_amount);
    formData.append("date", date);
    formData.append("text_content", text_content);
    formData.append("person", "hardcoded.user@jwt.com");

    try {
      const response = await fetch("http://10.0.5.206:8080/api/create", {
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
    <div className="add-receipt-box position-relative">
      <img
        src={DeleteIcon}
        alt="X"
        className="delete_icon upper-left-corner"
        onClick={() => hideWindow()}
      />
      <form onSubmit={handleSubmit} className="add-receipt-form">
        <div {...getRootProps({ className: "dropzone" })}>
          <input {...getInputProps()} />
          {isDragActive ? (
            <p>Drop the image here...</p>
          ) : isLoading ? (
            <div className="loading">
              <img src={loadingGif} alt="Uploading..." />
              uploading file
            </div>
          ) : preview ? (
            <div className="image-preview">
              <img src={preview} alt="Image preview" />
            </div>
          ) : (
            <>
              <img src={UploadIcon} />
              <p>Drag 'n' drop an image here, or click to select one</p>
            </>
          )}
        </div>
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
        <textarea
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
