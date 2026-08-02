package com.petshop.backend.product.service;

import com.petshop.backend.product.dto.CategoryRequest;
import com.petshop.backend.product.dto.CategoryResponse;
import com.petshop.backend.product.entity.Category;
import com.petshop.backend.product.repository.CategoryRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;

    public CategoryServiceImpl(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    @Override
    public CategoryResponse createCategory(CategoryRequest request) {

        if (categoryRepository.findByName(request.getName()).isPresent()) {
            throw new RuntimeException("Category already exists.");
        }

        Category category = new Category();
        category.setName(request.getName());

        Category savedCategory = categoryRepository.save(category);

        CategoryResponse response = new CategoryResponse();
        response.setId(savedCategory.getId());
        response.setName(savedCategory.getName());
        response.setMessage("Category created successfully.");

        return response;
    }

    @Override
    public List<CategoryResponse> getAllCategories() {

        return categoryRepository.findAll()
                .stream()
                .map(category -> {

                    CategoryResponse response = new CategoryResponse();
                    response.setId(category.getId());
                    response.setName(category.getName());

                    return response;
                })
                .toList();
    }

    @Override
    public CategoryResponse updateCategory(Long id, CategoryRequest request) {

        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found."));

        category.setName(request.getName());

        Category updatedCategory = categoryRepository.save(category);

        CategoryResponse response = new CategoryResponse();
        response.setId(updatedCategory.getId());
        response.setName(updatedCategory.getName());
        response.setMessage("Category updated successfully.");

        return response;
    }

    @Override
    public void deleteCategory(Long id) {

        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found."));

        categoryRepository.delete(category);
    }
}