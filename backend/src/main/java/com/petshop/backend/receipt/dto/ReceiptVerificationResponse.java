package com.petshop.backend.receipt.dto;

public class ReceiptVerificationResponse {

    private boolean valid;
    private String message;
    private ReceiptResponse receipt;

    public ReceiptVerificationResponse() {
    }

    public boolean isValid() {
        return valid;
    }

    public void setValid(boolean valid) {
        this.valid = valid;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public ReceiptResponse getReceipt() {
        return receipt;
    }

    public void setReceipt(ReceiptResponse receipt) {
        this.receipt = receipt;
    }
}