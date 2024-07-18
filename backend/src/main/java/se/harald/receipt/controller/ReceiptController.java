package se.harald.receipt.controller;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import se.harald.receipt.model.Receipt;
import se.harald.receipt.service.ReceiptService;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
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
        //return service.textExtraction(file);
        return new Receipt("1919", "Bauhaus", "2023-08-19", "Gamla Nynäsvägen 600S-142 51 SkogåsTlf. 020-120 20 30www.bauhaus.seORG.NR: 969630-6944VEDKLYV HL 650 0 2.295,00* DEKORT 495,00TOTAL 1.800,00Bankkort 1.800,00Moms% 25%Moms 360,00Brutto 1.800,00Ni blev betjänad av: 4232209 10 140 14 10 18 15:50För mer information: Privatkunder - 60 dagars öppet köpPremiumkunder - 90 dagars öppet köp", "hardcoded.user@jwt.com");
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
        System.out.println("New receipt received:");
        System.out.println("\tCompany:" + company);
        System.out.println("\tText content:" + textContent);
        Receipt newReceipt = new Receipt(totalAmount, company, date, textContent, "hardcoded.user@jwt.com");

        // todo: skicka tillbaka ett ResponseEntity med 201 CREATED
        return service.createReceipt(file, newReceipt);
    }

    @GetMapping("/file/{fileName}")
    public ResponseEntity<byte[]> serveFile(@PathVariable String fileName) {
        Path filePath = Paths.get("app_data/images/" + fileName);
        try {
            byte[] imageData = Files.readAllBytes(filePath);
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.IMAGE_JPEG); // Ought to be adjusted for different file formats but seems to be working...
            return new ResponseEntity<>(imageData, headers, HttpStatus.OK);
        } catch (IOException e) {
            // Handle file not found or other IO exceptions
            return ResponseEntity.notFound().build();
        }
    }

}
