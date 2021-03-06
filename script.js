// api.ai - HTML+JS API offered by service.
/* Below is a tweaked API script taken from:
https://github.com/sitepoint-editors/Api-AI-Personal-Assistant-Demo
I've further editied it from the original version */
  var accessToken = "ad2458e9d7764998a03ddffe1332ab1e",
    baseUrl = "https://api.api.ai/v1/",
    $speechInput,
    $recBtn,
    recognition,
    messageRecording = "Recording...",
    messageCouldntHear = "I couldn't hear you, could you say that again?",
    messageInternalError = "Oh no, there has been an internal server error",
    messageSorry = "I'm sorry, I don't have the answer to that yet.";

  $(document).ready(function() {
    $speechInput = $("#speech");
    $recBtn = $("#rec");

    $speechInput.keypress(function(event) {
      if (event.which == 13) {
        event.preventDefault();
        send();
      }
    });
    $recBtn.on("click", function(event) {
      switchRecognition();
    });
  });

  function startRecognition() {
    recognition = new webkitSpeechRecognition();
    recognition.continuous = false;
        recognition.interimResults = false;

    recognition.onstart = function(event) {
      respond(messageRecording);
      updateRec();
    };
    recognition.onresult = function(event) {
      recognition.onend = null;

      var text = "";
        for (var i = event.resultIndex; i < event.results.length; ++i) {
          text += event.results[i][0].transcript;
        }
        setInput(text);
      stopRecognition();
    };
    recognition.onend = function() {
      respond(messageCouldntHear);
      stopRecognition();
    };
    recognition.lang = "en-US";
    recognition.start();
  }

  function stopRecognition() {
    if (recognition) {
      recognition.stop();
      recognition = null;
    }
    updateRec();
  }

  function switchRecognition() {
    if (recognition) {
      stopRecognition();
    } else {
      startRecognition();
    }
  }

  function setInput(text) {
    $speechInput.val(text);
    send();
  }

/*  function updateRec() {
    $recBtn.text(recognition ? "Stop" : "Speak");
  } */

  function send() {
    var text = $speechInput.val();
    $.ajax({
      type: "POST",
      url: baseUrl + "query/",
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      headers: {
        "Authorization": "Bearer " + accessToken
      },
      data: JSON.stringify({ query: text, lang: "en", sessionId: "somerandomthing" }),

      success: function(data) {
        prepareResponse(data);
      },
      error: function() {
        respond(messageInternalError);
      }
    });
  }

  function prepareResponse(val) {
    var debugJSON = JSON.stringify(val, undefined, 2),
      speechResponse = val.result.speech;

    respond(speechResponse);
    debugRespond(debugJSON);
  }

  function debugRespond(val) {
    $("#response").text(val);
  }

  function respond(val) {
    if (val == "") {
      val = messageSorry;
    }

    if (val !== messageRecording) {
      var msg = new SpeechSynthesisUtterance();
      msg.voiceURI = "native";
      msg.text = val;
      msg.lang = "en-US";
      window.speechSynthesis.speak(msg);
    }

    $("#speechResponse").addClass("is-active").find(".response-text").html(val);
    document.getElementById('speech').value=null; // Clears input text after submit.
  }

// Menu toggle
function openNav() {
    document.getElementById("nav").style.height = "100%";
}
function closeNav() {
    document.getElementById("nav").style.height = "0%";
}

// Validates the contact form
function validateForm() {
    var msg = document.forms["contact"]["message"].value;
    if (msg == null || msg == "") {
      alert("Please enter a message")
      return false;
    }
}
// Js function that shows voice input only for suported browsers.
function voiceInput() {

  var isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
  if (isChrome) {
    console.log("Voice input available");
  } else {
    console.log("Voice input unavailable");
    document.getElementById('rec').style.display="none";
  }
};

$(document).ready(function() {
  $('.container').fadeIn(800);
  $('#suggested-questions').click(function() {
    $("#questions-div").slideToggle(800);
    $('html, body').animate({
        scrollTop: $("#questions-div").offset().top
    }, 2000);
  })
  $('#questions-close').click(function() {
    $("#questions-div").slideUp(800);
  })
});
