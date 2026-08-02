package com.petshop.backend.customer.service;

import com.petshop.backend.customer.dto.CustomerRequest;
import com.petshop.backend.customer.dto.CustomerResponse;

import java.util.List;

public interface CustomerService {

    CustomerResponse createCustomer(CustomerRequest request);

    List<CustomerResponse> getAllCustomers();

    CustomerResponse getCustomerById(Long id);

    CustomerResponse updateCustomer(Long id, CustomerRequest request);

    String deleteCustomer(Long id);
}