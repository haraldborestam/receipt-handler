package se.harald.receipt.model;

public class Receipt {
    private String company;
    private String total_amount;
    private String date;
    private String text_content;
    private String file_url;

    public Receipt() {
    }

    public Receipt(String company, String total_amount, String date, String text_content) {
        this.company = company;
        this.total_amount = total_amount;
        this.date = date;
        this.text_content = text_content;
    }

    // Getters & Setters
    public String getCompany() {
        return company;
    }

    public void setCompany(String company) {
        this.company = company;
    }

    public String getTotal_amount() {
        return total_amount;
    }

    public void setTotal_amount(String total_amount) {
        this.total_amount = total_amount;
    }

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public String getText_content() {
        return text_content;
    }

    public void setText_content(String text_content) {
        this.text_content = text_content;
    }

    public String getFile_url() {
        return file_url;
    }

    public void setFile_url(String file_url) {
        this.file_url = file_url;
    }

    @Override
    public String toString() {
        return "receipt{" +
                "company='" + company + '\'' +
                ", totalAmount='" + total_amount + '\'' +
                ", date='" + date + '\'' +
                ", textContent='" + text_content + '\'' +
                '}';
    }
}
