package se.harald.receipt.model;

import jakarta.persistence.*;

@Entity(name = "receipt")
public class Receipt {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String company;
    private String total_amount;
    private String date;
    @Column(columnDefinition = "TEXT")
    private String text_content;
    private String file_url;
    private String person;

    // Constructor (DEFAULT)
    public Receipt() {
    }

    // Constructor (Used when doing text extraction via external API)
    public Receipt(String total_amount, String company, String date, String text_content, String person) {
        this.total_amount = total_amount;
        this.company = company;
        this.date = date;
        this.text_content = text_content;
        this.person = person;
    }

    // Getters & Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

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

    public String getPerson() {
        return person;
    }

    public void setPerson(String person) {
        this.person = person;
    }
}
