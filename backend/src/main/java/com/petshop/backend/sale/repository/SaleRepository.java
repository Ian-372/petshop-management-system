package com.petshop.backend.sale.repository;

import com.petshop.backend.sale.entity.Sale;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface SaleRepository extends JpaRepository<Sale, Long> {

    Optional<Sale> findByCheckoutRequestId(String checkoutRequestId);

}