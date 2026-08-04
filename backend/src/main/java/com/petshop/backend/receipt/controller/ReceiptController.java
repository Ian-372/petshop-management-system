package com.petshop.backend.receipt.controller;

import com.petshop.backend.receipt.dto.ReceiptResponse;
import com.petshop.backend.receipt.service.ReceiptService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/receipts")
public class ReceiptController {

    private final ReceiptService receiptService;

    public ReceiptController(ReceiptService receiptService) {
        this.receiptService = receiptService;
    }

    @GetMapping("/{saleId}")
    public ReceiptResponse getReceipt(
            @PathVariable Long saleId) {

        return receiptService.getReceipt(saleId);
    }
}
