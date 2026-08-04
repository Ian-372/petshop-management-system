package com.petshop.backend.loyalty.dto;

public class RedeemPointsRequest {

    private Long customerId;

    private Integer points;

    public RedeemPointsRequest() {
    }

    public Long getCustomerId() {
        return customerId;
    }

    public void setCustomerId(Long customerId) {
        this.customerId = customerId;
    }

    public Integer getPoints() {
        return points;
    }

    public void setPoints(Integer points) {
        this.points = points;
    }
}
