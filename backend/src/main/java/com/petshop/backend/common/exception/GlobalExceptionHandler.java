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

    private static final Logger log =
            LoggerFactory.getLogger(GlobalExceptionHandler.class);

    /**
     * Validation errors
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiError> handleValidation(
            MethodArgumentNotValidException exception,
            HttpServletRequest request) {

        Map<String, String> fieldErrors = new LinkedHashMap<>();

        exception.getBindingResult()
                .getAllErrors()
                .forEach(error -> {

                    String field = error instanceof FieldError fieldError
                            ? fieldError.getField()
                            : error.getObjectName();

                    fieldErrors.put(field, error.getDefaultMessage());
                });

        return response(
                HttpStatus.BAD_REQUEST,
                "Request validation failed.",
                request,
                fieldErrors
        );
    }

    /**
     * Malformed request / invalid JSON / method validation errors
     */
    @ExceptionHandler({
            HandlerMethodValidationException.class,
            HttpMessageNotReadableException.class
    })
    public ResponseEntity<ApiError> handleBadRequest(
            Exception exception,
            HttpServletRequest request) {

        log.warn(
                "Bad request on {}: {}",
                request.getRequestURI(),
                exception.getMessage()
        );

        return response(
                HttpStatus.BAD_REQUEST,
                "The request is invalid or malformed.",
                request,
                null
        );
    }

    /**
     * Database constraint violations
     */
    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<ApiError> handleConflict(
            DataIntegrityViolationException exception,
            HttpServletRequest request) {

        log.error(
                "Database integrity error on {}: {}",
                request.getRequestURI(),
                exception.getMessage(),
                exception
        );

        return response(
                HttpStatus.CONFLICT,
                "This operation conflicts with existing data.",
                request,
                null
        );
    }

    /**
     * Runtime application errors
     *
     * IMPORTANT:
     * The actual exception message is temporarily returned to the client.
     * This is useful for diagnosing the current Railway login problem.
     */
    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<ApiError> handleRuntime(
            RuntimeException exception,
            HttpServletRequest request) {

        log.error(
                "UNHANDLED APPLICATION ERROR on {}: {}",
                request.getRequestURI(),
                exception.getMessage(),
                exception
        );

        HttpStatus status = statusFor(exception.getMessage());

        String message = exception.getMessage();

        if (message == null || message.isBlank()) {
            message = "An unexpected server error occurred.";
        }

        return response(
                status,
                message,
                request,
                null
        );
    }

    /**
     * Any other unexpected exception
     *
     * IMPORTANT:
     * The actual exception message is temporarily returned so we can
     * diagnose the problem instead of receiving only a generic 500.
     */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiError> handleUnexpected(
            Exception exception,
            HttpServletRequest request) {

        log.error(
                "UNHANDLED SERVER ERROR on {}: {}",
                request.getRequestURI(),
                exception.getMessage(),
                exception
        );

        String message = exception.getMessage();

        if (message == null || message.isBlank()) {
            message = "An unexpected server error occurred.";
        }

        return response(
                HttpStatus.INTERNAL_SERVER_ERROR,
                message,
                request,
                null
        );
    }

    /**
     * Convert known application error messages into appropriate HTTP statuses.
     */
    private HttpStatus statusFor(String message) {

        String value = message == null
                ? ""
                : message.toLowerCase();

        if (value.contains("not found")) {
            return HttpStatus.NOT_FOUND;
        }

        if (value.contains("invalid username or password")) {
            return HttpStatus.UNAUTHORIZED;
        }

        if (value.contains("already exists")) {
            return HttpStatus.CONFLICT;
        }

        if (value.contains("insufficient")
                || value.contains("not enough")
                || value.contains("already awarded")
                || value.contains("has no customer")) {

            return HttpStatus.BAD_REQUEST;
        }

        return HttpStatus.INTERNAL_SERVER_ERROR;
    }

    /**
     * Build the standard API error response.
     */
    private ResponseEntity<ApiError> response(
            HttpStatus status,
            String message,
            HttpServletRequest request,
            Map<String, String> fieldErrors) {

        ApiError body = new ApiError(
                Instant.now(),
                status.value(),
                status.getReasonPhrase(),
                message,
                request.getRequestURI(),
                fieldErrors
        );

        return ResponseEntity
                .status(status)
                .body(body);
    }
}
