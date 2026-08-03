package com.petshop.backend.supplier.service;

import com.petshop.backend.supplier.dto.SupplierRequest;
import com.petshop.backend.supplier.dto.SupplierResponse;
import com.petshop.backend.supplier.entity.Supplier;
import com.petshop.backend.supplier.repository.SupplierRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class SupplierServiceImpl implements SupplierService {

    private final SupplierRepository supplierRepository;

    public SupplierServiceImpl(SupplierRepository supplierRepository) {
        this.supplierRepository = supplierRepository;
    }

    @Override
    public SupplierResponse createSupplier(SupplierRequest request) {

        Supplier supplier = new Supplier();

        supplier.setName(request.getName());
        supplier.setPhone(request.getPhone());
        supplier.setEmail(request.getEmail());
        supplier.setAddress(request.getAddress());

        supplier = supplierRepository.save(supplier);

        SupplierResponse response = mapToResponse(supplier);
        response.setMessage("Supplier created successfully.");

        return response;
    }

    @Override
    public List<SupplierResponse> getAllSuppliers() {

        return supplierRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public SupplierResponse getSupplierById(Long id) {

        Supplier supplier = supplierRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Supplier not found."));

        return mapToResponse(supplier);
    }

    @Override
    public SupplierResponse updateSupplier(Long id, SupplierRequest request) {

        Supplier supplier = supplierRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Supplier not found."));

        supplier.setName(request.getName());
        supplier.setPhone(request.getPhone());
        supplier.setEmail(request.getEmail());
        supplier.setAddress(request.getAddress());

        supplier = supplierRepository.save(supplier);

        SupplierResponse response = mapToResponse(supplier);
        response.setMessage("Supplier updated successfully.");

        return response;
    }

    @Override
    public void deleteSupplier(Long id) {

        Supplier supplier = supplierRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Supplier not found."));

        supplierRepository.delete(supplier);
    }

    private SupplierResponse mapToResponse(Supplier supplier) {

        SupplierResponse response = new SupplierResponse();

        response.setId(supplier.getId());
        response.setName(supplier.getName());
        response.setPhone(supplier.getPhone());
        response.setEmail(supplier.getEmail());
        response.setAddress(supplier.getAddress());

        return response;
    }
}