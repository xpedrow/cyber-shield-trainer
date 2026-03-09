export interface PasswordAnalysis {
    password: string;
    entropy: number;
    score: number;
    strength: 'MUITO FRACA' | 'FRACA' | 'MODERADA' | 'FORTE' | 'MUITO FORTE';
    crackTime: {
        bruteForce: string;
        dictionary: string;
        botnet: string;
    };
    suggestions: string[];
}
export declare class PasswordSecurityService {
    analyze(password: string): PasswordAnalysis;
    private calculateEntropy;
    private checkDictionary;
    private getStrengthLabel;
    private estimateCrackTime;
    private formatTime;
    private getSuggestions;
    private maskPassword;
}
