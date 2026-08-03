package com.petshop.backend.payment.service;

import com.petshop.backend.payment.dto.CallbackRequest;
import com.petshop.backend.payment.dto.StkPushRequest;
import com.petshop.backend.payment.util.MpesaUtil;
import com.petshop.backend.sale.entity.Sale;
import com.petshop.backend.sale.repository.SaleRepository;
import org.springframework.stereotype.Service;

@Service
public class PaymentServiceImpl implements PaymentService {

    private final SaleRepository saleRepository;
    private final MpesaUtil mpesaUtil;

    public PaymentServiceImpl(
            SaleRepository saleRepository,
            MpesaUtil mpesaUtil) {
        this.saleRepository = saleRepository;
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

        return mpesaUtil.sendStkPush(
                sale.getId(),
                request.getPhoneNumber(),
                sale.getTotal());
    }

   @Override
public void handleCallback(CallbackRequest request) {

    CallbackRequest.StkCallback callback =
            request.getBody().getStkCallback();

    System.out.println("========== MPESA CALLBACK ==========");

    System.out.println("MerchantRequestID : "
            + callback.getMerchantRequestID());

    System.out.println("CheckoutRequestID : "
            + callback.getCheckoutRequestID());

    System.out.println("ResultCode : "
            + callback.getResultCode());

    System.out.println("ResultDesc : "
            + callback.getResultDesc());

    if (callback.getCallbackMetadata() != null) {

        callback.getCallbackMetadata()
                .getItem()
                .forEach(item ->

                        System.out.println(
                                item.getName()
                                        + " = "
                                        + item.getValue()
                        )

                );

    }

    System.out.println("====================================");

}
}