package com.petshop.backend.payment.service;

import com.petshop.backend.payment.dto.CallbackRequest;
import com.petshop.backend.payment.dto.StkPushRequest;
import com.petshop.backend.payment.util.MpesaUtil;
import com.petshop.backend.sale.entity.Sale;
import com.petshop.backend.sale.repository.SaleRepository;
import org.springframework.stereotype.Service;
import com.petshop.backend.product.entity.Product;
import com.petshop.backend.product.repository.ProductRepository;
import com.petshop.backend.sale.entity.SaleItem;
import com.petshop.backend.sale.repository.SaleItemRepository;
import java.util.List;

@Service
public class PaymentServiceImpl implements PaymentService {

        private final SaleRepository saleRepository;
        private final SaleItemRepository saleItemRepository;
        private final ProductRepository productRepository;
        private final MpesaUtil mpesaUtil;

        public PaymentServiceImpl(
                        SaleRepository saleRepository,
                        SaleItemRepository saleItemRepository,
                        ProductRepository productRepository,
                        MpesaUtil mpesaUtil) {

                this.saleRepository = saleRepository;
                this.saleItemRepository = saleItemRepository;
                this.productRepository = productRepository;
                this.mpesaUtil = mpesaUtil;
        }
        @Override
public String initiateStkPush(StkPushRequest request) {

    Sale sale = saleRepository.findById(request.getSaleId())
            .orElseThrow(() -> new RuntimeException("Sale not found."));

    sale.setPhoneNumber(request.getPhoneNumber());
    sale.setPaymentMethod("MPESA");
    sale.setPaymentStatus("PENDING");

    saleRepository.save(sale);

    String checkoutRequestId = mpesaUtil.sendStkPush(
            sale.getId(),
            request.getPhoneNumber(),
            sale.getTotal());

    sale.setCheckoutRequestId(checkoutRequestId);

    saleRepository.save(sale);

    return checkoutRequestId;
}

        @Override
        public void handleCallback(CallbackRequest request) {

                CallbackRequest.StkCallback callback = request.getBody().getStkCallback();

                Sale sale = saleRepository
                                .findByCheckoutRequestId(callback.getCheckoutRequestID())
                                .orElseThrow(() -> new RuntimeException("Sale not found."));

                sale.setCheckoutRequestId(callback.getCheckoutRequestID());

                if (callback.getResultCode() == 0) {

                        sale.setPaymentStatus("COMPLETED");

                        if (callback.getCallbackMetadata() != null) {

                                callback.getCallbackMetadata().getItem().forEach(item -> {

                                        switch (item.getName()) {

                                                case "MpesaReceiptNumber":
                                                        sale.setMpesaReceipt(item.getValue().toString());
                                                        break;

                                                case "PhoneNumber":
                                                        sale.setPhoneNumber(item.getValue().toString());
                                                        break;
                                        }

                                });

                        }
                        List<SaleItem> saleItems = saleItemRepository.findBySale(sale);

                        for (SaleItem saleItem : saleItems) {

                                Product product = saleItem.getProduct();

                                if (product.getQuantity() < saleItem.getQuantity()) {
                                        throw new RuntimeException(
                                                        "Insufficient stock for " + product.getName());
                                }

                                product.setQuantity(
                                                product.getQuantity() - saleItem.getQuantity());

                                productRepository.save(product);
                        }
                } else {

                        sale.setPaymentStatus("FAILED");

                }

                saleRepository.save(sale);

                System.out.println("Payment updated successfully.");

        }
}