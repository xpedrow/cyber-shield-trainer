import { Injectable } from '@nestjs/common';

export interface PasswordAnalysis {
  password: string;
  entropy: number;
  score: number; // 0 to 100
  strength: 'MUITO FRACA' | 'FRACA' | 'MODERADA' | 'FORTE' | 'MUITO FORTE';
  crackTime: {
    bruteForce: string;
    dictionary: string;
    botnet: string;
  };
  suggestions: string[];
}

@Injectable()
export class PasswordSecurityService {
  analyze(password: string): PasswordAnalysis {
    const entropy = this.calculateEntropy(password);
    const hasDictMatch = this.checkDictionary(password);
    
    let score = Math.min(100, (entropy / 80) * 100);
    if (hasDictMatch) score = Math.max(10, score - 40);
    if (password.length < 8) score = Math.max(5, score - 30);

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

  private calculateEntropy(password: string): number {
    let charsetSize = 0;
    if (/[a-z]/.test(password)) charsetSize += 26;
    if (/[A-Z]/.test(password)) charsetSize += 26;
    if (/[0-9]/.test(password)) charsetSize += 10;
    if (/[^a-zA-Z0-9]/.test(password)) charsetSize += 32;

    if (password.length === 0) return 0;
    // Formula: E = L * log2(R) where L is length and R is charset size
    return password.length * Math.log2(charsetSize);
  }

  private checkDictionary(password: string): boolean {
    const commonPatterns = ['123', 'qwerty', 'admin', 'senha', 'password', 'brasil', '123456', 'aaaaa'];
    const lower = password.toLowerCase();
    return commonPatterns.some(p => lower.includes(p));
  }

  private getStrengthLabel(score: number): any {
    if (score < 20) return 'MUITO FRACA';
    if (score < 40) return 'FRACA';
    if (score < 60) return 'MODERADA';
    if (score < 80) return 'FORTE';
    return 'MUITO FORTE';
  }

  private estimateCrackTime(entropy: number, hasDictMatch: boolean) {
    if (hasDictMatch || entropy < 25) {
      return {
        bruteForce: 'Instantâneo (< 1 sec)',
        dictionary: 'Instantâneo',
        botnet: 'Instantâneo'
      };
    }

    // Rough conversion of entropy bits to time on consumer hardware (approx 10^10 hashes/sec)
    const hashesPerSec = 1e10;
    const seconds = Math.pow(2, entropy) / hashesPerSec;

    return {
      bruteForce: this.formatTime(seconds),
      dictionary: this.formatTime(seconds / 1000), // Dict attacks are faster
      botnet: this.formatTime(seconds / 50000) // Botnets are massive
    };
  }

  private formatTime(seconds: number): string {
    if (seconds < 1) return '< 1 segundo';
    if (seconds < 60) return `${Math.round(seconds)} segundos`;
    if (seconds < 3600) return `${Math.round(seconds / 60)} minutos`;
    if (seconds < 86400) return `${Math.round(seconds / 3600)} horas`;
    if (seconds < 31536000) return `${Math.round(seconds / 86400)} dias`;
    if (seconds < 315360000) return `${Math.round(seconds / 31536000)} anos`;
    return 'Milhares de anos';
  }

  private getSuggestions(password: string, hasDictMatch: boolean): string[] {
    const s = [];
    if (password.length < 12) s.push('Tente aumentar a senha para pelo menos 12 caracteres.');
    if (!/[A-Z]/.test(password)) s.push('Adicione letras MAIÚSCULAS.');
    if (!/[0-9]/.test(password)) s.push('Adicione números.');
    if (!/[^a-zA-Z0-9]/.test(password)) s.push('Adicione caracteres especiais (!@#$).');
    if (hasDictMatch) s.push('Evite sequências comuns (123, qwerty) ou palavras de dicionário.');
    return s;
  }

  private maskPassword(password: string): string {
     return password[0] + '*'.repeat(password.length - 1);
  }
}
