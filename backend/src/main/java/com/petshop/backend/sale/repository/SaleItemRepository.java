package com.petshop.backend.sale.repository;

import com.petshop.backend.sale.entity.Sale;
import com.petshop.backend.sale.entity.SaleItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SaleItemRepository extends JpaRepository<SaleItem, Long> {

    List<SaleItem> findBySale(Sale sale);

}