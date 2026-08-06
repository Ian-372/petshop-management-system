package com.petshop.backend.receipt.dto;

import java.time.LocalDateTime;
import java.util.List;

public class ReceiptResponse {

    private String receiptNumber;
    private Long saleId;

    private LocalDateTime saleDate;

    private String customerName;

    private String paymentMethod;
    private String paymentStatus;
    private String phoneNumber;
    private String mpesaReceipt;

    private Double total;
    private String qrCode;

    private List<ReceiptItemResponse> items;

    public ReceiptResponse() {
    }

    public String getReceiptNumber() {
        return receiptNumber;
    }

    public void setReceiptNumber(String receiptNumber) {
        this.receiptNumber = receiptNumber;
    }

    public Long getSaleId() {
        return saleId;
    }

    public void setSaleId(Long saleId) {
        this.saleId = saleId;
    }

    public LocalDateTime getSaleDate() {
        return saleDate;
    }

    public void setSaleDate(LocalDateTime saleDate) {
        this.saleDate = saleDate;
    }

    public String getCustomerName() {
        return customerName;
    }

    public void setCustomerName(String customerName) {
        this.customerName = customerName;
    }

    public String getPaymentMethod() {
        return paymentMethod;
    }

    public void setPaymentMethod(String paymentMethod) {
        this.paymentMethod = paymentMethod;
    }

    public String getPaymentStatus() {
        return paymentStatus;
    }

    public void setPaymentStatus(String paymentStatus) {
        this.paymentStatus = paymentStatus;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public String getMpesaReceipt() {
        return mpesaReceipt;
    }

    public void setMpesaReceipt(String mpesaReceipt) {
        this.mpesaReceipt = mpesaReceipt;
    }

    public Double getTotal() {
        return total;
    }

    public void setTotal(Double total) {
        this.total = total;
    }

    public String getQrCode() {
        return qrCode;
    }

    public void setQrCode(String qrCode) {
        this.qrCode = qrCode;
    }

    public List<ReceiptItemResponse> getItems() {
        return items;
    }

    public void setItems(List<ReceiptItemResponse> items) {
        this.items = items;
    }
}