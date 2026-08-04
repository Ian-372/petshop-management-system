package com.petshop.backend.report.service;

import com.petshop.backend.report.dto.DailySalesResponse;
import com.petshop.backend.report.dto.ProductSalesResponse;
import com.petshop.backend.report.dto.SalesSummaryResponse;

import java.util.List;

public interface ReportService {

    SalesSummaryResponse getSalesSummary();

    List<DailySalesResponse> getDailySales();

    List<ProductSalesResponse> getTopSellingProducts();
}