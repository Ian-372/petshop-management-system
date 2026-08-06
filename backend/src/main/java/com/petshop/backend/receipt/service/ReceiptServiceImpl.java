package com.petshop.backend.receipt.service;

import com.petshop.backend.receipt.dto.PrintableReceiptResponse;
import com.petshop.backend.receipt.dto.ReceiptItemResponse;
import com.petshop.backend.receipt.dto.ReceiptResponse;
import com.petshop.backend.sale.entity.Sale;
import com.petshop.backend.sale.entity.SaleItem;
import com.petshop.backend.sale.repository.SaleItemRepository;
import com.petshop.backend.sale.repository.SaleRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.petshop.backend.receipt.util.ReceiptNumberGenerator;
import java.util.ArrayList;
import java.util.List;
import com.petshop.backend.receipt.util.QrCodeGenerator;
import java.util.Base64;
import com.petshop.backend.receipt.dto.ReceiptVerificationResponse;

@Service
public class ReceiptServiceImpl implements ReceiptService {

    private final SaleRepository saleRepository;
    private final SaleItemRepository saleItemRepository;
    private final ReceiptNumberGenerator receiptNumberGenerator;
    private final QrCodeGenerator qrCodeGenerator;

    public ReceiptServiceImpl(
            SaleRepository saleRepository,
            SaleItemRepository saleItemRepository,
            ReceiptNumberGenerator receiptNumberGenerator,
            QrCodeGenerator qrCodeGenerator) {

        this.saleRepository = saleRepository;
        this.saleItemRepository = saleItemRepository;
        this.receiptNumberGenerator = receiptNumberGenerator;
        this.qrCodeGenerator = qrCodeGenerator;
    }

    @Override
    @Transactional(readOnly = true)
    public ReceiptResponse getReceipt(Long saleId) {

        Sale sale = saleRepository.findById(saleId)
                .orElseThrow(() -> new RuntimeException("Sale not found."));

        List<SaleItem> saleItems = saleItemRepository.findBySale(sale);

        ReceiptResponse response = new ReceiptResponse();

        response.setSaleId(sale.getId());
        String receiptNumber = receiptNumberGenerator.generateReceiptNumber(sale.getId());

        System.out.println("Receipt Number = " + receiptNumber);

        response.setReceiptNumber(receiptNumber);

       String verificationUrl =
    "https://huddle-agonizing-dynamic.ngrok-free.dev/api/receipts/verify/" + receiptNumber;

        byte[] qrBytes = qrCodeGenerator.generateQrCode(verificationUrl);

        String qrBase64 = Base64.getEncoder().encodeToString(qrBytes);

        response.setQrCode(qrBase64);

        response.setSaleDate(sale.getSaleDate());
        response.setCustomerName(
                sale.getCustomer() != null
                        ? sale.getCustomer().getName()
                        : "Walk In Customer");

        response.setPaymentMethod(sale.getPaymentMethod());
        response.setPaymentStatus(sale.getPaymentStatus());
        response.setPhoneNumber(sale.getPhoneNumber());
        response.setMpesaReceipt(sale.getMpesaReceipt());
        response.setTotal(sale.getTotal());

        List<ReceiptItemResponse> items = new ArrayList<>();

        for (SaleItem saleItem : saleItems) {

            ReceiptItemResponse item = new ReceiptItemResponse();

            item.setProductName(saleItem.getProduct().getName());
            item.setQuantity(saleItem.getQuantity());
            item.setUnitPrice(saleItem.getUnitPrice());
            item.setSubtotal(saleItem.getSubtotal());

            items.add(item);
        }

        response.setItems(items);

        return response;
    }

    @Override
    public PrintableReceiptResponse getPrintableReceipt(Long saleId) {

        ReceiptResponse receipt = getReceipt(saleId);

        PrintableReceiptResponse printable = new PrintableReceiptResponse();

        printable.setReceipt(receipt);

        return printable;
    }

    @Override
    @Transactional(readOnly = true)
    public ReceiptVerificationResponse verifyReceipt(String receiptNumber) {

        ReceiptVerificationResponse response = new ReceiptVerificationResponse();

        try {

            String[] parts = receiptNumber.split("-");

            if (parts.length != 3) {

                response.setValid(false);
                response.setMessage("Invalid receipt format.");

                return response;
            }

            Long saleId = Long.parseLong(parts[2]);

            Sale sale = saleRepository.findById(saleId)
                    .orElse(null);

            if (sale == null) {

                response.setValid(false);
                response.setMessage("Receipt not found.");

                return response;
            }

            String generatedReceiptNumber = receiptNumberGenerator.generateReceiptNumber(sale.getId());

            if (!generatedReceiptNumber.equals(receiptNumber)) {

                response.setValid(false);
                response.setMessage("Receipt verification failed.");

                return response;
            }

            response.setValid(true);
            response.setMessage("Receipt verified successfully.");
            response.setReceipt(getReceipt(saleId));

            return response;

        }

        catch (Exception e) {

            response.setValid(false);
            response.setMessage("Invalid receipt.");

            return response;
        }

    }

}