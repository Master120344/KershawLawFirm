<?php
// Set content type for JSON response
header("Content-Type: application/json");

// Get input data
$data = json_decode(file_get_contents("php://input"), true);

// Validate input data
if (!$data || !isset($data['subject'], $data['message'], $data['email'])) {
    echo json_encode(["status" => "error", "message" => "Invalid data received."]);
    exit;
}

// Sanitize input
$to = "support@myrealsurveys.com";
$subject = filter_var($data["subject"], FILTER_SANITIZE_FULL_SPECIAL_CHARS);
$message = filter_var($data["message"], FILTER_SANITIZE_FULL_SPECIAL_CHARS);
$from = filter_var($data["email"], FILTER_VALIDATE_EMAIL);

// Check for valid email
if (!$from) {
    echo json_encode(["status" => "error", "message" => "Invalid email address."]);
    exit;
}

// Set email headers
$headers = "From: no-reply@kershawlawfirm.com\r\n";
$headers .= "Reply-To: " . $from . "\r\n";
$headers .= "MIME-Version: 1.0\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";
$headers .= "X-Mailer: PHP/" . phpversion();

// Attempt to send email
if (mail($to, $subject, $message, $headers)) {
    echo json_encode(["status" => "success", "message" => "Email sent successfully."]);
} else {
    // Log error (optional - uncomment to enable logging)
    error_log("Email to $to failed. Subject: $subject. From: $from");

    echo json_encode(["status" => "error", "message" => "Failed to send email. Please check server mail configuration."]);
}
?>