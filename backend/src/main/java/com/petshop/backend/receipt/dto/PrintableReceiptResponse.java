package com.petshop.backend.receipt.dto;

public class PrintableReceiptResponse {

    private ReceiptResponse receipt;

    private String printableContent;

    public PrintableReceiptResponse() {
    }

    public ReceiptResponse getReceipt() {
        return receipt;
    }

    public void setReceipt(ReceiptResponse receipt) {
        this.receipt = receipt;
    }

    public String getPrintableContent() {
        return printableContent;
    }

    public void setPrintableContent(String printableContent) {
        this.printableContent = printableContent;
    }
}