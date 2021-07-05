export interface PowerState {
  powerstate: number;
}

export interface AmtFeaturesResponse {
  userConsent: string;
  redirection: boolean;
  KVM: boolean;
  SOL: boolean;
  IDER: boolean;
}
