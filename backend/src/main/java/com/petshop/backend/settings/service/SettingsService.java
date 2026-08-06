package com.petshop.backend.settings.service;

import com.petshop.backend.settings.dto.SettingsResponse;
import com.petshop.backend.settings.dto.UpdateSettingsRequest;

public interface SettingsService {

    SettingsResponse getSettings();

    SettingsResponse updateSettings(UpdateSettingsRequest request);

}
