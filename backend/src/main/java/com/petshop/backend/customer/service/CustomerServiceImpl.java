package com.petshop.backend.customer.service;

import com.petshop.backend.customer.dto.CustomerProfileResponse;
import com.petshop.backend.customer.dto.CustomerRequest;
import com.petshop.backend.customer.dto.CustomerResponse;
import com.petshop.backend.customer.dto.SaleHistoryResponse;
import com.petshop.backend.customer.entity.Customer;
import com.petshop.backend.customer.repository.CustomerRepository;
import com.petshop.backend.sale.entity.Sale;
import com.petshop.backend.sale.entity.SaleItem;
import com.petshop.backend.sale.repository.SaleItemRepository;
import com.petshop.backend.sale.repository.SaleRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CustomerServiceImpl implements CustomerService {

    private final CustomerRepository customerRepository;
    private final SaleRepository saleRepository;
    private final SaleItemRepository saleItemRepository;

    public CustomerServiceImpl(
            CustomerRepository customerRepository,
            SaleRepository saleRepository,
            SaleItemRepository saleItemRepository
    ) {
        this.customerRepository = customerRepository;
        this.saleRepository = saleRepository;
        this.saleItemRepository = saleItemRepository;
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

    @Override
    public CustomerProfileResponse getCustomerProfile(Long id) {

        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Customer not found."));

        List<Sale> sales = saleRepository.findByCustomerOrderBySaleDateDesc(customer);

        CustomerProfileResponse profile = new CustomerProfileResponse();

        profile.setId(customer.getId());
        profile.setName(customer.getName());
        profile.setPhone(customer.getPhone());
        profile.setEmail(customer.getEmail());
        profile.setAddress(customer.getAddress());

        profile.setTotalSpent(customer.getTotalSpent());
        profile.setLoyaltyPoints(customer.getLoyaltyPoints());

        profile.setPurchaseCount(sales.size());

        if (!sales.isEmpty()) {
            profile.setLastPurchase(sales.get(0).getSaleDate());
        }

        List<SaleHistoryResponse> history = sales.stream().map(sale -> {

            SaleHistoryResponse saleResponse = new SaleHistoryResponse();

            saleResponse.setSaleId(sale.getId());
            saleResponse.setSaleDate(sale.getSaleDate());
            saleResponse.setTotal(sale.getTotal());
            saleResponse.setPaymentMethod(sale.getPaymentMethod());
            saleResponse.setPaymentStatus(sale.getPaymentStatus());

            List<String> items = saleItemRepository.findBySale(sale)
                    .stream()
                    .map(item ->
                            item.getProduct().getName()
                                    + " × "
                                    + item.getQuantity()
                    )
                    .collect(Collectors.toList());

            saleResponse.setItems(items);

            return saleResponse;

        }).toList();

        profile.setPurchases(history);

        return profile;
    }

    private CustomerResponse mapToResponse(Customer customer, String message) {

        CustomerResponse response = new CustomerResponse();

        response.setId(customer.getId());
        response.setName(customer.getName());
        response.setPhone(customer.getPhone());
        response.setEmail(customer.getEmail());
        response.setAddress(customer.getAddress());

        response.setTotalSpent(customer.getTotalSpent());
        response.setLoyaltyPoints(customer.getLoyaltyPoints());

        response.setMessage(message);

        return response;
    }
}