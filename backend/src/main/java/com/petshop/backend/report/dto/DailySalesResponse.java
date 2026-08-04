package com.petshop.backend.report.dto;

import java.time.LocalDate;

public class DailySalesResponse {

    private LocalDate date;

    private Long numberOfSales;

    private Double revenue;

    public DailySalesResponse() {
    }

    public DailySalesResponse(
            LocalDate date,
            Long numberOfSales,
            Double revenue) {

        this.date = date;
        this.numberOfSales = numberOfSales;
        this.revenue = revenue;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public Long getNumberOfSales() {
        return numberOfSales;
    }

    public void setNumberOfSales(Long numberOfSales) {
        this.numberOfSales = numberOfSales;
    }

    public Double getRevenue() {
        return revenue;
    }

    public void setRevenue(Double revenue) {
        this.revenue = revenue;
    }
}