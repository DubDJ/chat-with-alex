/* Tweaked API script from:
https://github.com/sitepoint-editors/Api-AI-Personal-Assistant-Demo */
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

  function updateRec() {
    $recBtn.text(recognition ? "Stop" : "Speak");
  }

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
      data: JSON.stringify({q: text, lang: "en"}),

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
    document.getElementById('speech').value=null;
  }
