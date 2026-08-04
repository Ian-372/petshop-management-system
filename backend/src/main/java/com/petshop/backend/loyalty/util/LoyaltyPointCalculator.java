package com.petshop.backend.loyalty.util;

import org.springframework.stereotype.Component;

@Component
public class LoyaltyPointCalculator {

    public int calculatePoints(Double amount) {

        if (amount == null) {
            return 0;
        }

        return (int) (amount / 100);
    }
}