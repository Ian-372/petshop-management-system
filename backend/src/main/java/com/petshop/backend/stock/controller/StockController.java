package com.petshop.backend.stock.controller;

import com.petshop.backend.stock.dto.StockResponse;
import com.petshop.backend.stock.service.StockService;
import org.springframework.web.bind.annotation.*;
import com.petshop.backend.stock.dto.StockAdjustmentRequest;

import java.util.List;

@RestController
@RequestMapping("/api/stock")
@CrossOrigin(origins = "*")
public class StockController {

    private final StockService stockService;

    public StockController(StockService stockService) {
        this.stockService = stockService;
    }

    @GetMapping
    public List<StockResponse> getAllStock() {
        return stockService.getAllStock();
    }

    @GetMapping("/low")
    public List<StockResponse> getLowStockProducts() {
        return stockService.getLowStockProducts();
    }
    @PostMapping("/adjust")
public StockResponse adjustStock(

        @RequestBody StockAdjustmentRequest request

) {

    return stockService.adjustStock(request);

}

}
