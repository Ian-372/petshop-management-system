package com.petshop.backend.stock.service;

import com.petshop.backend.stock.dto.StockResponse;

import java.util.List;

public interface StockService {

    List<StockResponse> getAllStock();

    List<StockResponse> getLowStockProducts();

}