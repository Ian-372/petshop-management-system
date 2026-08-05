package com.petshop.backend.stock.service;

import com.petshop.backend.product.entity.Product;
import com.petshop.backend.product.repository.ProductRepository;
import com.petshop.backend.stock.dto.StockAdjustmentRequest;
import com.petshop.backend.stock.dto.StockResponse;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class StockServiceImpl implements StockService {

    private final ProductRepository productRepository;

    public StockServiceImpl(ProductRepository productRepository) {
        this.productRepository = productRepository;
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

        return mapToResponse(product);

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