package com.petshop.backend.debt.service;

import com.petshop.backend.customer.entity.Customer;
import com.petshop.backend.customer.repository.CustomerRepository;
import com.petshop.backend.debt.entity.DebtPayment;
import com.petshop.backend.debt.repository.DebtPaymentRepository;
import com.petshop.backend.sale.entity.Sale;
import com.petshop.backend.sale.repository.SaleRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class DebtService {

    private final DebtPaymentRepository debtPaymentRepository;
    private final SaleRepository saleRepository;
    private final CustomerRepository customerRepository;

    public DebtService(
            DebtPaymentRepository debtPaymentRepository,
            SaleRepository saleRepository,
            CustomerRepository customerRepository
    ) {
        this.debtPaymentRepository = debtPaymentRepository;
        this.saleRepository = saleRepository;
        this.customerRepository = customerRepository;
    }

    public Double getTotalCreditSales(Long customerId) {

        List<Sale> creditSales =
                saleRepository.findByCustomerIdAndPaymentMethod(
                        customerId,
                        "CREDIT"
                );

        return creditSales.stream()
                .mapToDouble(Sale::getTotal)
                .sum();
    }

    public Double getTotalDebtPayments(Long customerId) {

        return debtPaymentRepository.findByCustomerId(customerId)
                .stream()
                .mapToDouble(DebtPayment::getAmount)
                .sum();
    }

    public Double getOutstandingDebt(Long customerId) {

        Double creditSales = getTotalCreditSales(customerId);
        Double debtPayments = getTotalDebtPayments(customerId);

        return creditSales - debtPayments;
    }

    public DebtPayment recordPayment(
            Long customerId,
            Double amount,
            String paymentMethod,
            String reference,
            String notes,
            String receivedBy
    ) {

        if (amount == null || amount <= 0) {
            throw new IllegalArgumentException(
                    "Payment amount must be greater than zero."
            );
        }

        Customer customer = customerRepository
                .findById(customerId)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Customer not found."
                        )
                );

        Double currentDebt = getOutstandingDebt(customerId);

        if (currentDebt <= 0) {
            throw new IllegalArgumentException(
                    "This customer has no outstanding debt."
            );
        }

        if (amount > currentDebt) {
            throw new IllegalArgumentException(
                    "Payment cannot exceed the customer's outstanding debt of KSh "
                            + currentDebt
            );
        }

        DebtPayment payment = new DebtPayment();

        payment.setCustomer(customer);
        payment.setAmount(amount);
        payment.setPaymentMethod(paymentMethod);
        payment.setReference(reference);
        payment.setNotes(notes);
        payment.setReceivedBy(receivedBy);
        payment.setPaymentDate(LocalDateTime.now());

        return debtPaymentRepository.save(payment);
    }

    public List<DebtPayment> getPaymentHistory(Long customerId) {

        return debtPaymentRepository
                .findByCustomerIdOrderByPaymentDateDesc(customerId);
    }
}
