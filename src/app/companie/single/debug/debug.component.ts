import { Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import { CompanieService} from '../../companie.service';
import { Companie } from '../../companie.model';

@Component({
  selector: 'app-debug',
  templateUrl: './debug.component.html',
})
export class DebugComponent implements OnInit {
  @Input() fetchedCompanie: Companie = new Companie()

  constructor(
    private companieService: CompanieService,
  ) { }

  ngOnInit() {}
  sendPassword(password: string) {
    console.log(password)
    this.companieService.sendPassword(password)
      .subscribe(
        res => {
          console.log(res)
          // this.fetchedCompanie = res.obj
          // this.saved.emit(res.obj)
          //  this.router.navigate(['companie/' + res.obj._id])
        },
        error => {console.log(error)}
      )
  }


}
