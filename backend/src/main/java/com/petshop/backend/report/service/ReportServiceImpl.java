package com.petshop.backend.report.service;

import com.petshop.backend.report.dto.DailySalesResponse;
import com.petshop.backend.report.dto.ProductSalesResponse;
import com.petshop.backend.report.dto.SalesSummaryResponse;
import com.petshop.backend.report.dto.SalesTransactionItemResponse;
import com.petshop.backend.report.dto.SalesTransactionResponse;
import com.petshop.backend.sale.entity.Sale;
import org.springframework.transaction.annotation.Transactional;
import com.petshop.backend.report.repository.ReportRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ReportServiceImpl implements ReportService {

    private final ReportRepository reportRepository;

    public ReportServiceImpl(
            ReportRepository reportRepository) {

        this.reportRepository = reportRepository;
    }

    @Override
    public SalesSummaryResponse getSalesSummary() {

        SalesSummaryResponse response = new SalesSummaryResponse();

        response.setTotalSales(
                reportRepository.countTotalSales());

        response.setTotalRevenue(
                reportRepository.getTotalRevenue());

        response.setTotalItemsSold(
                reportRepository.getTotalItemsSold());

        response.setAverageSale(
                reportRepository.getAverageSale());

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

    @Override
    @Transactional(readOnly = true)
    public List<SalesTransactionResponse> getSalesTransactions() {
        return reportRepository.findAllByOrderBySaleDateDesc().stream()
                .map(this::toTransactionResponse)
                .toList();
    }

    private SalesTransactionResponse toTransactionResponse(Sale sale) {
        String customerName = sale.getCustomer() == null ? "Walk-In" : sale.getCustomer().getName();
        return new SalesTransactionResponse(
                sale.getId(), customerName, sale.getPhoneNumber(), sale.getSaleDate(),
                sale.getTotal(), sale.getBalance(), sale.getPaymentMethod(), sale.getPaymentStatus(),
                sale.getSaleItems().stream()
                        .map(item -> new SalesTransactionItemResponse(
                                item.getProduct().getName(), item.getQuantity(),
                                item.getUnitPrice(), item.getProduct().getBuyingPrice(),
                                item.getSubtotal()))
                        .toList());
    }
}
