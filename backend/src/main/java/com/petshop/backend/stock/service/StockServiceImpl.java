package com.petshop.backend.stock.service;

import com.petshop.backend.product.entity.Product;
import com.petshop.backend.product.repository.ProductRepository;
import com.petshop.backend.stock.dto.StockAdjustmentRequest;
import com.petshop.backend.stock.dto.StockResponse;
import com.petshop.backend.stock.dto.StockAdjustmentResponse;
import com.petshop.backend.stock.entity.StockAdjustment;
import com.petshop.backend.stock.repository.StockAdjustmentRepository;
import org.springframework.stereotype.Service;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.List;
import java.time.LocalDateTime;

@Service
public class StockServiceImpl implements StockService {

    private final ProductRepository productRepository;
    private final StockAdjustmentRepository stockAdjustmentRepository;

    public StockServiceImpl(ProductRepository productRepository, StockAdjustmentRepository stockAdjustmentRepository) {
        this.productRepository = productRepository;
        this.stockAdjustmentRepository = stockAdjustmentRepository;
    }

    @Override
    public List<StockResponse> getAllStock() {

        return productRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();

    }

    @Override
    public List<StockResponse> getLowStockProducts() {

        return productRepository.findAll()
                .stream()
                .filter(product -> product.getQuantity() <= 10)
                .map(this::mapToResponse)
                .toList();

    }

    @Override
    public StockResponse adjustStock(StockAdjustmentRequest request) {

        Product product = productRepository.findById(request.getProductId())

                .orElseThrow(() -> new RuntimeException("Product not found."));

        int quantityBefore = product.getQuantity();

        if (request.getAdjustmentType().equalsIgnoreCase("IN")) {

            product.setQuantity(

                    product.getQuantity() + request.getQuantity()

            );

        } else {

            if (product.getQuantity() < request.getQuantity()) {

                throw new RuntimeException("Insufficient stock.");

            }

            product.setQuantity(

                    product.getQuantity() - request.getQuantity()

            );

        }

        productRepository.save(product);

        StockAdjustment adjustment = new StockAdjustment();
        adjustment.setProduct(product);
        adjustment.setAdjustmentType(request.getAdjustmentType().toUpperCase());
        adjustment.setQuantity(request.getQuantity());
        adjustment.setQuantityBefore(quantityBefore);
        adjustment.setQuantityAfter(product.getQuantity());
        adjustment.setReason(request.getReason().trim());
        adjustment.setAdjustedBy(SecurityContextHolder.getContext().getAuthentication().getName());
        adjustment.setAdjustmentDate(LocalDateTime.now());
        stockAdjustmentRepository.save(adjustment);

        return mapToResponse(product);

    }

    @Override
    public List<StockAdjustmentResponse> getRecentAdjustments() {
        return stockAdjustmentRepository.findTop20ByOrderByAdjustmentDateDesc().stream()
                .map(item -> new StockAdjustmentResponse(item.getId(), item.getProduct().getId(), item.getProduct().getName(), item.getAdjustmentType(), item.getQuantity(), item.getQuantityBefore(), item.getQuantityAfter(), item.getReason(), item.getAdjustedBy(), item.getAdjustmentDate()))
                .toList();
    }

    private StockResponse mapToResponse(Product product) {

        StockResponse response = new StockResponse();

        response.setProductId(product.getId());

        response.setProductName(product.getName());

        response.setCategory(product.getCategory().getName());

        response.setQuantity(product.getQuantity());

        response.setBuyingPrice(product.getBuyingPrice());

        response.setSellingPrice(product.getSellingPrice());

        response.setLowStock(product.getQuantity() <= 10);

        return response;

    }

}
