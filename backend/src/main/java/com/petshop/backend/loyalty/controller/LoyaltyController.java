package com.petshop.backend.loyalty.controller;

import com.petshop.backend.loyalty.dto.ApiResponse;
import com.petshop.backend.loyalty.dto.LoyaltyResponse;
import com.petshop.backend.loyalty.dto.RedeemPointsRequest;
import com.petshop.backend.loyalty.service.LoyaltyService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/loyalty")
public class LoyaltyController {

    private final LoyaltyService loyaltyService;

    public LoyaltyController(LoyaltyService loyaltyService) {
        this.loyaltyService = loyaltyService;
    }

    @GetMapping("/{customerId}")
    public LoyaltyResponse getCustomerLoyalty(
            @PathVariable Long customerId) {

        return loyaltyService.getCustomerLoyalty(customerId);
    }

    @PostMapping("/award/{saleId}")
    public ResponseEntity<?> awardPoints(
            @PathVariable Long saleId) {

        try {
            LoyaltyResponse response = loyaltyService.awardPoints(saleId);
            return ResponseEntity.ok(response);

        } catch (RuntimeException ex) {

            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse(ex.getMessage()));
        }
    }

    @PostMapping("/redeem")
    public ResponseEntity<?> redeemPoints(
            @RequestBody RedeemPointsRequest request) {

        try {
            LoyaltyResponse response = loyaltyService.redeemPoints(
                    request.getCustomerId(),
                    request.getPoints());

            return ResponseEntity.ok(response);

        } catch (RuntimeException ex) {

            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse(ex.getMessage()));
        }
    }
}