import {Component, OnInit, Input, Output, EventEmitter, OnChanges} from '@angular/core';
import { Address } from './address.model';


@Component({
  selector: 'app-address',
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.css']
})
export class AddressComponent implements OnInit {

  @Input() addresses: Address[] = []

  constructor(

  ) {}

  ngOnInit() {}

  newAddress() {
    const newAddress = new Address()
    this.addresses.push(newAddress)
  }
  removeAddress(i) {
    this.addresses.splice(i, 1);
  }
  moveAddress(i: number, incremet: number) {
      // if(i>=0 && i<=this.fetchedUser.profile.address.length + incremet) {
      // console.log(i, incremet, this.fetchedUser.profile.address.length)
      if (!(i === 0 && incremet < 0) && !(i === this.addresses.length - 1 && incremet > 0)  )    {
        const tmp = this.addresses[i];
        this.addresses[i] = this.addresses[i + incremet]
        this.addresses[i + incremet] = tmp
        // this.save(false)
        // console.log(this.fetchedUser.profile.address)
      }
    }
  // selectRight(right: Right) {
  //   this.fetchedUser.rights = [right]
  // }

  // selectOwnerCompanies(companie: Companie) {
  //   this.fetchedUser.ownerCompanies = [companie]
  // }

}
