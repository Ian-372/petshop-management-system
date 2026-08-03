package com.petshop.backend.stock.service;

import com.petshop.backend.product.entity.Product;
import com.petshop.backend.product.repository.ProductRepository;
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
                .map(product -> {

                    StockResponse response = new StockResponse();

                    response.setProductId(product.getId());
                    response.setProductName(product.getName());
                    response.setQuantity(product.getQuantity());
                    response.setBuyingPrice(product.getBuyingPrice());
                    response.setSellingPrice(product.getSellingPrice());

                    return response;

                })
                .toList();
    }

    @Override
    public List<StockResponse> getLowStockProducts() {

        return productRepository.findAll()
                .stream()
                .filter(product -> product.getQuantity() <= 10)
                .map(product -> {

                    StockResponse response = new StockResponse();

                    response.setProductId(product.getId());
                    response.setProductName(product.getName());
                    response.setQuantity(product.getQuantity());
                    response.setBuyingPrice(product.getBuyingPrice());
                    response.setSellingPrice(product.getSellingPrice());

                    return response;

                })
                .toList();
    }
}
