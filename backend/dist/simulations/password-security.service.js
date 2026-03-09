"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PasswordSecurityService = void 0;
const common_1 = require("@nestjs/common");
let PasswordSecurityService = class PasswordSecurityService {
    analyze(password) {
        const entropy = this.calculateEntropy(password);
        const hasDictMatch = this.checkDictionary(password);
        let score = Math.min(100, (entropy / 80) * 100);
        if (hasDictMatch)
            score = Math.max(10, score - 40);
        if (password.length < 8)
            score = Math.max(5, score - 30);
        const strength = this.getStrengthLabel(score);
        const crackTime = this.estimateCrackTime(entropy, hasDictMatch);
        const suggestions = this.getSuggestions(password, hasDictMatch);
        return {
            password: this.maskPassword(password),
            entropy: Math.round(entropy),
            score: Math.round(score),
            strength,
            crackTime,
            suggestions
        };
    }
    calculateEntropy(password) {
        let charsetSize = 0;
        if (/[a-z]/.test(password))
            charsetSize += 26;
        if (/[A-Z]/.test(password))
            charsetSize += 26;
        if (/[0-9]/.test(password))
            charsetSize += 10;
        if (/[^a-zA-Z0-9]/.test(password))
            charsetSize += 32;
        if (password.length === 0)
            return 0;
        return password.length * Math.log2(charsetSize);
    }
    checkDictionary(password) {
        const commonPatterns = ['123', 'qwerty', 'admin', 'senha', 'password', 'brasil', '123456', 'aaaaa'];
        const lower = password.toLowerCase();
        return commonPatterns.some(p => lower.includes(p));
    }
    getStrengthLabel(score) {
        if (score < 20)
            return 'MUITO FRACA';
        if (score < 40)
            return 'FRACA';
        if (score < 60)
            return 'MODERADA';
        if (score < 80)
            return 'FORTE';
        return 'MUITO FORTE';
    }
    estimateCrackTime(entropy, hasDictMatch) {
        if (hasDictMatch || entropy < 25) {
            return {
                bruteForce: 'Instantâneo (< 1 sec)',
                dictionary: 'Instantâneo',
                botnet: 'Instantâneo'
            };
        }
        const hashesPerSec = 1e10;
        const seconds = Math.pow(2, entropy) / hashesPerSec;
        return {
            bruteForce: this.formatTime(seconds),
            dictionary: this.formatTime(seconds / 1000),
            botnet: this.formatTime(seconds / 50000)
        };
    }
    formatTime(seconds) {
        if (seconds < 1)
            return '< 1 segundo';
        if (seconds < 60)
            return `${Math.round(seconds)} segundos`;
        if (seconds < 3600)
            return `${Math.round(seconds / 60)} minutos`;
        if (seconds < 86400)
            return `${Math.round(seconds / 3600)} horas`;
        if (seconds < 31536000)
            return `${Math.round(seconds / 86400)} dias`;
        if (seconds < 315360000)
            return `${Math.round(seconds / 31536000)} anos`;
        return 'Milhares de anos';
    }
    getSuggestions(password, hasDictMatch) {
        const s = [];
        if (password.length < 12)
            s.push('Tente aumentar a senha para pelo menos 12 caracteres.');
        if (!/[A-Z]/.test(password))
            s.push('Adicione letras MAIÚSCULAS.');
        if (!/[0-9]/.test(password))
            s.push('Adicione números.');
        if (!/[^a-zA-Z0-9]/.test(password))
            s.push('Adicione caracteres especiais (!@#$).');
        if (hasDictMatch)
            s.push('Evite sequências comuns (123, qwerty) ou palavras de dicionário.');
        return s;
    }
    maskPassword(password) {
        return password[0] + '*'.repeat(password.length - 1);
    }
};
exports.PasswordSecurityService = PasswordSecurityService;
exports.PasswordSecurityService = PasswordSecurityService = __decorate([
    (0, common_1.Injectable)()
], PasswordSecurityService);
//# sourceMappingURL=password-security.service.js.map