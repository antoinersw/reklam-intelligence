"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const getDateTime = () => {
    var currentDate = new Date();
    var day = currentDate.getDate();
    var month = currentDate.getMonth() + 1;
    var year = currentDate.getFullYear();
    var hours = currentDate.getHours();
    var minutes = currentDate.getMinutes();
    var seconds = currentDate.getSeconds();
    var formattedDate = year + "-" +
        (month < 10 ? "0" + month : month) +
        (day < 10 ? "0" + day : day) +
        (hours < 10 ? "0" + hours : hours) +
        (minutes < 10 ? "0" + minutes : minutes) +
        (seconds < 10 ? "0" + seconds : seconds);
    return formattedDate;
};
exports.default = getDateTime;
//# sourceMappingURL=getDate.js.map