package com.petshop.backend.report.controller;

import com.petshop.backend.report.dto.DailySalesResponse;
import com.petshop.backend.report.dto.ProductSalesResponse;
import com.petshop.backend.report.dto.SalesSummaryResponse;
import com.petshop.backend.report.dto.SalesTransactionResponse;
import com.petshop.backend.report.service.ReportService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/reports")
public class ReportController {

    private final ReportService reportService;

    public ReportController(ReportService reportService) {
        this.reportService = reportService;
    }

    @GetMapping("/summary")
    public SalesSummaryResponse getSalesSummary() {
        return reportService.getSalesSummary();
    }

    @GetMapping("/daily")
    public List<DailySalesResponse> getDailySales() {
        return reportService.getDailySales();
    }

    @GetMapping("/products")
    public List<ProductSalesResponse> getTopSellingProducts() {
        return reportService.getTopSellingProducts();
    }

    @GetMapping("/transactions")
    public List<SalesTransactionResponse> getSalesTransactions() {
        return reportService.getSalesTransactions();
    }
}
