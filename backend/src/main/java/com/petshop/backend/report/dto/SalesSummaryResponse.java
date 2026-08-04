package com.petshop.backend.report.dto;

public class SalesSummaryResponse {

    private Long totalSales;

    private Double totalRevenue;

    private Long totalItemsSold;

    private Double averageSale;

    public SalesSummaryResponse() {
    }

    public Long getTotalSales() {
        return totalSales;
    }

    public void setTotalSales(Long totalSales) {
        this.totalSales = totalSales;
    }

    public Double getTotalRevenue() {
        return totalRevenue;
    }

    public void setTotalRevenue(Double totalRevenue) {
        this.totalRevenue = totalRevenue;
    }

    public Long getTotalItemsSold() {
        return totalItemsSold;
    }

    public void setTotalItemsSold(Long totalItemsSold) {
        this.totalItemsSold = totalItemsSold;
    }

    public Double getAverageSale() {
        return averageSale;
    }

    public void setAverageSale(Double averageSale) {
        this.averageSale = averageSale;
    }
}
