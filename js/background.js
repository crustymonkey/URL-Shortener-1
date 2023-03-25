let url_base = 'https://t.brk.io';

chrome.runtime.onInstalled.addListener(function() {
    chrome.contextMenus.create({
        id: "short",
        title: "Shorten url",
        type: "normal",
        contexts: ['page', 'link'],
    });
});

chrome.contextMenus.onClicked.addListener(shorten_click);

let offscreen_exists = false;

async function do_post(url="", data={}) {
    const resp = await fetch(url, {
        method: "POST",
        mode: "no-cors",
        headers: {
            "Content-Type": "application/json; charset=utf-8",
            "Accept": "application/json"
        },
        body: JSON.stringify(data) 
    });

    return resp.json();
}

function shorten_click(data, tab) {
    let url = "";
    if (data.linkUrl) {
        console.log("Would shorten link: " + data.linkUrl);
        url = data.linkUrl;
    }
    else {
        console.log("Would shorten page url: " + data.pageUrl);
        url = data.pageUrl;
    }


    chrome.storage.local.get(['ApiToken'], function (result) {
        /*
        const ajax = new XMLHttpRequest();
        ajax.onload = function() {
            res = JSON.parse(this.responseText);
            console.log('Got result from server: ');
            console.log(res);
            if (res.status != "ok") {
                full_url = url_base + "/" + res.short_url;
                console.log("Copying short url to clipboard: " + full_url);
                navigator.clipboard.writeText(full_url);
            } else {
                console.log("Got a failure from the server");
                console.log(res);
            }
        };
        */
        let url = url_base + "/api/url/create/" + result.ApiToken;
        let data = {
            "long_url": url,
            "short": null
        };

        fetch(url, {
            method: "POST",
            //mode: "no-cors",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({
                "long_url": url,
                "short": null
            })
        })
        .then((resp) => resp.json())
        .then((res) => {
            console.log('Got result from server: ');
            console.log(res);
            if (res.status == "ok") {
                let full_url = url_base + "/" + res.short_url;
                if (offscreen_exists) {
                    chrome.runtime.sendMessage({
                        message: "copy",
                        text: full_url
                    });
                } else {
                    offscreen_exists = true;
                    chrome.offscreen.createDocument({
                        url: "offscreen.html",
                        reasons: [chrome.offscreen.Reason.CLIPBOARD],
                        justification: "Write text to the clipboard"
                    }).then(function() {
                        chrome.runtime.sendMessage({
                            message: "copy",
                            text: full_url
                        });
                    });
                }
                
                //navigator.clipboard.writeText(full_url);
            } else {
                console.log("Got a failure from the server");
                console.log(res);
            }
        });
        /*
        ajax.open("POST", url, true);
        ajax.send(JSON.stringify({ 
            "long_url": url,
            "short": null
        }));
        $.ajax({
            type: "POST",
            url: url_base + "/api/url/create/" + result.ApiToken,
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify({ 
                "long_url": url,
                "short": null
            }),
            traditional: true,
            dataType: "json",
            success: function(res) {
                console.log(res);
                if (res.status != "ok") {
                    full_url = url_base + "/" + res.short_url;
                    console.log("Copying short url to clipboard: " + full_url);
                    navigator.clipboard.writeText(full_url);
                } else {
                    console.log("Got a failure from the server");
                    console.log(res);
                }
            },
            error: function(res) {
                console.log(res);
            }
        });
        */
    });

/*
shortUrlTxt.addEventListener('click', () => {
shortUrlTxt.select();    
navigator.clipboard.writeText(shortUrlTxt.value);
});
*/
}