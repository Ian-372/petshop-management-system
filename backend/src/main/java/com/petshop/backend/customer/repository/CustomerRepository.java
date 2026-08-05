package com.petshop.backend.customer.repository;

import com.petshop.backend.customer.entity.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface CustomerRepository extends JpaRepository<Customer, Long> {

    Optional<Customer> findByPhone(String phone);

    Optional<Customer> findByEmail(String email);

    long countByLoyaltyPointsGreaterThan(Integer points);

    @Query("""
            SELECT COALESCE(SUM(c.loyaltyPoints), 0)
            FROM Customer c
            """)
    Long getTotalLoyaltyPoints();

}