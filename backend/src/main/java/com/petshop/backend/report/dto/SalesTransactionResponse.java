package com.petshop.backend.report.dto;

import java.time.LocalDateTime;
import java.util.List;

public record SalesTransactionResponse(
        Long id,
        String customerName,
        String phoneNumber,
        LocalDateTime saleDate,
        Double total,
        Double balance,
        String paymentMethod,
        String paymentStatus,
        List<SalesTransactionItemResponse> items) {
}
