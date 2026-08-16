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
        boolean isRegisteredCustomer = sale.getCustomer() != null;
        String customerName = isRegisteredCustomer ? sale.getCustomer().getName() : "Walk-In";
        String customerType = isRegisteredCustomer ? "Registered" : "Walk-in";
        return new SalesTransactionResponse(
                sale.getId(), isRegisteredCustomer ? sale.getCustomer().getId() : null,
                customerName, customerType, sale.getPhoneNumber(), sale.getSaleDate(),
                sale.getTotal(), sale.getBalance(), sale.getOutstandingDebt(), sale.getPaymentMethod(), sale.getPaymentStatus(),
                sale.getSaleItems().stream()
                        .map(item -> new SalesTransactionItemResponse(
                                item.getProduct().getId(), item.getProduct().getName(), item.getQuantity(),
                                item.getUnitPrice(), item.getProduct().getBuyingPrice(),
                                item.getSubtotal()))
                        .toList());
    }
}
