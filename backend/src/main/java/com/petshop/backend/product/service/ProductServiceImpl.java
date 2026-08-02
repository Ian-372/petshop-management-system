package com.petshop.backend.product.service;


import com.petshop.backend.product.dto.ProductRequest;
import com.petshop.backend.product.dto.ProductResponse;
import com.petshop.backend.product.entity.Category;
import com.petshop.backend.product.entity.Product;
import com.petshop.backend.product.repository.CategoryRepository;
import com.petshop.backend.product.repository.ProductRepository;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;

    public ProductServiceImpl(ProductRepository productRepository,
                              CategoryRepository categoryRepository) {

        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
    }

    @Override
    public ProductResponse createProduct(ProductRequest request) {

        if (productRepository.findByName(request.getName()).isPresent()) {
            throw new RuntimeException("Product already exists.");
        }

        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Category not found."));

        Product product = new Product();

        product.setName(request.getName());
        product.setBuyingPrice(request.getBuyingPrice());
        product.setSellingPrice(request.getSellingPrice());
        product.setQuantity(request.getQuantity());
        product.setCategory(category);

        Product savedProduct = productRepository.save(product);

        return mapToResponse(savedProduct, "Product created successfully.");
    }

    @Override
    public List<ProductResponse> getAllProducts() {

        return productRepository.findAll()
                .stream()
                .map(product -> mapToResponse(product, null))
                .toList();
    }

    @Override
    public ProductResponse getProductById(Long id) {

        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found."));

        return mapToResponse(product, null);
    }

    @Override
    public ProductResponse updateProduct(Long id, ProductRequest request) {

        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found."));

        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Category not found."));

        product.setName(request.getName());
        product.setBuyingPrice(request.getBuyingPrice());
        product.setSellingPrice(request.getSellingPrice());
        product.setQuantity(request.getQuantity());
        product.setCategory(category);

        Product updatedProduct = productRepository.save(product);

        return mapToResponse(updatedProduct, "Product updated successfully.");
    }

    @Override
    public String deleteProduct(Long id) {

        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found."));

        productRepository.delete(product);

        return "Product deleted successfully.";
    }

    private ProductResponse mapToResponse(Product product, String message) {

        ProductResponse response = new ProductResponse();

        response.setId(product.getId());
        response.setName(product.getName());
        response.setBuyingPrice(product.getBuyingPrice());
        response.setSellingPrice(product.getSellingPrice());
        response.setQuantity(product.getQuantity());

        response.setCategoryId(product.getCategory().getId());
        response.setCategoryName(product.getCategory().getName());

        response.setMessage(message);

        return response;
    }
}