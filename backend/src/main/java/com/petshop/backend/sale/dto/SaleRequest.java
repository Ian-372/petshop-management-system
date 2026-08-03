package com.petshop.backend.sale.dto;

import java.util.List;

public class SaleRequest {

    private Long customerId;

    private List<SaleItemRequest> items;

    public SaleRequest() {
    }

    public Long getCustomerId() {
        return customerId;
    }

    public void setCustomerId(Long customerId) {
        this.customerId = customerId;
    }

    public List<SaleItemRequest> getItems() {
        return items;
    }

    public void setItems(List<SaleItemRequest> items) {
        this.items = items;
    }
}