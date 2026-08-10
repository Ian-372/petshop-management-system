package com.petshop.backend.debt.repository;

import com.petshop.backend.debt.entity.DebtPayment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DebtPaymentRepository extends JpaRepository<DebtPayment, Long> {

    List<DebtPayment> findByCustomerIdOrderByPaymentDateDesc(Long customerId);

    List<DebtPayment> findByCustomerId(Long customerId);
}


