
package com.petshop.backend.sale.repository;

import com.petshop.backend.sale.entity.SaleItem;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SaleItemRepository extends JpaRepository<SaleItem, Long> {
}