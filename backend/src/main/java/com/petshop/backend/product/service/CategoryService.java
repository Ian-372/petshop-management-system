package com.petshop.backend.product.service;

import com.petshop.backend.product.dto.CategoryRequest;
import com.petshop.backend.product.dto.CategoryResponse;

import java.util.List;

public interface CategoryService {

    CategoryResponse createCategory(CategoryRequest request);

    List<CategoryResponse> getAllCategories();

    CategoryResponse updateCategory(Long id, CategoryRequest request);

    void deleteCategory(Long id);

}