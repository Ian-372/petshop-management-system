package com.petshop.backend.settings.service;

import com.petshop.backend.settings.dto.SettingsResponse;
import com.petshop.backend.settings.dto.UpdateSettingsRequest;
import com.petshop.backend.settings.entity.Settings;
import com.petshop.backend.settings.repository.SettingsRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class SettingsServiceImpl implements SettingsService {

    private final SettingsRepository settingsRepository;

    public SettingsServiceImpl(SettingsRepository settingsRepository) {
        this.settingsRepository = settingsRepository;
    }

    private Settings createDefaultSettings() {
        Settings settings = new Settings();

        settings.setBusinessName("PetShop POS");
        settings.setPhone("");
        settings.setEmail("");
        settings.setAddress("");

        settings.setCurrency("KSh");
        settings.setTaxPercentage(0.0);
        settings.setReceiptFooter("Thank you for shopping with us!");
        settings.setAutoPrintReceipt(false);

        settings.setLowStockAlerts(true);
        settings.setDeleteConfirmation(true);
        settings.setSalesNotifications(true);

        return settings;
    }

    @Override
    @Transactional
    public SettingsResponse getSettings() {

        Settings settings = settingsRepository.findAll().stream().findFirst().orElseGet(() -> {
            Settings fresh = createDefaultSettings();
            return settingsRepository.save(fresh);
        });

        return mapToResponse(settings);
    }

    @Override
    @Transactional
    public SettingsResponse updateSettings(UpdateSettingsRequest request) {

        Settings settings = settingsRepository.findAll().stream().findFirst().orElseGet(() -> createDefaultSettings());

        settings.setBusinessName(request.getBusinessName() != null ? request.getBusinessName() : settings.getBusinessName());
        settings.setPhone(request.getPhone() != null ? request.getPhone() : settings.getPhone());
        settings.setEmail(request.getEmail() != null ? request.getEmail() : settings.getEmail());
        settings.setAddress(request.getAddress() != null ? request.getAddress() : settings.getAddress());

        settings.setCurrency(request.getCurrency() != null ? request.getCurrency() : settings.getCurrency());
        settings.setTaxPercentage(request.getTaxPercentage() != null ? request.getTaxPercentage() : settings.getTaxPercentage());
        settings.setReceiptFooter(request.getReceiptFooter() != null ? request.getReceiptFooter() : settings.getReceiptFooter());
        settings.setAutoPrintReceipt(request.getAutoPrintReceipt() != null ? request.getAutoPrintReceipt() : settings.getAutoPrintReceipt());

        settings.setLowStockAlerts(request.getLowStockAlerts() != null ? request.getLowStockAlerts() : settings.getLowStockAlerts());
        settings.setDeleteConfirmation(request.getDeleteConfirmation() != null ? request.getDeleteConfirmation() : settings.getDeleteConfirmation());
        settings.setSalesNotifications(request.getSalesNotifications() != null ? request.getSalesNotifications() : settings.getSalesNotifications());

        settings = settingsRepository.save(settings);

        return mapToResponse(settings);
    }

    private SettingsResponse mapToResponse(Settings settings) {

        SettingsResponse response = new SettingsResponse();

        response.setId(settings.getId());

        response.setBusinessName(settings.getBusinessName());
        response.setPhone(settings.getPhone());
        response.setEmail(settings.getEmail());
        response.setAddress(settings.getAddress());

        response.setCurrency(settings.getCurrency());
        response.setTaxPercentage(settings.getTaxPercentage());
        response.setReceiptFooter(settings.getReceiptFooter());
        response.setAutoPrintReceipt(settings.getAutoPrintReceipt());

        response.setLowStockAlerts(settings.getLowStockAlerts());
        response.setDeleteConfirmation(settings.getDeleteConfirmation());
        response.setSalesNotifications(settings.getSalesNotifications());

        return response;
    }
}