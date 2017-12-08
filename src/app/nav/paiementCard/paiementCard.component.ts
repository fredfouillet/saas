import {Component, OnInit, Input} from '@angular/core';
import { DataSource } from '../../companie/single/paiement/paiement.model';

@Component({
  selector: 'app-paiement-card',
  templateUrl: './paiementCard.component.html',
  styleUrls: ['./paiementCard.component.css']
})
export class PaiementCardComponent implements OnInit {

  @Input() newCard: DataSource = new DataSource()
  
  constructor(

  ) {
  }


  ngOnInit() {}


}
