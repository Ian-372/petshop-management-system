package com.petshop.backend.dashboard.service;

import com.petshop.backend.customer.repository.CustomerRepository;
import com.petshop.backend.dashboard.dto.DashboardResponse;
import com.petshop.backend.product.repository.ProductRepository;
import com.petshop.backend.purchase.repository.PurchaseRepository;
import com.petshop.backend.sale.repository.SaleRepository;
import com.petshop.backend.supplier.repository.SupplierRepository;
import org.springframework.stereotype.Service;

@Service
public class DashboardServiceImpl implements DashboardService {

    private final ProductRepository productRepository;
    private final CustomerRepository customerRepository;
    private final SupplierRepository supplierRepository;
    private final SaleRepository saleRepository;
    private final PurchaseRepository purchaseRepository;

    public DashboardServiceImpl(
            ProductRepository productRepository,
            CustomerRepository customerRepository,
            SupplierRepository supplierRepository,
            SaleRepository saleRepository,
            PurchaseRepository purchaseRepository) {
        this.productRepository = productRepository;
        this.customerRepository = customerRepository;
        this.supplierRepository = supplierRepository;
        this.saleRepository = saleRepository;
        this.purchaseRepository = purchaseRepository;
    }

    @Override
    public DashboardResponse getDashboard() {

        DashboardResponse response = new DashboardResponse();

        response.setTotalProducts(productRepository.count());
        response.setTotalCustomers(customerRepository.count());
        response.setTotalSuppliers(supplierRepository.count());
        response.setTotalSales(saleRepository.count());
        response.setTotalPurchases(purchaseRepository.count());

        double salesRevenue = saleRepository.findAll()
                .stream()
                .mapToDouble(sale -> sale.getTotal())
                .sum();

        double purchaseCost = purchaseRepository.findAll()
                .stream()
                .mapToDouble(purchase -> purchase.getTotal())
                .sum();

        response.setSalesRevenue(salesRevenue);
        response.setPurchaseCost(purchaseCost);
        response.setProfit(salesRevenue - purchaseCost);
        response.setOutOfStockProducts(
                productRepository.countByQuantity(0));

        response.setLowStockProducts(
                productRepository.countByQuantityLessThanAndQuantityGreaterThan(10, 0));
        response.setLoyaltyCustomers(
                customerRepository.countByLoyaltyPointsGreaterThan(0));

        response.setTotalLoyaltyPoints(
                customerRepository.getTotalLoyaltyPoints());

        return response;
    }
}
