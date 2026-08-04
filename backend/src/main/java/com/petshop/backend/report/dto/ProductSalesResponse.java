package com.petshop.backend.report.dto;

public class ProductSalesResponse {

    private Long productId;

    private String productName;

    private Long quantitySold;

    private Double revenueGenerated;

    public ProductSalesResponse() {
    }

    public ProductSalesResponse(
            Long productId,
            String productName,
            Long quantitySold,
            Double revenueGenerated) {

        this.productId = productId;
        this.productName = productName;
        this.quantitySold = quantitySold;
        this.revenueGenerated = revenueGenerated;
    }

    public Long getProductId() {
        return productId;
    }

    public void setProductId(Long productId) {
        this.productId = productId;
    }

    public String getProductName() {
        return productName;
    }

    public void setProductName(String productName) {
        this.productName = productName;
    }

    public Long getQuantitySold() {
        return quantitySold;
    }

    public void setQuantitySold(Long quantitySold) {
        this.quantitySold = quantitySold;
    }

    public Double getRevenueGenerated() {
        return revenueGenerated;
    }

    public void setRevenueGenerated(Double revenueGenerated) {
        this.revenueGenerated = revenueGenerated;
    }
}