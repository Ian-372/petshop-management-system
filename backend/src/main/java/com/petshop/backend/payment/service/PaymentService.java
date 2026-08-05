package com.petshop.backend.payment.service;

import com.petshop.backend.payment.dto.CallbackRequest;
import com.petshop.backend.payment.dto.StkPushRequest;

public interface PaymentService {

    String initiateStkPush(StkPushRequest request);

    void handleCallback(CallbackRequest request);
    void completeCashPayment(Long saleId);

}
