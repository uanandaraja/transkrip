$(document).ready(function() {
    $('form').submit(function(event) {
        event.preventDefault();
        var form_data = new FormData(this);
        var result = $('#result');
        var progress_bar = $('.progress-bar');
        var progress = $('.progress');
        var spinner = $('.spinner-border');
        var pleaseWait = $('#pleaseWait');
        var copyButton = $('#copyButton');

        var startTime = new Date().getTime();
        
        result.val('');
        progress_bar.css('width', '0%');
        spinner.show();
        pleaseWait.show();
        copyButton.hide();
        result.hide();

        $("#copyButton").click(function() {
            var copyText = document.getElementById("result");
            copyText.select();
            copyText.setSelectionRange(0, 99999);
            document.execCommand("copy");
        });
        
        $.ajax({
            xhr: function() {
                var xhr = new window.XMLHttpRequest();
                xhr.upload.addEventListener('progress', function(evt) {
                    if (evt.lengthComputable) {
                        var percentComplete = evt.loaded / evt.total;
                        percentComplete = parseInt(percentComplete * 100);
                        progress_bar.css('width', percentComplete + '%');
                    }
                }, false);
                return xhr;
            },
            url: '/transcribe',
            type: 'POST',
            data: form_data,
            contentType: false,
            cache: false,
            processData: false,
            success: function(response) {
                var endTime = new Date().getTime(); // Get the current time again
                var transcriptionTime = (endTime - startTime) / 1000; // Calculate the time difference
                transcriptionTime = transcriptionTime.toFixed(2); // Round to 2 decimal places
                console.log(response);
                console.log(result);
                result.val(response);
                $('#transcriptionTime').text("Transcription time: " + transcriptionTime + " seconds");
                $('#hasil-transkripsi').show();
                // After transcription is complete, show the result in the modal
                $('#hasil-transkripsi').val(result.result);
                var time = (Date.now() - startTime) / 1000;
                $('#transcriptionTime').text('Transcription time: ' + time + ' seconds');
                $('#transcriptionModal').modal('show');
                spinner.hide();
                pleaseWait.hide();
                result.show();
                copyButton.show();
            },
            error: function(xhr, status, error) {
                result.val('Error: ' + xhr.responseText);
                progress.hide();
                spinner.hide();
                pleaseWait.hide();
            }
        });
    });
});