package se.harald.receipt.repository;

import org.springframework.data.repository.ListCrudRepository;
import org.springframework.stereotype.Repository;
import se.harald.receipt.model.Receipt;

import java.util.List;

@Repository
public interface ReceiptRepository extends ListCrudRepository<Receipt, Long> {

    // added method to find by user_id
    List<Receipt> findByPerson(String userEmail);
}
