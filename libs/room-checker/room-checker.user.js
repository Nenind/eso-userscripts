// ==UserScript==
// @name        ESO Room Checker
// @namespace   tttooottt
// @version     0.1.0
// @author      tttooottt
// @description Get current users in room
// @updateURL   https://github.com/questionableprofile/eso-userscripts/raw/master/libs/room-checker/room-checker.user.js
// @downloadURL https://github.com/questionableprofile/eso-userscripts/raw/master/libs/room-checker/room-checker.user.js
// @license     MIT
// ==/UserScript==

const RoomEventHandlers = {
    'nodeData': (event, that) => { that.users = event.detail.users },
    'userJoin': (event, that) => { that.users.push(event.detail.user) },
    'userLeave': (event, that) => { that.users = that.users.filter(user => user.id != event.detail.id) }
};

class ESORoomChecker {
    users;
    
    constructor() {
        this.users = [];
        
        Object.keys(RoomEventHandlers).map(eventCode => {
            document.addEventListener(eventCode, (event) => {
                RoomEventHandlers[eventCode](event, this);
            });
        });
    }
}
