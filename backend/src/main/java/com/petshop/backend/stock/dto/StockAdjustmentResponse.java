package com.petshop.backend.stock.dto;

import java.time.LocalDateTime;

public record StockAdjustmentResponse(Long id, Long productId, String productName, String adjustmentType, Integer quantity, Integer quantityBefore, Integer quantityAfter, String reason, String adjustedBy, LocalDateTime adjustmentDate) { }
