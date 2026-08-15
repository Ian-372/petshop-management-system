package com.petshop.backend.report.dto;

public record SalesTransactionItemResponse(
        String productName,
        Integer quantity,
        Double unitPrice,
        Double costPrice,
        Double subtotal) {
}
