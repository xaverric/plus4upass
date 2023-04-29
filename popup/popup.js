const save = async () => {
    const ac1 = document.getElementById("accessCode1").value;
    const ac2 = document.getElementById("accessCode2").value;
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    store(getHostname(tab), { ac1, ac2 })
}

const fill = async () => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    const credentialsValue = await read(getHostname(tab));
    await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: (credentials) => {
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
        },
        args: [credentialsValue]
    });
}

const getHostname = (tab) => {
    let value = new URL(tab.url).hostname; 
    console.log(value);
    return value;
}

const store = async (key, value) => {
    await chrome.storage.sync.set({ [key]: {...value, timeStamp: Date.now()} });
    await renderSavedList();
}

const read = async (key) => {
    let value = await chrome.storage.sync.get([key]);
    return value[key];
}

const renderSavedList = async () => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    const credentialsValue = await read(getHostname(tab));
    
    const savedListElement = document.querySelector("#savedList");
    const paragraph  = document.createElement("p");
    if (credentialsValue) {
        paragraph.innerText = `${getHostname(tab)} stored on ${new Date(credentialsValue.timeStamp)}}`
        savedListElement.appendChild(paragraph);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    var confirmSaveNewAccessCodesButton = document.getElementById('confirmSaveNewAccessCodesButton');
    var fillValueButton = document.getElementById('fillValueButton');

    confirmSaveNewAccessCodesButton.addEventListener('click', save);
    fillValueButton.addEventListener('click', fill);
});

renderSavedList().then(() => {});