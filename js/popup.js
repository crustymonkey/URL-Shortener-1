let longUrlTxt = document.querySelector("#longUrl");
let createBtn = document.querySelector("#create");
let shortUrlTxt = document.querySelector("#shortUrl");
let longUrlErrorDiv = document.querySelector("#longUrldiv");
let longUrlErrorlbl = document.querySelector("#longUrlError");
let successMsgToast = document.querySelector("#successMsg");
let errorMsgToast = document.querySelector(".toast-error");
let loader = document.querySelector('.loading');
let url_base = "https://t.brk.io";

chrome.tabs.query({active: true, lastFocusedWindow: true}, tabs => {
    // By default, set the url to be shortened to the current tab's url
    let cur_url = tabs[0].url;
    console.log(cur_url);
    $("#longUrl").val(cur_url);
});

createBtn.addEventListener('click', () => {
    if(longUrlTxt.value){
        longUrlErrorDiv.classList.remove('has-error');
        longUrlErrorlbl.classList.remove("d-visible");
        longUrlErrorlbl.classList.add("d-hide");
        errorMsgToast.classList.add("d-hide");
        successMsgToast.classList.add("d-hide");
        loader.classList.remove('d-hide');
        console.log("in create");

        chrome.storage.local.get(['ApiToken'], function (result) {
            $.ajax({
                type: "POST",
                url: url_base + "/api/url/create/" + result.ApiToken,
                contentType: "application/json; charset=utf-8",
                data: JSON.stringify({ 
                    "long_url": longUrlTxt.value,
                    "short": null
                }),
                traditional: true,
                dataType: "json",
                success: function(res) {
                    console.log(res);
                    if (res.status != "ok") {
                        loader.classList.add('d-hide');
                        errorMsgToast.classList.remove("d-hide");
                        errorMsgToast.textContent = res.message;
                    }
                    else {
                        shortUrlTxt.classList.remove('d-hide');
                        loader.classList.add('d-hide');                
                        successMsgToast.classList.remove("d-hide");
                        shortUrlTxt.value= url_base + "/" + res.short_url;
                        longUrlTxt.value="";
                    }
                },
                error: function(res) {
                    console.log(res);
                    loader.classList.add('d-hide');
                    errorMsgToast.classList.remove("d-hide");
                    errorMsgToast.textContent = error;
                }
            });
        })
    }
    else{
        longUrlErrorDiv.classList.add('has-error');
        longUrlErrorlbl.classList.remove("d-hide");
        longUrlErrorlbl.classList.add("d-visible");        
    }
});

shortUrlTxt.addEventListener('click', () => {
    shortUrlTxt.select();    
    document.execCommand("copy");
});