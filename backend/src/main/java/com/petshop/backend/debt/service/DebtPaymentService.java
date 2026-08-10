package com.petshop.backend.debt.service;

import com.petshop.backend.debt.dto.DebtPaymentRequest;
import com.petshop.backend.debt.dto.DebtPaymentResponse;

import java.util.List;

public interface DebtPaymentService {

    DebtPaymentResponse makePayment(
            DebtPaymentRequest request);

    List<DebtPaymentResponse> getCustomerPayments(
            Long customerId);
}

