package com.petshop.backend.debt.controller;

import com.petshop.backend.debt.dto.DebtPaymentRequest;
import com.petshop.backend.debt.dto.DebtPaymentResponse;
import com.petshop.backend.debt.service.DebtPaymentService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/debt-payments")
public class DebtPaymentController {

    private final DebtPaymentService debtPaymentService;

    public DebtPaymentController(
            DebtPaymentService debtPaymentService) {

        this.debtPaymentService = debtPaymentService;
    }

    /*
     * ==========================
     * RECORD DEBT PAYMENT
     * ==========================
     *
     * POST /api/debt-payments
     */

    @PostMapping
    public DebtPaymentResponse makePayment(
            @RequestBody DebtPaymentRequest request) {

        return debtPaymentService.makePayment(request);
    }

    /*
     * ==========================
     * GET CUSTOMER PAYMENT HISTORY
     * ==========================
     *
     * GET /api/debt-payments/customer/{customerId}
     */

    @GetMapping("/customer/{customerId}")
    public List<DebtPaymentResponse> getCustomerPayments(
            @PathVariable Long customerId) {

        return debtPaymentService.getCustomerPayments(
                customerId);
    }
}


