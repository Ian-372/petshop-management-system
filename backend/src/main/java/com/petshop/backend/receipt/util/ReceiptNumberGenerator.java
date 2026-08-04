package com.petshop.backend.receipt.util;

import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

@Component
public class ReceiptNumberGenerator {

    public String generateReceiptNumber(Long saleId) {

        String date = LocalDate.now()
                .format(DateTimeFormatter.ofPattern("yyyyMMdd"));

        return String.format("RCPT-%s-%06d", date, saleId);
    }
}
