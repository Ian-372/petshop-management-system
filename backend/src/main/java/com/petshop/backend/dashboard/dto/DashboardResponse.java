package com.petshop.backend.dashboard.dto;

public class DashboardResponse {

    // =========================
    // COUNTS
    // =========================
    private long totalProducts;
    private long totalCustomers;
    private long totalSuppliers;
    private long totalSales;
    private long totalPurchases;

    // =========================
    // MONEY
    // =========================
    private double salesRevenue;
    private double purchaseCost;
    private double profit;

    // =========================
    // INVENTORY
    // =========================
    private long lowStockProducts;
    private long outOfStockProducts;

    // =========================
    // LOYALTY
    // =========================
    private long loyaltyCustomers;
    private long totalLoyaltyPoints;

    public DashboardResponse() {
    }

    // =========================
    // COUNTS
    // =========================

    public long getTotalProducts() {
        return totalProducts;
    }

    public void setTotalProducts(long totalProducts) {
        this.totalProducts = totalProducts;
    }

    public long getTotalCustomers() {
        return totalCustomers;
    }

    public void setTotalCustomers(long totalCustomers) {
        this.totalCustomers = totalCustomers;
    }

    public long getTotalSuppliers() {
        return totalSuppliers;
    }

    public void setTotalSuppliers(long totalSuppliers) {
        this.totalSuppliers = totalSuppliers;
    }

    public long getTotalSales() {
        return totalSales;
    }

    public void setTotalSales(long totalSales) {
        this.totalSales = totalSales;
    }

    public long getTotalPurchases() {
        return totalPurchases;
    }

    public void setTotalPurchases(long totalPurchases) {
        this.totalPurchases = totalPurchases;
    }

    // =========================
    // MONEY
    // =========================

    public double getSalesRevenue() {
        return salesRevenue;
    }

    public void setSalesRevenue(double salesRevenue) {
        this.salesRevenue = salesRevenue;
    }

    public double getPurchaseCost() {
        return purchaseCost;
    }

    public void setPurchaseCost(double purchaseCost) {
        this.purchaseCost = purchaseCost;
    }

    public double getProfit() {
        return profit;
    }

    public void setProfit(double profit) {
        this.profit = profit;
    }

    // =========================
    // INVENTORY
    // =========================

    public long getLowStockProducts() {
        return lowStockProducts;
    }

    public void setLowStockProducts(long lowStockProducts) {
        this.lowStockProducts = lowStockProducts;
    }

    public long getOutOfStockProducts() {
        return outOfStockProducts;
    }

    public void setOutOfStockProducts(long outOfStockProducts) {
        this.outOfStockProducts = outOfStockProducts;
    }

    // =========================
    // LOYALTY
    // =========================

    public long getLoyaltyCustomers() {
        return loyaltyCustomers;
    }

    public void setLoyaltyCustomers(long loyaltyCustomers) {
        this.loyaltyCustomers = loyaltyCustomers;
    }

    public long getTotalLoyaltyPoints() {
        return totalLoyaltyPoints;
    }

    public void setTotalLoyaltyPoints(long totalLoyaltyPoints) {
        this.totalLoyaltyPoints = totalLoyaltyPoints;
    }
}