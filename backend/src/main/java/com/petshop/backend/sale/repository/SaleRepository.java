package com.petshop.backend.sale.repository;

import com.petshop.backend.sale.entity.Sale;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SaleRepository extends JpaRepository<Sale, Long> {
}