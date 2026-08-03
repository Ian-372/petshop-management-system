package com.petshop.backend.purchase.service;

import com.petshop.backend.product.entity.Product;
import com.petshop.backend.product.repository.ProductRepository;
import com.petshop.backend.purchase.dto.PurchaseItemRequest;
import com.petshop.backend.purchase.dto.PurchaseRequest;
import com.petshop.backend.purchase.dto.PurchaseResponse;
import com.petshop.backend.purchase.entity.Purchase;
import com.petshop.backend.purchase.entity.PurchaseItem;
import com.petshop.backend.purchase.repository.PurchaseItemRepository;
import com.petshop.backend.purchase.repository.PurchaseRepository;
import com.petshop.backend.supplier.entity.Supplier;
import com.petshop.backend.supplier.repository.SupplierRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class PurchaseServiceImpl implements PurchaseService {

        private final PurchaseRepository purchaseRepository;
        private final PurchaseItemRepository purchaseItemRepository;
        private final SupplierRepository supplierRepository;
        private final ProductRepository productRepository;

        public PurchaseServiceImpl(
                        PurchaseRepository purchaseRepository,
                        PurchaseItemRepository purchaseItemRepository,
                        SupplierRepository supplierRepository,
                        ProductRepository productRepository) {
                this.purchaseRepository = purchaseRepository;
                this.purchaseItemRepository = purchaseItemRepository;
                this.supplierRepository = supplierRepository;
                this.productRepository = productRepository;
        }

        @Override
        @Transactional
        public PurchaseResponse createPurchase(PurchaseRequest request) {

                Supplier supplier = supplierRepository.findById(request.getSupplierId())
                                .orElseThrow(() -> new RuntimeException("Supplier not found."));

                Purchase purchase = new Purchase();
                purchase.setSupplier(supplier);
                purchase.setPurchaseDate(LocalDateTime.now());

                purchase = purchaseRepository.save(purchase);

                double total = 0;

                for (PurchaseItemRequest itemRequest : request.getItems()) {

                        Product product = productRepository.findById(itemRequest.getProductId())
                                        .orElseThrow(() -> new RuntimeException("Product not found."));

                        PurchaseItem item = new PurchaseItem();

                        item.setPurchase(purchase);
                        item.setProduct(product);
                        item.setQuantity(itemRequest.getQuantity());
                        item.setBuyingPrice(itemRequest.getBuyingPrice());

                        purchaseItemRepository.save(item);

                        // Increase stock automatically

                        product.setQuantity(
                                        product.getQuantity() + itemRequest.getQuantity());

                        productRepository.save(product);

                        total += itemRequest.getBuyingPrice() * itemRequest.getQuantity();
                }

                purchase.setTotal(total);

                purchaseRepository.save(purchase);

                PurchaseResponse response = new PurchaseResponse();

                response.setId(purchase.getId());
                response.setSupplierId(supplier.getId());
                response.setSupplierName(supplier.getName());
                response.setPurchaseDate(purchase.getPurchaseDate());
                response.setTotal(total);
                response.setMessage("Purchase recorded successfully.");

                return response;
        }

        @Override
        @Transactional
        public PurchaseResponse getPurchaseById(Long id) {

                Purchase purchase = purchaseRepository.findById(id)
                                .orElseThrow(() -> new RuntimeException("Purchase not found."));

                double total = purchase.getItems()
                                .stream()
                                .mapToDouble(item -> item.getBuyingPrice() * item.getQuantity())
                                .sum();

                PurchaseResponse response = new PurchaseResponse();

                response.setId(purchase.getId());
                response.setSupplierId(purchase.getSupplier().getId());
                response.setSupplierName(purchase.getSupplier().getName());
                response.setPurchaseDate(purchase.getPurchaseDate());
                response.setTotal(total);

                return response;
        }

        @Override
        @Transactional
        public List<PurchaseResponse> getAllPurchases() {

                return purchaseRepository.findAll()
                                .stream()
                                .map(purchase -> {

                                        double total = purchase.getItems()
                                                        .stream()
                                                        .mapToDouble(item -> item.getBuyingPrice() * item.getQuantity())
                                                        .sum();

                                        PurchaseResponse response = new PurchaseResponse();

                                        response.setId(purchase.getId());
                                        response.setSupplierId(purchase.getSupplier().getId());
                                        response.setSupplierName(purchase.getSupplier().getName());
                                        response.setPurchaseDate(purchase.getPurchaseDate());
                                        response.setTotal(total);

                                        return response;

                                }).toList();
        }
}