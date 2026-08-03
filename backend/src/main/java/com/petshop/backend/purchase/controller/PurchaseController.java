package com.petshop.backend.purchase.controller;

import com.petshop.backend.purchase.dto.PurchaseRequest;
import com.petshop.backend.purchase.dto.PurchaseResponse;
import com.petshop.backend.purchase.service.PurchaseService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/purchases")
public class PurchaseController {

    private final PurchaseService purchaseService;

    public PurchaseController(PurchaseService purchaseService) {
        this.purchaseService = purchaseService;
    }

    @PostMapping
    public PurchaseResponse createPurchase(@RequestBody PurchaseRequest request) {
        return purchaseService.createPurchase(request);
    }

    @GetMapping
    public List<PurchaseResponse> getAllPurchases() {
        return purchaseService.getAllPurchases();
    }

    @GetMapping("/{id}")
    public PurchaseResponse getPurchaseById(@PathVariable Long id) {
        return purchaseService.getPurchaseById(id);
    }
}