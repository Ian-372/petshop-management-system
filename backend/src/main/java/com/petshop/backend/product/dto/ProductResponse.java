package com.petshop.backend.product.dto;

public class ProductResponse {


private Long id;
private String name;
private Double buyingPrice;
private Double sellingPrice;
private Integer quantity;

private Long categoryId;
private String categoryName;

private Long supplierId;
private String supplierName;
private String supplierPhone;
private String supplierEmail;
private String supplierAddress;

private String message;


public ProductResponse() {
}

public Long getId() {
    return id;
}

public void setId(Long id) {
    this.id = id;
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

public String getCategoryName() {
    return categoryName;
}

public void setCategoryName(String categoryName) {
    this.categoryName = categoryName;
}

public Long getSupplierId() {
    return supplierId;
}

public void setSupplierId(Long supplierId) {
    this.supplierId = supplierId;
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

public String getMessage() {
    return message;
}

public void setMessage(String message) {
    this.message = message;
}


}
