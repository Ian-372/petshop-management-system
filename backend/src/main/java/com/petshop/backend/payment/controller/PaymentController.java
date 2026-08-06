package com.petshop.backend.payment.controller;

import com.petshop.backend.payment.dto.CallbackRequest;
import com.petshop.backend.payment.dto.StkPushRequest;
import com.petshop.backend.payment.service.PaymentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    private final PaymentService paymentService;

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    @PostMapping("/stkpush")
    public ResponseEntity<String> initiateStkPush(
            @RequestBody StkPushRequest request) {

        return ResponseEntity.ok(
                paymentService.initiateStkPush(request));
    }

    @PostMapping("/cash/{saleId}")
    public ResponseEntity<String> completeCashPayment(
            @PathVariable Long saleId) {

        paymentService.completeCashPayment(saleId);

        return ResponseEntity.ok("Cash payment completed.");
    }

    @PostMapping("/cancel/{saleId}")
    public ResponseEntity<String> cancelSale(
            @PathVariable Long saleId) {

        paymentService.cancelPendingSale(saleId);

        return ResponseEntity.ok("Sale cancelled.");
    }

    @PostMapping("/callback")
    public ResponseEntity<String> callback(
            @RequestBody CallbackRequest request) {

        paymentService.handleCallback(request);

        return ResponseEntity.ok("Callback received");
    }
}