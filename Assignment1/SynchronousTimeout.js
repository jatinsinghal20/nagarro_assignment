function setTimeoutSync(callback, n) {
    var t = Date.now();;
    while(Date.now()<=t+n);
    callback(n);
}

function callback(n) {
    console.log("After "+n/1000+" seconds");
}

setTimeoutSync(callback, 10000);