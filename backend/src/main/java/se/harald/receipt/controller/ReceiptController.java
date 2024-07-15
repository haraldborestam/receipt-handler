package se.harald.receipt.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import se.harald.receipt.model.Receipt;
import se.harald.receipt.service.ReceiptService;

@RestController
@RequestMapping("/api")
public class ReceiptController {

    // Field
    private final ReceiptService service;

    // Constructor
    public ReceiptController(ReceiptService service) {
        this.service = service;
    }

    // Methods
    @PostMapping("/textextraction")
    public Receipt textExtraction(@RequestParam("file")MultipartFile file) {
        // Comment: this method only extracts text from the image and maps it to an object
        // It does not save the file to the server nor to the database.
        // todo: returnera ett ResponseEntity med Receipt-objektet och status 200 OK.
        return service.textExtraction(file);
    }

    @PostMapping("/create")
    public Receipt createReceipt(
            @RequestParam("file")MultipartFile file,
            @RequestParam("company") String company,
            @RequestParam("total_amount") String totalAmount,
            @RequestParam("date") String date,
            @RequestParam("text_content") String textContent
    ) {
        // Mappa till Receipt-objekt
        Receipt newReceipt = new Receipt(company, totalAmount, date, textContent);

        // todo: skicka tillbaka ett ResponseEntity med 201 CREATED
        return service.createReceipt(file, newReceipt);
    }

}
