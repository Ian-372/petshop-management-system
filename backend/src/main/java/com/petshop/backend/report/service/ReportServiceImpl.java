package com.petshop.backend.report.service;

import com.petshop.backend.report.dto.DailySalesResponse;
import com.petshop.backend.report.dto.ProductSalesResponse;
import com.petshop.backend.report.dto.SalesSummaryResponse;
import com.petshop.backend.report.repository.ReportRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ReportServiceImpl implements ReportService {

    private final ReportRepository reportRepository;

    public ReportServiceImpl(ReportRepository reportRepository) {
        this.reportRepository = reportRepository;
    }

    @Override
    public SalesSummaryResponse getSalesSummary() {

        SalesSummaryResponse response = new SalesSummaryResponse();

        response.setTotalSales(reportRepository.countTotalSales());
        response.setTotalRevenue(reportRepository.getTotalRevenue());
        response.setTotalItemsSold(reportRepository.getTotalItemsSold());
        response.setAverageSale(reportRepository.getAverageSale());

        return response;
    }

    @Override
    public List<DailySalesResponse> getDailySales() {
        return reportRepository.getDailySales();
    }

    @Override
    public List<ProductSalesResponse> getTopSellingProducts() {
        return reportRepository.getTopSellingProducts();
    }
}