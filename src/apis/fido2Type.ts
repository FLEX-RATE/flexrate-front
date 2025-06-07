// components/fido2/fido2Types.ts

export interface RegisterVerificationRequest {
  credentialKey: string;
  rawId?: string;
  clientDataJSON: string;
  attestationObject: string;
  deviceInfo: string;
}


export interface Fido2RegistrationResponse {
  id: string;
  rawId: string;
  type: string;
  response: {
    clientDataJSON: string;
    attestationObject: string;
  };
}
