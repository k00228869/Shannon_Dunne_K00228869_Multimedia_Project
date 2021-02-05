import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent // implements OnInit
{
  title = 'SelfCare Appointments';


// constructor(private http: HttpClient, private update: SwUpdate){
//   this.updateServiceWorker();
// }

// ngOnInit() {
//   this.http.get().subscribe(
//   (res: any) => {
//     this.apiData = res.data;
//   },
// )}



// updateServiceWorker(){
//   if(this.update.isEnabled){
//     console.log('enabled');
//     return 
//   }
//   this.update.available.subscribe((event) => { //check for an update
//   console.log('current', event.current, 'available', event.available);
//   this.update.activateUpdate().then(() => location.reload());
//   });

//  this.update.acivated.subscribe((event) => { //activate an update
//  console.log('current', event.previous, 'available', event.current);
// })
// }
}
