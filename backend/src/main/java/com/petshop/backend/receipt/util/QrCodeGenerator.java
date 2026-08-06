package com.petshop.backend.receipt.util;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.EncodeHintType;
import com.google.zxing.MultiFormatWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.client.j2se.MatrixToImageWriter;

import java.io.ByteArrayOutputStream;
import java.util.HashMap;
import java.util.Map;
import org.springframework.stereotype.Component;

@Component
public class QrCodeGenerator {

    public byte[] generateQrCode(String receiptNumber) {

        try {

            Map<EncodeHintType, Object> hints = new HashMap<>();

            hints.put(
                    EncodeHintType.MARGIN,
                    1);

            BitMatrix matrix = new MultiFormatWriter().encode(

                    receiptNumber,
                    BarcodeFormat.QR_CODE,
                    220,
                    220,
                    hints);

            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();

            MatrixToImageWriter.writeToStream(

                    matrix,
                    "PNG",
                    outputStream);

            return outputStream.toByteArray();

        } catch (Exception e) {

            throw new RuntimeException(
                    "Unable to generate QR Code.",
                    e);

        }

    }
}