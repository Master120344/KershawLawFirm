<?php
header("Content-Type: application/json");

// Get the input data
$data = json_decode(file_get_contents("php://input"), true);

// Extract data
$to = "support@myrealsurveys.com"; // Your destination email
$subject = $data["subject"] ?? "New Inquiry from Kershaw Law Firm";
$message = $data["message"] ?? "No message provided";
$from = $data["email"] ?? "no-reply@kershawlawfirm.com";

// Set headers
$headers = "From: no-reply@kershawlawfirm.com" . "\r\n" .
           "Reply-To: " . $from . "\r\n" .
           "Content-Type: text/plain; charset=UTF-8";

// Attempt to send the email
if (mail($to, $subject, $message, $headers)) {
    echo json_encode(["status" => "success", "message" => "Email sent successfully."]);
} else {
    echo json_encode(["status" => "error", "message" => "Failed to send email."]);
}
?>
