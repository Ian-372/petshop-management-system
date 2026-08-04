package com.petshop.backend.loyalty.service;

import com.petshop.backend.customer.entity.Customer;
import com.petshop.backend.customer.repository.CustomerRepository;
import com.petshop.backend.loyalty.dto.LoyaltyResponse;
import com.petshop.backend.loyalty.util.LoyaltyPointCalculator;
import com.petshop.backend.sale.entity.Sale;
import com.petshop.backend.sale.repository.SaleRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class LoyaltyServiceImpl implements LoyaltyService {

    private final CustomerRepository customerRepository;
    private final SaleRepository saleRepository;
    private final LoyaltyPointCalculator loyaltyPointCalculator;

    public LoyaltyServiceImpl(
            CustomerRepository customerRepository,
            SaleRepository saleRepository,
            LoyaltyPointCalculator loyaltyPointCalculator) {

        this.customerRepository = customerRepository;
        this.saleRepository = saleRepository;
        this.loyaltyPointCalculator = loyaltyPointCalculator;
    }

    @Override
    @Transactional(readOnly = true)
    public LoyaltyResponse getCustomerLoyalty(Long customerId) {

        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new RuntimeException("Customer not found."));

        return new LoyaltyResponse(
                customer.getId(),
                customer.getName(),
                customer.getLoyaltyPoints(),
                customer.getTotalSpent()
        );
    }

    @Override
    @Transactional
    public LoyaltyResponse awardPoints(Long saleId) {

        Sale sale = saleRepository.findById(saleId)
                .orElseThrow(() -> new RuntimeException("Sale not found."));

        Customer customer = sale.getCustomer();

        if (customer == null) {
            throw new RuntimeException("Sale has no customer.");
        }

        int earnedPoints =
                loyaltyPointCalculator.calculatePoints(
                        sale.getTotal());

        customer.setLoyaltyPoints(
                customer.getLoyaltyPoints() + earnedPoints);

        customer.setTotalSpent(
                customer.getTotalSpent() + sale.getTotal());

        customerRepository.save(customer);

        return new LoyaltyResponse(
                customer.getId(),
                customer.getName(),
                customer.getLoyaltyPoints(),
                customer.getTotalSpent()
        );
    }

    @Override
    @Transactional
    public LoyaltyResponse redeemPoints(
            Long customerId,
            Integer points) {

        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new RuntimeException("Customer not found."));

        if (customer.getLoyaltyPoints() < points) {
            throw new RuntimeException("Not enough loyalty points.");
        }

        customer.setLoyaltyPoints(
                customer.getLoyaltyPoints() - points);

        customerRepository.save(customer);

        return new LoyaltyResponse(
                customer.getId(),
                customer.getName(),
                customer.getLoyaltyPoints(),
                customer.getTotalSpent()
        );
    }
}