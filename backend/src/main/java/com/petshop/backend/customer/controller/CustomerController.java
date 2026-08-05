package com.petshop.backend.customer.controller;

import com.petshop.backend.customer.dto.CustomerProfileResponse;
import com.petshop.backend.customer.dto.CustomerRequest;
import com.petshop.backend.customer.dto.CustomerResponse;
import com.petshop.backend.customer.service.CustomerService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/customers")
public class CustomerController {

    private final CustomerService customerService;

    public CustomerController(CustomerService customerService) {
        this.customerService = customerService;
    }

    @PostMapping
    public CustomerResponse createCustomer(
            @RequestBody CustomerRequest request) {

        return customerService.createCustomer(request);
    }

    @GetMapping
    public List<CustomerResponse> getAllCustomers() {

        return customerService.getAllCustomers();
    }

    @GetMapping("/{id}")
    public CustomerResponse getCustomerById(
            @PathVariable Long id) {

        return customerService.getCustomerById(id);
    }

    @GetMapping("/{id}/profile")
    public CustomerProfileResponse getCustomerProfile(
            @PathVariable Long id) {

        return customerService.getCustomerProfile(id);
    }

    @PutMapping("/{id}")
    public CustomerResponse updateCustomer(
            @PathVariable Long id,
            @RequestBody CustomerRequest request) {

        return customerService.updateCustomer(id, request);
    }

    @DeleteMapping("/{id}")
    public String deleteCustomer(
            @PathVariable Long id) {

        return customerService.deleteCustomer(id);
    }
}