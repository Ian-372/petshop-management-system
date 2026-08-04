package com.petshop.backend.loyalty.service;

import com.petshop.backend.loyalty.dto.LoyaltyResponse;

public interface LoyaltyService {

    LoyaltyResponse getCustomerLoyalty(Long customerId);

    LoyaltyResponse awardPoints(Long saleId);

    LoyaltyResponse redeemPoints(
            Long customerId,
            Integer points);
}
