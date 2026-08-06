package com.petshop.backend.receipt.controller;

import com.petshop.backend.receipt.dto.PrintableReceiptResponse;
import com.petshop.backend.receipt.dto.ReceiptResponse;
import com.petshop.backend.receipt.service.ReceiptService;
import org.springframework.web.bind.annotation.*;
import com.petshop.backend.receipt.dto.ReceiptVerificationResponse;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;

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

    @GetMapping("/{saleId}/print")
    public PrintableReceiptResponse getPrintableReceipt(
            @PathVariable Long saleId) {

        return receiptService.getPrintableReceipt(saleId);
    }

    @GetMapping("/verify/{receiptNumber}")
    public ReceiptVerificationResponse verifyReceipt(
            @PathVariable String receiptNumber) {

        return receiptService.verifyReceipt(receiptNumber);

    }

    @GetMapping(value = "/verify/{receiptNumber}", produces = MediaType.TEXT_HTML_VALUE)
    public ResponseEntity<String> verifyReceiptHtml(
            @PathVariable String receiptNumber) {

        ReceiptVerificationResponse result = receiptService.verifyReceipt(receiptNumber);

        String color = result.isValid() ? "#16a34a" : "#dc2626";
        String status = result.isValid()
                ? "VALID RECEIPT"
                : "INVALID RECEIPT";

        String html = """
                <!DOCTYPE html>
                <html>
                <head>
                    <title>Receipt Verification</title>
                    <style>
                        body{
                            font-family:Arial,sans-serif;
                            background:#f5f5f5;
                            display:flex;
                            justify-content:center;
                            align-items:center;
                            height:100vh;
                            margin:0;
                        }
                        .card{
                            background:white;
                            padding:40px;
                            border-radius:12px;
                            box-shadow:0 4px 15px rgba(0,0,0,.15);
                            text-align:center;
                            max-width:500px;
                        }
                        h1{
                            color:%s;
                        }
                        p{
                            font-size:18px;
                        }
                    </style>
                </head>
                <body>
                    <div class="card">
                        <h1>%s</h1>
                        <p>%s</p>
                    </div>
                </body>
                </html>
                """.formatted(
                color,
                status,
                result.getMessage());

        return ResponseEntity.ok(html);
    }
}