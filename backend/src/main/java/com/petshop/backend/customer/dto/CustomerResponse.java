package com.petshop.backend.customer.dto;

public class CustomerResponse {

    private Long id;
    private String name;
    private String phone;
    private String email;
    private String address;

    // =========================
    // LOYALTY
    // =========================
    private Double totalSpent;
    private Double totalDebt;
    private Integer loyaltyPoints;

    // =========================
    // RESPONSE MESSAGE
    // =========================
    private String message;

    public CustomerResponse() {
    }

    // =========================
    // BASIC DETAILS
    // =========================

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    // =========================
    // LOYALTY
    // =========================

    public Double getTotalSpent() {
        return totalSpent;
    }

    public void setTotalSpent(Double totalSpent) {
        this.totalSpent = totalSpent;
    }

    public Double getTotalDebt() {
        return totalDebt;
    }

    public void setTotalDebt(Double totalDebt) {
        this.totalDebt = totalDebt;
    }

    public Integer getLoyaltyPoints() {
        return loyaltyPoints;
    }

    public void setLoyaltyPoints(Integer loyaltyPoints) {
        this.loyaltyPoints = loyaltyPoints;
    }

    // =========================
    // MESSAGE
    // =========================

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}