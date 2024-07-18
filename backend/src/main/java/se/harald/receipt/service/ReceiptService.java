package se.harald.receipt.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.springframework.web.multipart.MultipartFile;
import se.harald.receipt.model.Receipt;
import se.harald.receipt.repository.ReceiptRepository;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Base64;
import java.util.List;
import java.util.UUID;

@Service
public class ReceiptService {

    // Fields
    private final ReceiptRepository repository;
    private final RestClient restClient;
    @Value("${keys.openai}")
    private String API_KEY;
    @Value("${image.upload.dir}")
    private String fileDirectory;

    // Constructor
    public ReceiptService(ReceiptRepository repository) {
        this.repository = repository;
        restClient = RestClient.builder()
                .baseUrl("https://api.openai.com/v1/chat")
                .build();
    }

    // Methods
    public Receipt textExtraction(MultipartFile file) {
        System.out.println("\n\tCALL TO TEXT EXTRACTION API MADE\n");

        // Comment: file extension is needed when calling the text extraction api
        String fileExtensionType = getFileExtensionType(file.getOriginalFilename());
        // Comment: the image passed to the text extraction api has to be in base 64 format.
        String base64Image = convertFileToBase64(file);

        String jsonString = "{" +
                "\"model\": \"gpt-4o\"," +
                "\"messages\": [" +
                "{" +
                "\"role\": \"user\"," +
                "\"content\": [" +
                "{" +
                "\"type\": \"text\"," +
                "\"text\": \"Extrahera texten i kvittot till följande key-value pairs: company, total_amount, date, text_content .Observera att ditt respons måste vara i json-format utan något extra. Alla fält ska vara av datatypen String. Om bilden inte är på ett kvitto lämna fälten tomma.\"" +
                "}," +
                "{" +
                "\"type\": \"image_url\"," +
                "\"image_url\": {" +
                "\"url\": \"data:image/" + fileExtensionType + ";base64," + base64Image + "\"" +
                "}" +
                "}" +
                "]" +
                "}" +
                "]," +
                "\"max_tokens\": 300" +
                "}";

        try {
            String response = restClient.post()
                    .uri("/completions")
                    .header("Content-Type", "application/json")
                    .header("Authorization", "Bearer " + API_KEY)
                    .body(jsonString)
                    .retrieve()
                    .body(String.class);

            // Parse JSON to object
            ObjectMapper objectMapper = new ObjectMapper();
            JsonNode rootNode = objectMapper.readTree(response);
            JsonNode contentNode = rootNode.path("choices").get(0).path("message").path("content");

            // Remove the ```json\n prefix and ``` suffix if present
            String contentString = contentNode.asText();
            if (contentString.startsWith("```json")) {
                contentString = contentString.substring(7, contentString.length() - 3);
            }

            // Map the contentString to Receipt class
            return objectMapper.readValue(contentString, Receipt.class);

        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    public String getFileExtensionType(String fileName) {
        try {
            String formatName = fileName.substring(fileName.lastIndexOf('.') + 1);
            return formatName.toLowerCase();
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    public String convertFileToBase64(MultipartFile file) {
        try {
            // Read bytes from MultipartFile
            byte[] fileBytes = file.getBytes();

            // Encode byte array to Base64 string
            return Base64.getEncoder().encodeToString(fileBytes);

        } catch (IOException e) {
            e.printStackTrace();
            return null;
        }
    }

    public Receipt createReceipt(MultipartFile file, Receipt newReceipt) {
        // 1: Skapa filnamn
        UUID uuid = UUID.randomUUID();
        String fileExtensionType = getFileExtensionType(file.getOriginalFilename());
        String fileName = uuid + "." + fileExtensionType;
        newReceipt.setFile_url(fileName);
        // 2: Spara filen
        try {
            Path path = Paths.get(fileDirectory + newReceipt.getFile_url());
            Files.write(path, file.getBytes());
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
        // 3: Spara kvittot
        repository.save(newReceipt);

        return newReceipt;
    }

    public List<Receipt> getAllReceipts() {
        return repository.findAll();
    }

    public List<Receipt> getReceiptsByUserEmail(String userEmail) {
        return repository.findByPerson(userEmail);
    }

    public Receipt getReceiptById(Long id) {
        return repository.findById(id).orElseThrow();
    }

    public boolean deleteById(Long id) {
        try {
            repository.deleteById(id);
            return true;
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    public void updateReceiptById(Long id, Receipt newReceipt) {
        // 1: hitta kvittot
        Receipt receiptFromDatabase = getReceiptById(id);
        // 2: uppdatera fälten som är ändrade
        receiptFromDatabase.setCompany(newReceipt.getCompany());
        receiptFromDatabase.setDate(newReceipt.getDate());
        receiptFromDatabase.setText_content(newReceipt.getText_content());
        receiptFromDatabase.setTotal_amount(newReceipt.getTotal_amount());
        // 3: spara kvittot
        repository.save(receiptFromDatabase);
    }
}
