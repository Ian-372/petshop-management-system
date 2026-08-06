package com.petshop.backend.settings.controller;

import com.petshop.backend.settings.dto.SettingsResponse;
import com.petshop.backend.settings.dto.UpdateSettingsRequest;
import com.petshop.backend.settings.service.SettingsService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/settings")
public class SettingsController {

    private final SettingsService settingsService;

    public SettingsController(SettingsService settingsService) {
        this.settingsService = settingsService;
    }

    @GetMapping
    public SettingsResponse getSettings() {

        return settingsService.getSettings();

    }

    @PutMapping
    public SettingsResponse updateSettings(
            @RequestBody UpdateSettingsRequest request) {

        return settingsService.updateSettings(request);

    }

}
