<?php
    $name = $_POST['name'];
    $email = $_POST['email'];
    $message = $_POST['message'];
    $to = 'hassan.corrigan2@student.ncirl.ie';
    $from = 'From: Chat with Alex';
    $subject = 'Contact Form/Bug Fix';

    $body = "From: $name\n E-Mail Address: $email\n Message: $message";

    if (!empty($message)) {
      if (mail ($to, $subject, $body, $from)) {
        header("Location: " . "contact-success.html");
      } else {
  	    header("Location: " . "contact-fail.html");
      }
    }
?>
