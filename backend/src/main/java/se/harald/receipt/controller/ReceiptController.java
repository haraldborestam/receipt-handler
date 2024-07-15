package se.harald.receipt.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import se.harald.receipt.model.Receipt;
import se.harald.receipt.service.ReceiptService;

import java.util.List;

@CrossOrigin
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
    @GetMapping("/receipt")
    public List<Receipt> getReceiptsByUser() {
        // todo: when Authentication is implemented: use email from JWT token instead of hardcoded value
        String userEmail = "hardcoded.user@jwt.com";
        return service.getReceiptsByUserEmail(userEmail);
    }

    @GetMapping("{id}")
    public Receipt getReceiptById(@PathVariable Long id) {
        // todo: when Authentication is implemented: use email from JWT token instead of this non protected way
        return service.getReceiptById(id);

    }

    @DeleteMapping("{id}")
    public ResponseEntity deleteById(@PathVariable Long id) {
        // todo: Implementera bättre felhantering
        if(service.deleteById(id)) {
            return ResponseEntity.ok().build();
        }
        else {
            return ResponseEntity.notFound().build();
        }
    }

    @PatchMapping("{id}")
    public ResponseEntity updateById(@PathVariable Long id, @RequestBody Receipt receipt) {
        service.updateReceiptById(id, receipt);
        return ResponseEntity.ok().build();
    }

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
