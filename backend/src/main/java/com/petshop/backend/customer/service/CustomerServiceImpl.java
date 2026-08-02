package com.petshop.backend.customer.service;

import com.petshop.backend.customer.dto.CustomerRequest;
import com.petshop.backend.customer.dto.CustomerResponse;
import com.petshop.backend.customer.entity.Customer;
import com.petshop.backend.customer.repository.CustomerRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CustomerServiceImpl implements CustomerService {

    private final CustomerRepository customerRepository;

    public CustomerServiceImpl(CustomerRepository customerRepository) {
        this.customerRepository = customerRepository;
    }

    @Override
    public CustomerResponse createCustomer(CustomerRequest request) {

        if (customerRepository.findByPhone(request.getPhone()).isPresent()) {
            throw new RuntimeException("Phone number already exists.");
        }

        Customer customer = new Customer();

        customer.setName(request.getName());
        customer.setPhone(request.getPhone());
        customer.setEmail(request.getEmail());
        customer.setAddress(request.getAddress());

        Customer savedCustomer = customerRepository.save(customer);

        return mapToResponse(savedCustomer, "Customer created successfully.");
    }

    @Override
    public List<CustomerResponse> getAllCustomers() {

        return customerRepository.findAll()
                .stream()
                .map(customer -> mapToResponse(customer, null))
                .toList();
    }

    @Override
    public CustomerResponse getCustomerById(Long id) {

        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Customer not found."));

        return mapToResponse(customer, null);
    }

    @Override
    public CustomerResponse updateCustomer(Long id, CustomerRequest request) {

        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Customer not found."));

        customer.setName(request.getName());
        customer.setPhone(request.getPhone());
        customer.setEmail(request.getEmail());
        customer.setAddress(request.getAddress());

        Customer updatedCustomer = customerRepository.save(customer);

        return mapToResponse(updatedCustomer, "Customer updated successfully.");
    }

    @Override
    public String deleteCustomer(Long id) {

        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Customer not found."));

        customerRepository.delete(customer);

        return "Customer deleted successfully.";
    }

    private CustomerResponse mapToResponse(Customer customer, String message) {

        CustomerResponse response = new CustomerResponse();

        response.setId(customer.getId());
        response.setName(customer.getName());
        response.setPhone(customer.getPhone());
        response.setEmail(customer.getEmail());
        response.setAddress(customer.getAddress());

        response.setMessage(message);

        return response;
    }
}