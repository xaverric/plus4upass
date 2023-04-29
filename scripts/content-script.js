function fillContent(tab) {
    console.log("executed content script")

    read(getHostname(tab)).then(credentials => {
        const accessCode1Element = document.querySelector("input[name='accessCode1']");
        const accessCode2Element = document.querySelector("input[name='accessCode2']");
        accessCode1Element.value = credentials.ac1;
        accessCode2Element.value = credentials.ac2;
    
        accessCode1Element.dispatchEvent(
            new Event("input", { bubbles: true, cancelable: true })
        );
        accessCode2Element.dispatchEvent(
            new Event("input", { bubbles: true, cancelable: true })
        );
    })
   
}

function getHostname(tab) {
    let value = new URL(tab.url).hostname;
    console.log(value);
    return value;
}

const read = async (key) => {
    let value = await chrome.storage.sync.get([key]);
    return value[key];
}