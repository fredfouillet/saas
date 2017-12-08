import {Component, OnInit, Input} from '@angular/core';

@Component({
  selector: 'app-paiement-card',
  templateUrl: './paiementCard.component.html',
  styleUrls: ['./paiementCard.component.css']
})
export class PaiementCardComponent implements OnInit {

  @Input() loading: boolean = false

  constructor(

  ) {
  }


  ngOnInit() {}


}
