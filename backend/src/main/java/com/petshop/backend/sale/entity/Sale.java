package com.petshop.backend.sale.entity;

import com.petshop.backend.customer.entity.Customer;
import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "sales")
public class Sale {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id")
    private Customer customer;

    @Column(nullable = false)
    private Double total;
    @Column(nullable = false)
    private Double amountGiven = 0.0;

    @Column(nullable = false)
    private Double balance = 0.0;

    @Column(nullable = false)
    private Double outstandingDebt = 0.0;

    public Double getAmountGiven() {
        return amountGiven;
    }

    public void setAmountGiven(Double amountGiven) {
        this.amountGiven = amountGiven;
    }

    public Double getBalance() {
        return balance;
    }

    public void setBalance(Double balance) {
        this.balance = balance;
    }

    public Double getOutstandingDebt() { return outstandingDebt; }

    public void setOutstandingDebt(Double outstandingDebt) { this.outstandingDebt = outstandingDebt; }

    private String paymentStatus;

    private String paymentMethod;

    private String checkoutRequestId;

    private String mpesaReceipt;

    private String phoneNumber;

    // NEW FIELD
    @Column(name = "loyalty_awarded", nullable = false)
    private Boolean loyaltyAwarded = false;
    @Column(nullable = false)
    private LocalDateTime saleDate;

    public Sale() {
    }

    public Long getId() {
        return id;
    }

    public Customer getCustomer() {
        return customer;
    }

    public void setCustomer(Customer customer) {
        this.customer = customer;
    }

    public Double getTotal() {
        return total;
    }

    public void setTotal(Double total) {
        this.total = total;
    }

    public LocalDateTime getSaleDate() {
        return saleDate;
    }

    public void setSaleDate(LocalDateTime saleDate) {
        this.saleDate = saleDate;
    }

    public String getPaymentStatus() {
        return paymentStatus;
    }

    public void setPaymentStatus(String paymentStatus) {
        this.paymentStatus = paymentStatus;
    }

    public String getPaymentMethod() {
        return paymentMethod;
    }

    public void setPaymentMethod(String paymentMethod) {
        this.paymentMethod = paymentMethod;
    }

    public String getCheckoutRequestId() {
        return checkoutRequestId;
    }

    public void setCheckoutRequestId(String checkoutRequestId) {
        this.checkoutRequestId = checkoutRequestId;
    }

    public String getMpesaReceipt() {
        return mpesaReceipt;
    }

    public void setMpesaReceipt(String mpesaReceipt) {
        this.mpesaReceipt = mpesaReceipt;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    // NEW GETTER
    public Boolean getLoyaltyAwarded() {
        return loyaltyAwarded;
    }

    // NEW SETTER
    public void setLoyaltyAwarded(Boolean loyaltyAwarded) {
        this.loyaltyAwarded = loyaltyAwarded;
    }

    @OneToMany(mappedBy = "sale", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<SaleItem> saleItems = new ArrayList<>();

    public List<SaleItem> getSaleItems() {
        return saleItems;
    }

    public void setSaleItems(List<SaleItem> saleItems) {
        this.saleItems = saleItems;
    }
}
