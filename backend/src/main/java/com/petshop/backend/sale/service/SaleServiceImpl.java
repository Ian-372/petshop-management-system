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
import java.util.Optional;
import com.petshop.backend.debt.repository.DebtPaymentRepository;

@Service
@Transactional
public class SaleServiceImpl implements SaleService {

    private final SaleRepository saleRepository;
    private final SaleItemRepository saleItemRepository;
    private final CustomerRepository customerRepository;
    private final ProductRepository productRepository;
    private final DebtPaymentRepository debtPaymentRepository;

    public SaleServiceImpl(
            SaleRepository saleRepository,
            SaleItemRepository saleItemRepository,
            CustomerRepository customerRepository,
            ProductRepository productRepository,
            DebtPaymentRepository debtPaymentRepository) {

        this.saleRepository = saleRepository;
        this.saleItemRepository = saleItemRepository;
        this.customerRepository = customerRepository;
        this.productRepository = productRepository;
        this.debtPaymentRepository = debtPaymentRepository;
    }

    @Override
    public SaleResponse createSale(SaleRequest request) {

        Customer customer = null;

        System.out.println("PHONE RECEIVED = [" + request.getPhoneNumber() + "]");
        System.out.println("TYPE = " + request.getCustomerType());

        if (request.getPhoneNumber() != null &&
                !request.getPhoneNumber().isBlank()) {

            Optional<Customer> existingCustomer = customerRepository.findByPhone(request.getPhoneNumber());

            System.out.println("CUSTOMER FOUND = " + existingCustomer.isPresent());

            if (existingCustomer.isPresent()) {

                customer = existingCustomer.get();

            } else {

                customer = new Customer();

                if ("REGISTERED".equalsIgnoreCase(request.getCustomerType())) {

                    customer.setName(request.getCustomerName());

                } else {

                    if (request.getCustomerName() != null &&
                            !request.getCustomerName().isBlank()) {

                        customer.setName(request.getCustomerName());

                    } else {

                        customer.setName("Walk-In");
                    }
                }

                customer.setPhone(request.getPhoneNumber());
                customer.setEmail(null);
                customer.setAddress(null);
                customer.setLoyaltyPoints(0);
                customer.setTotalSpent(0.0);
                customer.setLastPurchaseDate(LocalDateTime.now());

                customer = customerRepository.save(customer);
            }

        } else {

            System.out.println("No phone number supplied. Proceeding as anonymous walk-in.");

        }

        Sale sale = new Sale();

        sale.setCustomer(customer);
        sale.setPhoneNumber(request.getPhoneNumber());
        sale.setPaymentMethod(request.getPaymentMethod());

        sale.setPaymentStatus(
                request.getPaymentMethod().equals("MPESA")
                        ? "PENDING"
                        : "PAID");

        sale.setAmountGiven(
                request.getAmountGiven() == null
                        ? 0.0
                        : request.getAmountGiven());

        sale.setBalance(
                request.getBalance() == null
                        ? 0.0
                        : request.getBalance());

        sale.setSaleDate(LocalDateTime.now());

        double total = 0.0;

        for (var itemRequest : request.getItems()) {

            Product product = productRepository.findById(itemRequest.getProductId())
                    .orElseThrow(() -> new RuntimeException("Product not found"));

            if (product.getQuantity() < itemRequest.getQuantity()) {

                throw new RuntimeException(
                        "Insufficient stock for " + product.getName());
            }

            total += product.getSellingPrice() * itemRequest.getQuantity();
        }

        sale.setTotal(total);

        Sale savedSale = saleRepository.save(sale);

        for (var itemRequest : request.getItems()) {

            Product product = productRepository.findById(itemRequest.getProductId())
                    .orElseThrow(() -> new RuntimeException("Product not found"));

            product.setQuantity(
                    product.getQuantity() - itemRequest.getQuantity());

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

        if (customer != null) {

            customer.setTotalSpent(customer.getTotalSpent() + total);

            customer.setLoyaltyPoints(
                    customer.getLoyaltyPoints()
                            + (int) (total / 100));

            customer.setLastPurchaseDate(LocalDateTime.now());

            customerRepository.save(customer);
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

        if (sale.getCustomer() != null) {

            response.setCustomerId(sale.getCustomer().getId());
            response.setCustomerName(sale.getCustomer().getName());

        } else {

            response.setCustomerId(null);
            response.setCustomerName("Walk-In");
        }

        response.setPhoneNumber(sale.getPhoneNumber());
        response.setPaymentMethod(sale.getPaymentMethod());
        response.setPaymentStatus(sale.getPaymentStatus());
        response.setMpesaReceipt(sale.getMpesaReceipt());
        response.setTotal(sale.getTotal());
        response.setSaleDate(sale.getSaleDate());
        response.setMessage(message);

        return response;
    }

    @Override
    @Transactional
    public void cancelPendingSale(Long saleId) {

        Sale sale = saleRepository.findById(saleId)
                .orElseThrow(() -> new RuntimeException("Sale not found."));

        // only pending sales can be cancelled
        if (!"PENDING".equals(sale.getPaymentStatus())) {
            throw new RuntimeException("Only pending sales can be cancelled.");
        }

        // restore stock
        List<SaleItem> items = saleItemRepository.findBySale(sale);

        for (SaleItem item : items) {

            Product product = item.getProduct();

            product.setQuantity(
                    product.getQuantity() + item.getQuantity());

            productRepository.save(product);
        }

        // delete sale items
        saleItemRepository.deleteAll(items);

        // delete sale
        saleRepository.delete(sale);
    }
}