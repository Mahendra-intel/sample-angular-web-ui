import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { KvmModule } from 'ang-ui-toolkit/dist/kvm';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SharedModule } from './shared-module';
import { DialogContentComponent } from './shared/dialog-content/dialog-content.component';
import { AppService } from './app.service';
import { environment } from './environment';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthorizeInterceptor } from './authorize.interceptor';
@NgModule({
  declarations: [AppComponent, DialogContentComponent],
  imports: [
    HttpClientModule,
    BrowserModule,
    AppRoutingModule,
    KvmModule.forRoot(environment),
    SharedModule.forRoot(),
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [
    AppService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthorizeInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
