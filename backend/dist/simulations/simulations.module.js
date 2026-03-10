"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SimulationsModule = void 0;
const common_1 = require("@nestjs/common");
const phishing_service_1 = require("./phishing.service");
const password_security_service_1 = require("./password-security.service");
const social_engineering_service_1 = require("./social-engineering.service");
const network_attack_service_1 = require("./network-attack.service");
const insider_threat_service_1 = require("./insider-threat.service");
const sql_injection_service_1 = require("./sql-injection.service");
const simulations_controller_1 = require("./simulations.controller");
const events_module_1 = require("../events/events.module");
let SimulationsModule = class SimulationsModule {
};
exports.SimulationsModule = SimulationsModule;
exports.SimulationsModule = SimulationsModule = __decorate([
    (0, common_1.Module)({
        imports: [events_module_1.EventsModule],
        controllers: [simulations_controller_1.SimulationsController],
        providers: [
            phishing_service_1.PhishingService,
            password_security_service_1.PasswordSecurityService,
            social_engineering_service_1.SocialEngineeringService,
            network_attack_service_1.NetworkAttackService,
            insider_threat_service_1.InsiderThreatService,
            sql_injection_service_1.SqlInjectionService
        ],
        exports: [
            phishing_service_1.PhishingService,
            password_security_service_1.PasswordSecurityService,
            social_engineering_service_1.SocialEngineeringService,
            network_attack_service_1.NetworkAttackService,
            insider_threat_service_1.InsiderThreatService,
            sql_injection_service_1.SqlInjectionService
        ],
    })
], SimulationsModule);
//# sourceMappingURL=simulations.module.js.map