package com.petshop.backend.debt.controller;

import com.petshop.backend.debt.entity.DebtPayment;
import com.petshop.backend.debt.service.DebtService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/debts")
@CrossOrigin
public class DebtController {

    private final DebtService debtService;

    public DebtController(DebtService debtService) {
        this.debtService = debtService;
    }

    @GetMapping("/customer/{customerId}")
    public ResponseEntity<?> getCustomerDebt(
            @PathVariable Long customerId
    ) {

        Double creditSales =
                debtService.getTotalCreditSales(customerId);

        Double debtPayments =
                debtService.getTotalDebtPayments(customerId);

        Double outstandingDebt =
                debtService.getOutstandingDebt(customerId);

        return ResponseEntity.ok(
                Map.of(
                        "customerId", customerId,
                        "totalCreditSales", creditSales,
                        "totalDebtPayments", debtPayments,
                        "outstandingDebt", outstandingDebt
                )
        );
    }

    @GetMapping("/customer/{customerId}/payments")
    public ResponseEntity<List<DebtPayment>> getPaymentHistory(
            @PathVariable Long customerId
    ) {

        return ResponseEntity.ok(
                debtService.getPaymentHistory(customerId)
        );
    }

    @PostMapping("/customer/{customerId}/payment")
    public ResponseEntity<?> recordPayment(
            @PathVariable Long customerId,
            @RequestBody Map<String, Object> request
    ) {

        try {

            Double amount =
                    Double.valueOf(
                            request.get("amount").toString()
                    );

            String paymentMethod =
                    request.get("paymentMethod").toString();

            String reference =
                    request.get("reference") == null
                            ? null
                            : request.get("reference").toString();

            String notes =
                    request.get("notes") == null
                            ? null
                            : request.get("notes").toString();

            String receivedBy =
                    request.get("receivedBy") == null
                            ? null
                            : request.get("receivedBy").toString();

            DebtPayment payment =
                    debtService.recordPayment(
                            customerId,
                            amount,
                            paymentMethod,
                            reference,
                            notes,
                            receivedBy
                    );

            return ResponseEntity.ok(payment);

        } catch (IllegalArgumentException e) {

            return ResponseEntity
                    .badRequest()
                    .body(
                            Map.of(
                                    "error",
                                    e.getMessage()
                            )
                    );
        }
    }
}

