"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const getDateTime = () => {
    const currentDate = new Date();
    const day = currentDate.getDate();
    const month = currentDate.getMonth() + 1;
    const year = currentDate.getFullYear();
    const hours = currentDate.getHours();
    const minutes = currentDate.getMinutes();
    const seconds = currentDate.getSeconds();
    const formattedDate = year +
        '-' +
        (month < 10 ? '0' + month : month) +
        (day < 10 ? '0' + day : day) +
        (hours < 10 ? '0' + hours : hours) +
        (minutes < 10 ? '0' + minutes : minutes) +
        (seconds < 10 ? '0' + seconds : seconds);
    return formattedDate;
};
exports.default = getDateTime;
//# sourceMappingURL=getDate.js.map