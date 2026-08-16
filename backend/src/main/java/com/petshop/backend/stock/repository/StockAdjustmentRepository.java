package com.petshop.backend.stock.repository;

import com.petshop.backend.stock.entity.StockAdjustment;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface StockAdjustmentRepository extends JpaRepository<StockAdjustment, Long> {
    List<StockAdjustment> findTop20ByOrderByAdjustmentDateDesc();
}
