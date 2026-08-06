package com.petshop.backend.payment.util;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;
import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
import java.util.Base64;
import java.util.Date;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

@Component
public class MpesaUtil {

        @Value("${mpesa.consumerKey}")
        private String consumerKey;

        @Value("${mpesa.consumerSecret}")
        private String consumerSecret;

        @Value("${mpesa.shortCode}")
        private String shortCode;

        @Value("${mpesa.passKey}")
        private String passKey;

        @Value("${mpesa.callbackUrl}")
        private String callbackUrl;

        private final RestTemplate restTemplate = new RestTemplate();

        private String generateTimestamp() {

                return new SimpleDateFormat("yyyyMMddHHmmss")
                                .format(new Date());

        }

        private String generatePassword(String timestamp) {

                String value = shortCode + passKey + timestamp;

                return Base64.getEncoder()
                                .encodeToString(
                                                value.getBytes(StandardCharsets.UTF_8));
        }

        private String generateAccessToken() {
                try {

                        System.out.println(
                                        java.net.InetAddress
                                                        .getByName("sandbox.safaricom.co.ke"));

                } catch (Exception e) {

                        e.printStackTrace();

                }

                String credentials = consumerKey + ":" + consumerSecret;

                String encodedCredentials = Base64.getEncoder()
                                .encodeToString(
                                                credentials.getBytes(StandardCharsets.UTF_8));

                org.springframework.http.HttpHeaders headers = new org.springframework.http.HttpHeaders();

                headers.set(
                                "Authorization",
                                "Basic " + encodedCredentials);

                org.springframework.http.HttpEntity<String> entity = new org.springframework.http.HttpEntity<>(headers);

                String url = "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials";

                org.springframework.http.ResponseEntity<java.util.Map> response = restTemplate.exchange(
                                url,
                                org.springframework.http.HttpMethod.GET,
                                entity,
                                java.util.Map.class);

                return response.getBody()
                                .get("access_token")
                                .toString();

        }

        public String sendStkPush(
                        Long saleId,
                        String phoneNumber,
                        Double amount) {

                String accessToken = generateAccessToken();

                String timestamp = generateTimestamp();

                String password = generatePassword(timestamp);

                org.springframework.http.HttpHeaders headers = new org.springframework.http.HttpHeaders();

                headers.setBearerAuth(accessToken);

                headers.setContentType(
                                org.springframework.http.MediaType.APPLICATION_JSON);

                java.util.Map<String, Object> body = new java.util.HashMap<>();

                body.put("BusinessShortCode", shortCode);
                body.put("Password", password);
                body.put("Timestamp", timestamp);
                body.put("TransactionType", "CustomerPayBillOnline");
                body.put("Amount", amount.intValue());
                body.put("PartyA", phoneNumber);
                body.put("PartyB", shortCode);
                body.put("PhoneNumber", phoneNumber);
                body.put("CallBackURL", callbackUrl);
                body.put("AccountReference", "SALE-" + saleId);
                body.put("TransactionDesc", "Pet Shop Purchase");

                org.springframework.http.HttpEntity<java.util.Map<String, Object>> entity = new org.springframework.http.HttpEntity<>(
                                body, headers);

                String url = "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest";

                org.springframework.http.ResponseEntity<String> response = restTemplate.postForEntity(
                                url,
                                entity,
                                String.class);

                ObjectMapper mapper = new ObjectMapper();

                try {

                        JsonNode json = mapper.readTree(response.getBody());

                        return json.get("CheckoutRequestID").asText();

                } catch (Exception e) {

                        throw new RuntimeException(
                                        "Unable to read Safaricom response.",
                                        e);

                }

        }
}
