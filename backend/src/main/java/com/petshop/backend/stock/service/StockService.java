package com.petshop.backend.stock.service;

import com.petshop.backend.stock.dto.StockAdjustmentRequest;
import com.petshop.backend.stock.dto.StockResponse;
import com.petshop.backend.stock.dto.StockAdjustmentResponse;

import java.util.List;

public interface StockService {

    List<StockResponse> getAllStock();

    List<StockResponse> getLowStockProducts();

    StockResponse adjustStock(StockAdjustmentRequest request);

    List<StockAdjustmentResponse> getRecentAdjustments();

}
