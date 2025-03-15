<?php
header("Content-Type: application/json");

// Retrieve the JSON input
$data = json_decode(file_get_contents("php://input"), true);

// Extract data
$to = "support@myrealsurveys.com";  // Your email address
$subject = $data["subject"];
$message = $data["message"];
$headers = "From: no-reply@kershawlawfirm.com" . "\r\n" . // Change this domain if needed
           "Reply-To: " . $data["to"] . "\r\n" .
           "Content-Type: text/plain; charset=UTF-8";

// Send email
if (mail($to, $subject, $message, $headers)) {
    echo json_encode(["status" => "success", "message" => "Email sent successfully."]);
} else {
    echo json_encode(["status" => "error", "message" => "Failed to send email."]);
}
?>
