import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { PowerState, AmtFeaturesResponse } from './models';
import { environment } from './environment';
@Injectable({
  providedIn: 'root',
})
export class AppService {
  constructor(private readonly http: HttpClient) {}

  setAmtFeatures(deviceId: string): Observable<AmtFeaturesResponse> {
    const payload = {
      userConsent: 'none',
      enableKVM: true,
      enableSOL: true,
      enableIDER: true,
    };
    return this.http
      .post<AmtFeaturesResponse>(
        `https://${environment.server}/api/v1/amt/features/${deviceId}`,
        payload
      )
      .pipe(
        catchError((err) => {
          throw err;
        })
      );
  }

  getPowerState(deviceId: string): Observable<PowerState> {
    return this.http
      .get<PowerState>(
        `https://${environment.server}/api/v1/amt/power/state/${deviceId}`
      )
      .pipe(
        catchError((err) => {
          throw err;
        })
      );
  }

  sendPowerAction(
    deviceId: string,
    action: number,
    useSOL: boolean = false
  ): Observable<any> {
    const payload = {
      method: 'PowerAction',
      action,
      useSOL,
    };
    return this.http
      .post<any>(
        `https://${environment.server}/api/v1/amt/power/action/${deviceId}`,
        payload
      )
      .pipe(
        catchError((err) => {
          throw err;
        })
      );
  }
}
