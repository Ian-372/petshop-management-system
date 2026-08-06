package com.petshop.backend.sale.service;

import com.petshop.backend.sale.dto.SaleRequest;
import com.petshop.backend.sale.dto.SaleResponse;

import java.util.List;

public interface SaleService {

    SaleResponse createSale(SaleRequest request);

    List<SaleResponse> getAllSales();

    SaleResponse getSaleById(Long id);
    void cancelPendingSale(Long saleId);
}