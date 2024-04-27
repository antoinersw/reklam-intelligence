"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const facebook_module_1 = require("./facebook.module");
require("dotenv/config");
const api_key_guard_1 = require("./api-key.guard");
const config_1 = require("@nestjs/config");
function bootstrap() {
    return __awaiter(this, void 0, void 0, function* () {
        const app = yield core_1.NestFactory.create(facebook_module_1.FacebookModule);
        app.enableCors();
        app.useGlobalGuards(new api_key_guard_1.ApiKeyGuard(new config_1.ConfigService()));
        yield app.listen(3000);
    });
}
bootstrap();
//# sourceMappingURL=main.js.map