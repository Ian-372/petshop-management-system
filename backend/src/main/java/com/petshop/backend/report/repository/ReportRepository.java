package com.petshop.backend.report.repository;

import com.petshop.backend.report.dto.DailySalesResponse;
import com.petshop.backend.report.dto.ProductSalesResponse;
import com.petshop.backend.sale.entity.Sale;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReportRepository extends JpaRepository<Sale, Long> {

    @EntityGraph(attributePaths = {"customer", "saleItems", "saleItems.product"})
    List<Sale> findAllByOrderBySaleDateDesc();

    // ==========================
    // SALES SUMMARY
    // ==========================

    @Query("""
            SELECT COUNT(s)
            FROM Sale s
            """)
    Long countTotalSales();

    @Query("""
            SELECT COALESCE(SUM(s.total), 0)
            FROM Sale s
            """)
    Double getTotalRevenue();

    @Query("""
            SELECT COALESCE(SUM(si.quantity), 0)
            FROM SaleItem si
            """)
    Long getTotalItemsSold();

    @Query("""
            SELECT COALESCE(AVG(s.total), 0)
            FROM Sale s
            """)
    Double getAverageSale();

    // ==========================
    // DAILY SALES
    // ==========================

    @Query("""
            SELECT new com.petshop.backend.report.dto.DailySalesResponse(
                    CAST(s.saleDate AS LocalDate),
                    COUNT(s),
                    SUM(s.total)
            )
            FROM Sale s
            GROUP BY CAST(s.saleDate AS LocalDate)
            ORDER BY CAST(s.saleDate AS LocalDate) DESC
            """)
    List<DailySalesResponse> getDailySales();

    // ==========================
    // TOP SELLING PRODUCTS
    // ==========================

    @Query("""
            SELECT new com.petshop.backend.report.dto.ProductSalesResponse(
                    p.id,
                    p.name,
                    SUM(si.quantity),
                    SUM(si.subtotal)
            )
            FROM SaleItem si
            JOIN si.product p
            GROUP BY p.id, p.name
            ORDER BY SUM(si.quantity) DESC
            """)
    List<ProductSalesResponse> getTopSellingProducts();
}
