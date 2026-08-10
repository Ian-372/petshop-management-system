package com.petshop.backend.debt.repository;

import com.petshop.backend.debt.entity.DebtPayment;
import com.petshop.backend.customer.entity.Customer;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DebtPaymentRepository
        extends JpaRepository<DebtPayment, Long> {

    List<DebtPayment> findByCustomerOrderByPaymentDateDesc(
            Customer customer);

    List<DebtPayment> findByCustomerIdOrderByPaymentDateDesc(
            Long customerId);
}

