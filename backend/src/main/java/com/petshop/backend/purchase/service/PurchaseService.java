package com.petshop.backend.purchase.service;

import com.petshop.backend.purchase.dto.PurchaseRequest;
import com.petshop.backend.purchase.dto.PurchaseResponse;

import java.util.List;

public interface PurchaseService {

    PurchaseResponse createPurchase(PurchaseRequest request);

    PurchaseResponse getPurchaseById(Long id);

    List<PurchaseResponse> getAllPurchases();

}