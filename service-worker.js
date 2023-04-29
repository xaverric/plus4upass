chrome.contextMenus.removeAll();
chrome.contextMenus.create({
    id: "plus4uPassFill",
    title: "+4uPass Autofill",
    contexts: ["all"]
});

chrome.contextMenus.onClicked.addListener(function (info, tab) {
    if (tab) {
        console.log("clicked");
        chrome.scripting.executeScript(
            {
                target: {tabId: tab.id, allFrames: true},
                files: ['./scripts/content-script.js']
            },
            () => {
                chrome.scripting.executeScript({
                    target: {tabId: tab.id, allFrames: true},
                    args: [tab],
                    func: (...args) => fillContent(...args),
                });
            });
    }
});