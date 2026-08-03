package com.petshop.backend.purchase.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.util.List;

public class PurchaseRequest {

    @NotNull
    private Long supplierId;

    @Valid
    @NotEmpty
    private List<PurchaseItemRequest> items;

    public PurchaseRequest() {
    }

    public Long getSupplierId() {
        return supplierId;
    }

    public void setSupplierId(Long supplierId) {
        this.supplierId = supplierId;
    }

    public List<PurchaseItemRequest> getItems() {
        return items;
    }

    public void setItems(List<PurchaseItemRequest> items) {
        this.items = items;
    }
}
