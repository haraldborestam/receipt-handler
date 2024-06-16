package se.jfs.receipthandler.weblayer;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@RestController
@RequestMapping("/receipt")
public class Controller {

    // temporary list (will be db and service later)
    public List<String> receiptList = Arrays.asList("first", "second", "third");

    @GetMapping
    public Object getAllReceipts() {
        return receiptList;
    }

}
