import { PopoverController, ToastController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
// Calendar UI Module
import { CalendarModule } from 'ion2-calendar';
import { CalendarComponentOptions } from 'ion2-calendar';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { OpenpopPage } from '../openpop/openpop.page';





@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.page.html',
  styleUrls: ['./home-page.page.scss'],
})
export class HomePagePage implements OnInit {
 

  dateMulti: string[];
  type: 'string';
  task: any;
  constructor(
    private router: Router,
    public _route: ActivatedRoute,
    private _data: AuthService,
    private afs: AngularFirestore, 
    public popoverController: PopoverController,
    private toastr: ToastController
 
  ) {}

  ngOnInit() {
    this._data.LogedUser().subscribe((res) => {
      res.uid;

      this.afs
        .collection('tasks', (ref) => ref.where('userID', '==', res.uid))
        .valueChanges({idField: 'id'})
        .subscribe((dat) => {
          console.log(dat);
          this.task = dat;
        });
    });
  }

  optionsMulti: CalendarComponentOptions = {
    pickMode: 'multi',
  };
  //redirect to add task page
  addTask() {
    this.router.navigate(['/add-task-page']);
  }
  logout() {
    this._data.logout();
  }
 
  async presentPopover(ev){
    const popover = await this.popoverController.create({
      component: OpenpopPage,
      cssClass: 'my-custom-class',
      event: ev,
      translucent: true
    });
    await popover.present();
    
  }
  delete(id){
    return this.afs
    .collection('tasks')
    .doc(id)
    .delete()
    .then((resu) => {
     this.toast("Taks Deleted","success")
    })
   
  }
   async toast(message, status) {
    const toast = await this.toastr.create({
      message: message,
      position: 'top',
      color: status,
      duration: 2000,
    });
    toast.present();
  } //end of toast
 
}
