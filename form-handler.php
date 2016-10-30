<?php

	$email_to = "hassan.corrigan2@student.ncirl.ie";
	$email_subject = "Test from website";
	$thankyou_url = "http://chatwithalex.hassancorrigan.com/index.html";

	$name = $_POST["name"];
	$email_from = $_POST["email"];
	$message = $_POST["message"];

	$headers  = "From: " . $email_from . "\r\n";
	$headers .= "Reply-To: " . $email_from . "\r\n";	// (You can change the reply email address here if you want to.)

	// Now we can construct the email body which will contain the name and message entered by the user
	$message = "Name: ". $name  . "\r\nMessage: " . $message;

	// This is the important ini_set command which sets the sendmail_from address, without this the email won't send.
	ini_set("sendmail_from", $email_from);

	// Now we can send the mail we've constructed using the mail() function.
	// NOTE: You must use the "-f" parameter on Fasthosts' system, without this the email won't send.
	$sent = mail($email_to, $email_subject, $message, $headers, "-f" . $email_from);

	// If the mail() function above successfully sent the mail, $sent will be true.
	if($sent) {
		header("Location: " . $thankyou_url); 	// Redirect customer to thankyou page
	} else {
		// The mail didn't send, display an error.
		echo "There has been an error sending your message. Please try later.";
	}

?>
