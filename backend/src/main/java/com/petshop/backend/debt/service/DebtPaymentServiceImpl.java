package com.petshop.backend.debt.service;

import com.petshop.backend.customer.entity.Customer;
import com.petshop.backend.customer.repository.CustomerRepository;
import com.petshop.backend.debt.dto.DebtPaymentRequest;
import com.petshop.backend.debt.dto.DebtPaymentResponse;
import com.petshop.backend.debt.entity.DebtPayment;
import com.petshop.backend.debt.repository.DebtPaymentRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@Transactional
public class DebtPaymentServiceImpl
        implements DebtPaymentService {

    private final DebtPaymentRepository debtPaymentRepository;
    private final CustomerRepository customerRepository;

    public DebtPaymentServiceImpl(
            DebtPaymentRepository debtPaymentRepository,
            CustomerRepository customerRepository) {

        this.debtPaymentRepository = debtPaymentRepository;
        this.customerRepository = customerRepository;
    }

    @Override
    public DebtPaymentResponse makePayment(
            DebtPaymentRequest request) {

        /*
         * ==========================
         * FIND CUSTOMER
         * ==========================
         */

        Customer customer =
                customerRepository.findById(
                        request.getCustomerId())
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Customer not found."));

        /*
         * ==========================
         * VALIDATE PAYMENT
         * ==========================
         */

        if (request.getAmount() == null ||
                request.getAmount() <= 0) {

            throw new RuntimeException(
                    "Payment amount must be greater than zero.");
        }

        /*
         * Customer cannot pay more than
         * their current outstanding debt.
         */

        if (request.getAmount() >
                customer.getTotalDebt()) {

            throw new RuntimeException(
                    "Payment cannot exceed the customer's current debt.");
        }

        /*
         * ==========================
         * CREATE PAYMENT RECORD
         * ==========================
         */

        DebtPayment payment =
                new DebtPayment();

        payment.setCustomer(customer);

        payment.setAmount(
                request.getAmount());

        payment.setPaymentMethod(
                request.getPaymentMethod());

        payment.setReference(
                request.getReference());

        payment.setNotes(
                request.getNotes());

        payment.setPaymentDate(
                LocalDateTime.now());

        payment.setReceivedBy(
                request.getReceivedBy());

        /*
         * ==========================
         * REDUCE CUSTOMER DEBT
         * ==========================
         */

        double remainingDebt =
                customer.getTotalDebt()
                        - request.getAmount();

        /*
         * Avoid tiny floating-point
         * negative values such as -0.00001.
         */

        if (remainingDebt < 0) {
            remainingDebt = 0.0;
        }

        customer.setTotalDebt(
                remainingDebt);

        /*
         * ==========================
         * SAVE
         * ==========================
         */

        debtPaymentRepository.save(payment);

        customerRepository.save(customer);

        /*
         * ==========================
         * RESPONSE
         * ==========================
         */

        return mapToResponse(
                payment,
                customer.getTotalDebt());
    }

    @Override
    public List<DebtPaymentResponse>
    getCustomerPayments(Long customerId) {

        /*
         * Make sure customer exists.
         */

        Customer customer =
                customerRepository.findById(customerId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Customer not found."));

        /*
         * Retrieve newest payments first.
         */

        return debtPaymentRepository
                .findByCustomerIdOrderByPaymentDateDesc(
                        customerId)
                .stream()
                .map(payment ->
                        mapToResponse(
                                payment,
                                customer.getTotalDebt()))
                .toList();
    }

    /*
     * ==========================
     * MAP RESPONSE
     * ==========================
     */

    private DebtPaymentResponse mapToResponse(
            DebtPayment payment,
            Double remainingDebt) {

        DebtPaymentResponse response =
                new DebtPaymentResponse();

        response.setId(
                payment.getId());

        response.setCustomerId(
                payment.getCustomer().getId());

        response.setCustomerName(
                payment.getCustomer().getName());

        response.setAmount(
                payment.getAmount());

        response.setPaymentMethod(
                payment.getPaymentMethod());

        response.setReference(
                payment.getReference());

        response.setNotes(
                payment.getNotes());

        response.setPaymentDate(
                payment.getPaymentDate());

        response.setReceivedBy(
                payment.getReceivedBy());

        response.setRemainingDebt(
                remainingDebt);

        return response;
    }
}

