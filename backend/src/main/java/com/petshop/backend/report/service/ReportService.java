package com.petshop.backend.report.service;

import com.petshop.backend.report.dto.DailySalesResponse;
import com.petshop.backend.report.dto.ProductSalesResponse;
import com.petshop.backend.report.dto.SalesSummaryResponse;
import com.petshop.backend.report.dto.SalesTransactionResponse;

import java.util.List;

public interface ReportService {

    SalesSummaryResponse getSalesSummary();

    List<DailySalesResponse> getDailySales();

    List<ProductSalesResponse> getTopSellingProducts();

    List<SalesTransactionResponse> getSalesTransactions(int limit);
}
