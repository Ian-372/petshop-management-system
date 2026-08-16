package com.petshop.backend.settings.dto;

public class UpdateSettingsRequest {

    // Business Profile
    private String businessName;
    private String phone;
    private String email;
    private String address;

    // Receipt Settings
    private String currency;
    private Double taxPercentage;
    private String receiptFooter;
    private Boolean autoPrintReceipt;

    // System Preferences
    private Boolean lowStockAlerts;
    private Boolean deleteConfirmation;
    private Boolean salesNotifications;
    private Boolean debtAlerts;

    public UpdateSettingsRequest() {
    }

    public String getBusinessName() {
        return businessName;
    }

    public void setBusinessName(String businessName) {
        this.businessName = businessName;
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

    public String getCurrency() {
        return currency;
    }

    public void setCurrency(String currency) {
        this.currency = currency;
    }

    public Double getTaxPercentage() {
        return taxPercentage;
    }

    public void setTaxPercentage(Double taxPercentage) {
        this.taxPercentage = taxPercentage;
    }

    public String getReceiptFooter() {
        return receiptFooter;
    }

    public void setReceiptFooter(String receiptFooter) {
        this.receiptFooter = receiptFooter;
    }

    public Boolean getAutoPrintReceipt() {
        return autoPrintReceipt;
    }

    public void setAutoPrintReceipt(Boolean autoPrintReceipt) {
        this.autoPrintReceipt = autoPrintReceipt;
    }

    public Boolean getLowStockAlerts() {
        return lowStockAlerts;
    }

    public void setLowStockAlerts(Boolean lowStockAlerts) {
        this.lowStockAlerts = lowStockAlerts;
    }

    public Boolean getDeleteConfirmation() {
        return deleteConfirmation;
    }

    public void setDeleteConfirmation(Boolean deleteConfirmation) {
        this.deleteConfirmation = deleteConfirmation;
    }

    public Boolean getSalesNotifications() {
        return salesNotifications;
    }

    public void setSalesNotifications(Boolean salesNotifications) {
        this.salesNotifications = salesNotifications;
    }

    public Boolean getDebtAlerts() { return debtAlerts; }

    public void setDebtAlerts(Boolean debtAlerts) { this.debtAlerts = debtAlerts; }

}
