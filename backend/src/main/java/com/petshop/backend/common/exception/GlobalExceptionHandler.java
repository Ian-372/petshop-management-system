package com.petshop.backend.common.exception;

import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.HandlerMethodValidationException;

import java.time.Instant;
import java.util.LinkedHashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiError> handleValidation(MethodArgumentNotValidException exception,
                                                     HttpServletRequest request) {
        Map<String, String> fieldErrors = new LinkedHashMap<>();
        exception.getBindingResult().getAllErrors().forEach(error -> {
            String field = error instanceof FieldError fieldError ? fieldError.getField() : error.getObjectName();
            fieldErrors.put(field, error.getDefaultMessage());
        });
        return response(HttpStatus.BAD_REQUEST, "Request validation failed.", request, fieldErrors);
    }

    @ExceptionHandler({HandlerMethodValidationException.class, HttpMessageNotReadableException.class})
    public ResponseEntity<ApiError> handleBadRequest(Exception exception, HttpServletRequest request) {
        return response(HttpStatus.BAD_REQUEST, "The request is invalid or malformed.", request, null);
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<ApiError> handleConflict(DataIntegrityViolationException exception,
                                                    HttpServletRequest request) {
        return response(HttpStatus.CONFLICT, "This operation conflicts with existing data.", request, null);
    }

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<ApiError> handleRuntime(RuntimeException exception, HttpServletRequest request) {
        HttpStatus status = statusFor(exception.getMessage());
        if (status.is5xxServerError()) {
            log.error("Unhandled application error for {}", request.getRequestURI(), exception);
            return response(status, "An unexpected server error occurred.", request, null);
        }
        return response(status, exception.getMessage(), request, null);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiError> handleUnexpected(Exception exception, HttpServletRequest request) {
        log.error("Unhandled server error for {}", request.getRequestURI(), exception);
        return response(HttpStatus.INTERNAL_SERVER_ERROR, "An unexpected server error occurred.", request, null);
    }

    private HttpStatus statusFor(String message) {
        String value = message == null ? "" : message.toLowerCase();
        if (value.contains("not found")) return HttpStatus.NOT_FOUND;
        if (value.contains("invalid username or password")) return HttpStatus.UNAUTHORIZED;
        if (value.contains("already exists")) return HttpStatus.CONFLICT;
        if (value.contains("insufficient") || value.contains("not enough")
                || value.contains("already awarded") || value.contains("has no customer")) return HttpStatus.BAD_REQUEST;
        return HttpStatus.INTERNAL_SERVER_ERROR;
    }

    private ResponseEntity<ApiError> response(HttpStatus status, String message,
                                               HttpServletRequest request, Map<String, String> fieldErrors) {
        ApiError body = new ApiError(Instant.now(), status.value(), status.getReasonPhrase(),
                message, request.getRequestURI(), fieldErrors);
        return ResponseEntity.status(status).body(body);
    }
}
