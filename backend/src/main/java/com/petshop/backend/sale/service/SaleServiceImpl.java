package com.petshop.backend.sale.service;

import com.petshop.backend.customer.entity.Customer;
import com.petshop.backend.customer.repository.CustomerRepository;
import com.petshop.backend.product.entity.Product;
import com.petshop.backend.product.repository.ProductRepository;
import com.petshop.backend.sale.dto.SaleRequest;
import com.petshop.backend.sale.dto.SaleResponse;
import com.petshop.backend.sale.entity.Sale;
import com.petshop.backend.sale.entity.SaleItem;
import com.petshop.backend.sale.repository.SaleItemRepository;
import com.petshop.backend.sale.repository.SaleRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@Transactional
public class SaleServiceImpl implements SaleService {

    private final SaleRepository saleRepository;
    private final SaleItemRepository saleItemRepository;
    private final CustomerRepository customerRepository;
    private final ProductRepository productRepository;

    public SaleServiceImpl(
            SaleRepository saleRepository,
            SaleItemRepository saleItemRepository,
            CustomerRepository customerRepository,
            ProductRepository productRepository) {

        this.saleRepository = saleRepository;
        this.saleItemRepository = saleItemRepository;
        this.customerRepository = customerRepository;
        this.productRepository = productRepository;
    }

    @Override
    public SaleResponse createSale(SaleRequest request) {

        Customer customer = customerRepository.findById(request.getCustomerId())
                .orElseThrow(() -> new RuntimeException("Customer not found."));

        Sale sale = new Sale();

        sale.setCustomer(customer);
        sale.setSaleDate(LocalDateTime.now());

        double total = 0.0;

        for (var itemRequest : request.getItems()) {

            Product product = productRepository.findById(itemRequest.getProductId())
                    .orElseThrow(() -> new RuntimeException("Product not found."));

            if (product.getQuantity() < itemRequest.getQuantity()) {
                throw new RuntimeException(
                        "Insufficient stock for " + product.getName());
            }

            double subtotal = product.getSellingPrice() * itemRequest.getQuantity();

            total += subtotal;
        }

        sale.setTotal(total);

        Sale savedSale = saleRepository.save(sale);
        for (var itemRequest : request.getItems()) {

            Product product = productRepository.findById(itemRequest.getProductId())
                    .orElseThrow(() -> new RuntimeException("Product not found."));

            product.setQuantity(product.getQuantity() - itemRequest.getQuantity());

            productRepository.save(product);

            SaleItem saleItem = new SaleItem();

            saleItem.setSale(savedSale);
            saleItem.setProduct(product);
            saleItem.setQuantity(itemRequest.getQuantity());
            saleItem.setUnitPrice(product.getSellingPrice());

            saleItem.setSubtotal(
                    product.getSellingPrice() * itemRequest.getQuantity());

            saleItemRepository.save(saleItem);
        }

        return mapToResponse(savedSale, "Sale completed successfully.");
    }

    @Override
    public List<SaleResponse> getAllSales() {

        return saleRepository.findAll()
                .stream()
                .map(sale -> mapToResponse(sale, null))
                .toList();
    }

    @Override
    public SaleResponse getSaleById(Long id) {

        Sale sale = saleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Sale not found."));

        return mapToResponse(sale, null);
    }

    private SaleResponse mapToResponse(Sale sale, String message) {

        SaleResponse response = new SaleResponse();

        response.setId(sale.getId());
        response.setCustomerId(sale.getCustomer().getId());
        response.setCustomerName(sale.getCustomer().getName());
        response.setTotal(sale.getTotal());
        response.setSaleDate(sale.getSaleDate());
        response.setMessage(message);

        return response;
    }
}
