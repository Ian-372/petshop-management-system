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
import com.petshop.backend.sale.service.SaleService;

@Service
public class PaymentServiceImpl implements PaymentService {

        private final SaleRepository saleRepository;
        private final SaleItemRepository saleItemRepository;
        private final ProductRepository productRepository;
        private final MpesaUtil mpesaUtil;
        private final SaleService saleService;

        public PaymentServiceImpl(
                        SaleRepository saleRepository,
                        SaleItemRepository saleItemRepository,
                        ProductRepository productRepository,
                        MpesaUtil mpesaUtil,
                        SaleService saleService) {

                this.saleRepository = saleRepository;
                this.saleItemRepository = saleItemRepository;
                this.productRepository = productRepository;
                this.mpesaUtil = mpesaUtil;
                this.saleService = saleService;
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

                        sale.setPaymentStatus("PAID");

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

                } else {

                        sale.setPaymentStatus("FAILED");

                }

                saleRepository.save(sale);

                System.out.println("Payment updated successfully.");

        }

        @Override
        public void completeCashPayment(Long saleId) {

                Sale sale = saleRepository.findById(saleId)
                                .orElseThrow(() -> new RuntimeException("Sale not found."));

                sale.setPaymentMethod("CASH");
                sale.setPaymentStatus("PAID");

                saleRepository.save(sale);
        }

        @Override
        public void cancelPendingSale(Long saleId) {

                saleService.cancelPendingSale(saleId);

        }
}