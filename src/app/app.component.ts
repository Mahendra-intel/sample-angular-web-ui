import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { interval, of } from 'rxjs';
import { catchError, mergeMap } from 'rxjs/operators';
import { AppService } from './app.service';
import { environment } from './environment';
import { DialogContentComponent } from './shared/dialog-content/dialog-content.component';
import SnackbarDefaults from './snackBarDefault';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'test-ang';
  @Input() deviceState: number = 0;
  private deviceConnection: EventEmitter<boolean> = new EventEmitter<boolean>(
    true
  );
  @Output() private selectedEncoding: EventEmitter<number> = new EventEmitter<number>()
  isLoading: boolean = false;
  isPoweredOn: boolean = false;
  powerState: any = 0;
  deviceId: string = environment.deviceId;
  readyToLoadKVM: boolean = false;
  timeInterval!: any;

  encodings = [
    { value: 1, viewValue: 'RLE 8' },
    { value: 2, viewValue: 'RLE 16' },
  ];

  constructor(
    public dialog: MatDialog,
    public snackBar: MatSnackBar,
    private readonly deviceService: AppService
  ) {}

  checkPowerStatus(): boolean {
    return this.powerState.powerstate === 2;
  }

  ngOnInit(): void {
    this.deviceService
      .setAmtFeatures(this.deviceId)
      .pipe(
        catchError(() => {
          this.snackBar.open(
            `Error enabling kvm`,
            undefined,
            SnackbarDefaults.defaultError
          );
          return of();
        })
      )
      .subscribe(() => {
        this.deviceService
          .getPowerState(this.deviceId)
          .pipe(
            catchError(() => {
              this.snackBar.open(
                `Error retrieving power status`,
                undefined,
                SnackbarDefaults.defaultError
              );
              return of();
            })
          )
          .subscribe((data) => {
            this.powerState = data;
            this.isPoweredOn = this.checkPowerStatus();
            if (!this.isPoweredOn) {
              this.isLoading = false;
              const dialog = this.dialog.open(DialogContentComponent);
              dialog.afterClosed().subscribe((result) => {
                if (result) {
                  this.isLoading = true;
                  this.deviceService
                    .sendPowerAction(this.deviceId, 2)
                    .pipe()
                    .subscribe((data) => {
                      setTimeout(() => {
                        this.isLoading = false;
                        this.readyToLoadKVM = true;
                      }, 4000);
                    });
                }
              });
            } else {
              setTimeout(() => {
                this.isLoading = false;
                this.readyToLoadKVM = true;
              }, 4000);
            }
          });
      });
    this.timeInterval = interval(15000)
      .pipe(mergeMap(() => this.deviceService.getPowerState(this.deviceId)))
      .subscribe();
  }

  connectionStatus = (value): void => {
    this.deviceConnection.emit(value);
  };

  deviceStatus = (event): void => {
    this.deviceState = event;
  };

  onEncodingChange = (e:any) => {
   this.selectedEncoding.emit(e)
  };
}
