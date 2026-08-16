package com.petshop.backend.stock.entity;

import com.petshop.backend.product.entity.Product;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "stock_adjustments")
public class StockAdjustment {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "product_id", nullable = false) private Product product;
    @Column(nullable = false) private String adjustmentType;
    @Column(nullable = false) private Integer quantity;
    @Column(nullable = false) private Integer quantityBefore;
    @Column(nullable = false) private Integer quantityAfter;
    @Column(nullable = false) private String reason;
    @Column private String adjustedBy;
    @Column(nullable = false) private LocalDateTime adjustmentDate;
    public Long getId() { return id; }
    public Product getProduct() { return product; } public void setProduct(Product value) { product = value; }
    public String getAdjustmentType() { return adjustmentType; } public void setAdjustmentType(String value) { adjustmentType = value; }
    public Integer getQuantity() { return quantity; } public void setQuantity(Integer value) { quantity = value; }
    public Integer getQuantityBefore() { return quantityBefore; } public void setQuantityBefore(Integer value) { quantityBefore = value; }
    public Integer getQuantityAfter() { return quantityAfter; } public void setQuantityAfter(Integer value) { quantityAfter = value; }
    public String getReason() { return reason; } public void setReason(String value) { reason = value; }
    public String getAdjustedBy() { return adjustedBy; } public void setAdjustedBy(String value) { adjustedBy = value; }
    public LocalDateTime getAdjustmentDate() { return adjustmentDate; } public void setAdjustmentDate(LocalDateTime value) { adjustmentDate = value; }
}
