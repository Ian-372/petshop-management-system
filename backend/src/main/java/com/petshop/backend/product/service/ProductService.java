package com.petshop.backend.product.service;


import com.petshop.backend.product.dto.ProductRequest;
import com.petshop.backend.product.dto.ProductResponse;

import java.util.List;

public interface ProductService {

    ProductResponse createProduct(ProductRequest request);

    List<ProductResponse> getAllProducts();

    ProductResponse getProductById(Long id);

    ProductResponse updateProduct(Long id, ProductRequest request);

    String deleteProduct(Long id);

}