chrome.runtime.onMessage.addListener(function(req, sender, send_resp) {
    console.log("got a message");
    console.log(req);

    if (req.message === "copy") {
        navigator.clipboard.writeText(req.text);
    }
});