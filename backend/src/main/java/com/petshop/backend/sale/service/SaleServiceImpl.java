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

        Customer customer = null;

        System.out.println(
                "PHONE RECEIVED = [" + request.getPhoneNumber() + "]");

        System.out.println(
                "TYPE = " + request.getCustomerType());

        /*
         * ==========================
         * FIND OR CREATE CUSTOMER
         * ==========================
         */

        if (request.getPhoneNumber() != null &&
                !request.getPhoneNumber().isBlank()) {

            Optional<Customer> existingCustomer = customerRepository.findByPhone(
                    request.getPhoneNumber());

            System.out.println(
                    "CUSTOMER FOUND = " +
                            existingCustomer.isPresent());

            if (existingCustomer.isPresent()) {

                customer = existingCustomer.get();

            } else {

                customer = new Customer();

                if ("REGISTERED".equalsIgnoreCase(
                        request.getCustomerType())) {

                    customer.setName(request.getCustomerName());

                } else {

                    if (request.getCustomerName() != null &&
                            !request.getCustomerName().isBlank()) {

                        customer.setName(
                                request.getCustomerName());

                    } else {

                        customer.setName("Walk-In");
                    }
                }

                customer.setPhone(request.getPhoneNumber());
                customer.setEmail(null);
                customer.setAddress(null);
                customer.setLoyaltyPoints(0);
                customer.setTotalSpent(0.0);
                customer.setTotalDebt(0.0);
                customer.setLastPurchaseDate(
                        LocalDateTime.now());

                customer = customerRepository.save(customer);
            }

        } else {

            System.out.println(
                    "No phone number supplied. " +
                            "Proceeding as anonymous walk-in.");
        }
        if ("DEBIT".equalsIgnoreCase(request.getPaymentMethod())) {

            if (customer == null ||
                    !"REGISTERED".equalsIgnoreCase(request.getCustomerType())) {

                throw new RuntimeException(
                        "A registered customer is required for credit/debt sales.");
            }
        }

        /*
         * ==========================
         * CREATE SALE
         * ==========================
         */

        Sale sale = new Sale();

        sale.setCustomer(customer);
        sale.setPhoneNumber(request.getPhoneNumber());
        sale.setPaymentMethod(request.getPaymentMethod());

        /*
         * M-PESA starts as PENDING.
         * CASH and DEBIT are completed immediately.
         */

        if ("MPESA".equalsIgnoreCase(request.getPaymentMethod())) {

            sale.setPaymentStatus("PENDING");

        } else if ("DEBIT".equalsIgnoreCase(request.getPaymentMethod())) {

            sale.setPaymentStatus("DEBT");

        } else {

            sale.setPaymentStatus("PAID");
        }

        /*
         * ==========================
         * CALCULATE TOTAL
         * ==========================
         */

        double total = 0.0;

        for (var itemRequest : request.getItems()) {

            Product product = productRepository.findById(
                    itemRequest.getProductId())
                    .orElseThrow(() -> new RuntimeException(
                            "Product not found"));

            if (product.getQuantity() < itemRequest.getQuantity()) {

                throw new RuntimeException(
                        "Insufficient stock for " +
                                product.getName());
            }

            total += product.getSellingPrice() *
                    itemRequest.getQuantity();
        }

        sale.setTotal(total);

        /*
         * ==========================
         * PAYMENT CALCULATION
         * ==========================
         */

        double amountGiven = request.getAmountGiven() == null
                ? 0.0
                : request.getAmountGiven();

        double balance = 0.0;

        /*
         * DEBIT
         *
         * Whatever has not been paid becomes
         * part of the customer's outstanding debt.
         */

        if ("DEBIT".equalsIgnoreCase(
                request.getPaymentMethod())) {

            if (customer == null) {

                throw new RuntimeException(
                        "A customer is required for a debit sale.");
            }

            if (amountGiven < 0) {

                throw new RuntimeException(
                        "Amount given cannot be negative.");
            }

            if (amountGiven > total) {

                throw new RuntimeException(
                        "Amount given cannot exceed sale total.");
            }

            balance = total - amountGiven;

            final double debtLimit = 2000.0;
            if (customer.getTotalDebt() + balance > debtLimit) {
                throw new RuntimeException(
                        "This sale would exceed the customer's KSh 2,000 debt limit. "
                                + "Current debt: KSh " + customer.getTotalDebt()
                                + ", new balance: KSh " + balance + ".");
            }

        } else if ("CASH".equalsIgnoreCase(
                request.getPaymentMethod())) {

            if (amountGiven < 0) {

                throw new RuntimeException(
                        "Amount given cannot be negative.");
            }

            if (amountGiven < total) {

                throw new RuntimeException(
                        "Cash payment is less than sale total.");
            }

            balance = 0.0;

        } else if ("MPESA".equalsIgnoreCase(
                request.getPaymentMethod())) {

            /*
             * M-Pesa payment is handled separately
             * by the M-Pesa/STK process.
             */

            amountGiven = 0.0;
            balance = 0.0;
        }

        sale.setAmountGiven(amountGiven);
        sale.setBalance(balance);
        sale.setOutstandingDebt("DEBIT".equalsIgnoreCase(request.getPaymentMethod()) ? balance : 0.0);
        sale.setSaleDate(LocalDateTime.now());

        /*
         * ==========================
         * SAVE SALE
         * ==========================
         */

        Sale savedSale = saleRepository.save(sale);

        /*
         * ==========================
         * REDUCE STOCK
         * ==========================
         */

        for (var itemRequest : request.getItems()) {

            Product product = productRepository.findById(
                    itemRequest.getProductId())
                    .orElseThrow(() -> new RuntimeException(
                            "Product not found"));

            product.setQuantity(
                    product.getQuantity() -
                            itemRequest.getQuantity());

            productRepository.save(product);

            SaleItem saleItem = new SaleItem();

            saleItem.setSale(savedSale);
            saleItem.setProduct(product);
            saleItem.setQuantity(
                    itemRequest.getQuantity());

            saleItem.setUnitPrice(
                    product.getSellingPrice());

            saleItem.setSubtotal(
                    product.getSellingPrice() *
                            itemRequest.getQuantity());

            saleItemRepository.save(saleItem);
        }

        /*
         * ==========================
         * UPDATE CUSTOMER
         * ==========================
         */

        if (customer != null) {

            /*
             * Total spent records the value
             * of the sale.
             */
            if (customer != null) {

                /*
                 * MONEY ACTUALLY PAID
                 *
                 * For CASH and M-PESA, this is the sale total.
                 * For DEBIT, only the amount actually paid now
                 * counts as spent.
                 */
                if ("DEBIT".equalsIgnoreCase(request.getPaymentMethod())) {

                    customer.setTotalSpent(
                            customer.getTotalSpent() + amountGiven);

                } else if ("CASH".equalsIgnoreCase(request.getPaymentMethod())) {

                    customer.setTotalSpent(
                            customer.getTotalSpent() + total);

                }

                /*
                 * Loyalty points are awarded for the purchase.
                 */
                customer.setLoyaltyPoints(
                        customer.getLoyaltyPoints()
                                + (int) (total / 100));

                /*
                 * Add only the unpaid portion to debt.
                 */
                if ("DEBIT".equalsIgnoreCase(
                        request.getPaymentMethod())) {

                    customer.setTotalDebt(
                            customer.getTotalDebt() + balance);
                }

                customer.setLastPurchaseDate(
                        LocalDateTime.now());

                customerRepository.save(customer);
            }
        }

        /*
         * ==========================
         * RETURN RESPONSE
         * ==========================
         */

        return mapToResponse(
                savedSale,
                "Sale completed successfully.");
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
                .orElseThrow(() -> new RuntimeException(
                        "Sale not found."));

        return mapToResponse(sale, null);
    }

    /*
     * ==========================
     * MAP SALE TO RESPONSE
     * ==========================
     */

    private SaleResponse mapToResponse(
            Sale sale,
            String message) {

        SaleResponse response = new SaleResponse();

        response.setId(sale.getId());

        if (sale.getCustomer() != null) {

            response.setCustomerId(
                    sale.getCustomer().getId());

            response.setCustomerName(
                    sale.getCustomer().getName());

            /*
             * Current total outstanding debt.
             */
            response.setCurrentDebt(
                    sale.getCustomer().getTotalDebt());

        } else {

            response.setCustomerId(null);

            response.setCustomerName("Walk-In");

            response.setCurrentDebt(0.0);
        }

        response.setPhoneNumber(
                sale.getPhoneNumber());

        response.setPaymentMethod(
                sale.getPaymentMethod());

        response.setPaymentStatus(
                sale.getPaymentStatus());

        response.setMpesaReceipt(
                sale.getMpesaReceipt());

        response.setTotal(
                sale.getTotal());

        response.setAmountGiven(
                sale.getAmountGiven());

        response.setBalance(
                sale.getBalance());

        response.setSaleDate(
                sale.getSaleDate());

        response.setMessage(message);

        return response;
    }

    /*
     * ==========================
     * CANCEL PENDING M-PESA SALE
     * ==========================
     */

    @Override
    @Transactional
    public void cancelPendingSale(Long saleId) {

        Sale sale = saleRepository.findById(saleId)
                .orElseThrow(() -> new RuntimeException(
                        "Sale not found."));

        /*
         * Only pending sales can be cancelled.
         */

        if (!"PENDING".equals(
                sale.getPaymentStatus())) {

            throw new RuntimeException(
                    "Only pending sales can be cancelled.");
        }

        /*
         * Restore stock.
         */

        List<SaleItem> items = saleItemRepository.findBySale(sale);

        for (SaleItem item : items) {

            Product product = item.getProduct();

            product.setQuantity(
                    product.getQuantity() +
                            item.getQuantity());

            productRepository.save(product);
        }

        /*
         * Delete sale items.
         */

        saleItemRepository.deleteAll(items);

        /*
         * Delete sale.
         */

        saleRepository.delete(sale);
    }
}
