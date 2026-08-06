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

    @Override
    @Transactional
    public SettingsResponse getSettings() {

        Settings settings;

        if (settingsRepository.count() == 0) {

            settings = new Settings();

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

            settings = settingsRepository.save(settings);

        } else {

            settings = settingsRepository.findAll().get(0);

        }

        return mapToResponse(settings);
    }

    @Override
    @Transactional
    public SettingsResponse updateSettings(UpdateSettingsRequest request) {

        Settings settings = settingsRepository.findAll().get(0);

        settings.setBusinessName(request.getBusinessName());
        settings.setPhone(request.getPhone());
        settings.setEmail(request.getEmail());
        settings.setAddress(request.getAddress());

        settings.setCurrency(request.getCurrency());
        settings.setTaxPercentage(request.getTaxPercentage());
        settings.setReceiptFooter(request.getReceiptFooter());
        settings.setAutoPrintReceipt(request.getAutoPrintReceipt());

        settings.setLowStockAlerts(request.getLowStockAlerts());
        settings.setDeleteConfirmation(request.getDeleteConfirmation());
        settings.setSalesNotifications(request.getSalesNotifications());

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