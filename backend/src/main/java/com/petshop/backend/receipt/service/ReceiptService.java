package com.petshop.backend.receipt.service;

import com.petshop.backend.receipt.dto.PrintableReceiptResponse;
import com.petshop.backend.receipt.dto.ReceiptResponse;
import com.petshop.backend.receipt.dto.ReceiptVerificationResponse;

public interface ReceiptService {

    ReceiptResponse getReceipt(Long saleId);

    PrintableReceiptResponse getPrintableReceipt(Long saleId);

    ReceiptVerificationResponse verifyReceipt(String receiptNumber);

}
