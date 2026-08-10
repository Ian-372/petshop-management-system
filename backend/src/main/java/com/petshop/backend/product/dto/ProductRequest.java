package com.petshop.backend.product.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class ProductRequest {


@NotBlank
private String name;

@NotNull
@Min(0)
private Double buyingPrice;

@NotNull
@Min(0)
private Double sellingPrice;

@NotNull
@Min(0)
private Integer quantity;

@NotNull
private Long categoryId;

@NotBlank
private String supplierName;

private String supplierPhone;

@Email
private String supplierEmail;

private String supplierAddress;

public ProductRequest() {
}

public String getName() {
    return name;
}

public void setName(String name) {
    this.name = name;
}

public Double getBuyingPrice() {
    return buyingPrice;
}

public void setBuyingPrice(Double buyingPrice) {
    this.buyingPrice = buyingPrice;
}

public Double getSellingPrice() {
    return sellingPrice;
}

public void setSellingPrice(Double sellingPrice) {
    this.sellingPrice = sellingPrice;
}

public Integer getQuantity() {
    return quantity;
}

public void setQuantity(Integer quantity) {
    this.quantity = quantity;
}

public Long getCategoryId() {
    return categoryId;
}

public void setCategoryId(Long categoryId) {
    this.categoryId = categoryId;
}

public String getSupplierName() {
    return supplierName;
}

public void setSupplierName(String supplierName) {
    this.supplierName = supplierName;
}

public String getSupplierPhone() {
    return supplierPhone;
}

public void setSupplierPhone(String supplierPhone) {
    this.supplierPhone = supplierPhone;
}

public String getSupplierEmail() {
    return supplierEmail;
}

public void setSupplierEmail(String supplierEmail) {
    this.supplierEmail = supplierEmail;
}

public String getSupplierAddress() {
    return supplierAddress;
}

public void setSupplierAddress(String supplierAddress) {
    this.supplierAddress = supplierAddress;
}


}
