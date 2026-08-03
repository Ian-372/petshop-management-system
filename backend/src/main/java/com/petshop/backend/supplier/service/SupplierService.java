package com.petshop.backend.supplier.service;

import com.petshop.backend.supplier.dto.SupplierRequest;
import com.petshop.backend.supplier.dto.SupplierResponse;

import java.util.List;

public interface SupplierService {

    SupplierResponse createSupplier(SupplierRequest request);

    List<SupplierResponse> getAllSuppliers();

    SupplierResponse getSupplierById(Long id);

    SupplierResponse updateSupplier(Long id, SupplierRequest request);

    void deleteSupplier(Long id);
}