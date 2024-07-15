package se.harald.receipt.repository;

import org.springframework.data.repository.ListCrudRepository;
import org.springframework.stereotype.Repository;
import se.harald.receipt.model.Receipt;

@Repository
public interface ReceiptRepository extends ListCrudRepository<Receipt, Long> {
}
