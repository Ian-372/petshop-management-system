package com.petshop.backend.product.repository;

import com.petshop.backend.product.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ProductRepository extends JpaRepository<Product, Long> {

    Optional<Product> findByName(String name);

    long countByQuantity(Integer quantity);

    long countByQuantityLessThanAndQuantityGreaterThan(
            Integer lowStock,
            Integer zero);

}