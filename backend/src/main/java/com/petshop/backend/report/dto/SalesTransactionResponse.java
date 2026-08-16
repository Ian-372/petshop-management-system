package com.petshop.backend.report.dto;

import java.time.LocalDateTime;
import java.util.List;

public record SalesTransactionResponse(
        Long id,
        Long customerId,
        String customerName,
        String customerType,
        String phoneNumber,
        LocalDateTime saleDate,
        Double total,
        Double balance,
        Double outstandingDebt,
        String paymentMethod,
        String paymentStatus,
        List<SalesTransactionItemResponse> items) {
}
