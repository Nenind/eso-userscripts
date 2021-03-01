// ==UserScript==
// @name        ESO Title Message
// @namespace   tttooottt
// @version     0.1.6
// @author      tttooottt
// @description Display current amount of messages in chat in title(tab)
// @include     *://*.esonline.tk/
// @grant       unsafeWindow
// @updateURL   https://github.com/questionableprofile/eso-userscripts/raw/master/title-message/title-message.user.js
// @downloadURL https://github.com/questionableprofile/eso-userscripts/raw/master/title-message/title-message.user.js
// @license     MIT
// ==/UserScript==

const MessageEvents = [
    'chat', 'tryMessage', 'userRoll', 'diceResult'
];

const ConnectEvent = 'serverTimecode';
const DisconnectEvent = 'esoDisconnected';

const taskQueue = [];

var messagesCount = 0;

function updateTitle() {
    document.title = messagesCount ? `(${messagesCount}) ESO` : "ESO";
}

function updateMessagesCount(timeout) {
    messagesCount++;
    var id = setTimeout(function () {
        messagesCount--;
        updateTitle();
        taskQueue.shift();
    }, timeout);
    taskQueue.push(id);
}

function initMod() {
    const chatTimeout = unsafeWindow.esoConfig.chatMsgClearTimeout;
    
    function messagesHandler(event) {
        const isMuted = unsafeWindow._muted && unsafeWindow._muted.find(
            mutedPlayer => mutedPlayer.id == event.detail.sender);
        if(isMuted) return;
        
        updateMessagesCount(chatTimeout);
        updateTitle();
    }

    MessageEvents.map(eventCode => document.addEventListener(eventCode, messagesHandler));

    document.addEventListener(DisconnectEvent, () => {
        document.removeEventListener(ConnectEvent, initMod);
        MessageEvents.map(eventCode => document.removeEventListener(eventCode, messagesHandler));
        taskQueue.map(id => clearTimeout(id));
    }, { 'once': true })
}

document.addEventListener(ConnectEvent, initMod, {
    'once': true
});
