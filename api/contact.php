<?php
/**
 * GIGA SOFT LIMITED — CONTACT & CONSULTATION API
 * Backend Language: PHP 8+ (PDO SQLite & Mail Dispatch)
 * Same architecture as Giga Digital Agency
 */

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods', 'POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if (($_SERVER['REQUEST_METHOD'] ?? '') === 'OPTIONS') {
    http_response_code(200);
    exit;
}

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    http_response_code(405);
    echo json_encode([
        'status' => 'error',
        'message' => 'Method Not Allowed. Only POST requests are accepted.'
    ]);
    exit;
}

require_once __DIR__ . '/../database/db.php';

// Accept both application/json body and standard form-data POST
$rawBody = file_get_contents('php://input');
$json = json_decode($rawBody, true) ?: [];

$name    = trim($json['name'] ?? $_POST['name'] ?? '');
$email   = trim($json['email'] ?? $_POST['email'] ?? '');
$phone   = trim($json['phone'] ?? $_POST['phone'] ?? '');
$service = trim($json['service'] ?? $_POST['service'] ?? '');
$message = trim($json['message'] ?? $json['projectMessage'] ?? $_POST['message'] ?? '');
$pageUrl = trim($json['page_url'] ?? $_SERVER['HTTP_REFERER'] ?? '');

// Validation
$errors = [];
if (empty($name) || mb_strlen($name) < 2) {
    $errors['name'] = 'Full name is required (minimum 2 characters).';
}
if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errors['email'] = 'A valid email address is required.';
}
if (empty($phone) || mb_strlen($phone) < 7) {
    $errors['phone'] = 'A valid phone/WhatsApp number is required.';
}
if (empty($message) || mb_strlen($message) < 5) {
    $errors['message'] = 'Please provide details about your project.';
}

if (!empty($errors)) {
    http_response_code(422);
    echo json_encode([
        'status'  => 'validation_error',
        'message' => 'Please fill out all required fields correctly.',
        'errors'  => $errors
    ]);
    exit;
}

// 1. Store in SQLite & JSON Database
$refId = gsl_save_inquiry([
    'name'     => $name,
    'email'    => $email,
    'phone'    => $phone,
    'service'  => $service,
    'message'  => $message,
    'page_url' => $pageUrl
]);

// 2. Dispatch Email via PHP native mail()
$to = 'info@gigadigitalagency.com';
$subject = "New Consultation Request [$refId] — $name ($service)";

$emailBody = "========================================\r\n";
$emailBody .= "GIGA SOFT LIMITED — NEW CONSULTATION REQUEST\r\n";
$emailBody .= "========================================\r\n\r\n";
$emailBody .= "Reference ID: " . $refId . "\r\n";
$emailBody .= "Client Name:  " . $name . "\r\n";
$emailBody .= "Phone:        " . $phone . "\r\n";
$emailBody .= "Email:        " . $email . "\r\n";
$emailBody .= "Service:      " . $service . "\r\n\r\n";
$emailBody .= "Project Scope:\r\n" . $message . "\r\n\r\n";
$emailBody .= "Submitted:    " . date('Y-m-d H:i:s') . "\r\n";
$emailBody .= "Page:         " . $pageUrl . "\r\n";

$headers = "From: Giga Soft Limited <noreply@gigadigitalagency.com>\r\n";
$headers .= "Reply-To: " . $email . "\r\n";
$headers .= "X-Mailer: PHP/" . phpversion();

@mail($to, $subject, $emailBody, $headers);

// Return JSON response
http_response_code(200);
echo json_encode([
    'status'       => 'success',
    'reference_id' => $refId,
    'message'      => "Thank you, {$name}! Your consultation inquiry (Ref #{$refId}) has been successfully submitted."
]);
