package com.petshop.backend.loyalty.dto;

public class LoyaltyResponse {

    private Long customerId;

    private String customerName;

    private Integer loyaltyPoints;

    private Double totalSpent;

    public LoyaltyResponse() {
    }

    public LoyaltyResponse(
            Long customerId,
            String customerName,
            Integer loyaltyPoints,
            Double totalSpent) {

        this.customerId = customerId;
        this.customerName = customerName;
        this.loyaltyPoints = loyaltyPoints;
        this.totalSpent = totalSpent;
    }

    public Long getCustomerId() {
        return customerId;
    }

    public void setCustomerId(Long customerId) {
        this.customerId = customerId;
    }

    public String getCustomerName() {
        return customerName;
    }

    public void setCustomerName(String customerName) {
        this.customerName = customerName;
    }

    public Integer getLoyaltyPoints() {
        return loyaltyPoints;
    }

    public void setLoyaltyPoints(Integer loyaltyPoints) {
        this.loyaltyPoints = loyaltyPoints;
    }

    public Double getTotalSpent() {
        return totalSpent;
    }

    public void setTotalSpent(Double totalSpent) {
        this.totalSpent = totalSpent;
    }
}
