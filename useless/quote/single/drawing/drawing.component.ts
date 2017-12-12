import { Component, ElementRef, OnInit, ViewChild, Input, Output, EventEmitter } from '@angular/core';
// import { SignaturePad } from '../angular2-signaturepad/signature-pad';
import { Drawing } from './drawing.model';
import {CanvasWhiteboardComponent} from 'ng2-canvas-whiteboard';


@Component({
  selector: 'app-drawing',
  viewProviders: [CanvasWhiteboardComponent],
  templateUrl: './drawing.component.html',
  styleUrls: ['./drawing.component.css']
})

export class DrawingComponent implements OnInit {
  // @ViewChild(SignaturePad) signaturePad: SignaturePad;
  // @ViewChild('signaturePadClass') elementView: ElementRef;
  @ViewChild('canvasWhiteboard') canvasWhiteboard: CanvasWhiteboardComponent;

  // @ViewChild('signaturePadClass') elementView: ElementRef;
  imgSignatureBase64Temp: string[] = []
  @Input() drawing: Drawing;
  // @Input() base64: string = '';
  @Output() updated: EventEmitter<any> = new EventEmitter();
  editMode: boolean = false
  color: string = ''
  // signaturePadOptions = { // passed through to szimek/signature_pad constructor
  //   minWidth: 1,
  //   maxWidth: 3,
  //   canvasWidth: 600,
  //   canvasHeight: 425,
  //   penColor: "#292b2c",
  // };



  constructor() { }


  toDataURL(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.onload = function() {
      var reader = new FileReader();
      reader.onloadend = function() {
        callback(reader.result);
      }
      reader.readAsDataURL(xhr.response);
    };
    xhr.open('GET', url);
    xhr.responseType = 'blob';
    xhr.send();
  }




  ngOnInit() {


    // let this2 = this
    //
    // setTimeout(function(){
    //   this2.signaturePad.fromDataURL(this2.base64)
    // }, 100);
  }
  getPicture() {
    this.drawing.backgroundForms.forEach(form => {
      let this2=this;
      this.toDataURL('./uploads/forms/' + form.owner + '/' + form.imagePath, function(dataUrl) {
        this2.drawing.base64 = dataUrl
        // console.log(dataUrl)
      })
    })
  }
  ngOnChanges() {
    // this.imgSignatureBase64Temp.push(this.base64)
  }
  ngAfterViewInit() {
    // console.log(this.elementView.nativeElement.offsetWidth);
    // console.log(this.elementView.nativeElement.offsetWidth)
    // this.signaturePad.set('minWidth', 1); // set szimek/signature_pad options at runtime
    // this.signaturePad.set('canvasWidth', this.elementView.nativeElement.offsetWidth); // set szimek/signature_pad options at runtime
    // this.signaturePad.clear(); // invoke functions from szimek/signature_pad API

  }
  changeSlider() {
    this.drawing.base64 = this.canvasWhiteboard.generateCanvasDataUrl()
    this.canvasWhiteboard.toggleShouldDraw();
    // console.log('aa')
    // this.signaturePad.fromDataURL(this.base64)
    // if(!this.editMode) return
    // // let this2 = this
    // // setTimeout(function(){
    // this.signaturePad.fromDataURL(this.drawing.base64)
    // }, 5);

  }
  changeColor(color: string) {
    this.canvasWhiteboard.changeColor(color);
    this.color = color;
    // this.signaturePadOptions.penColor = color;
    // this.signaturePad.set('penColor', color);
  }
  clearDrawing() {
    // this.signaturePad.clear();
    this.canvasWhiteboard.clearCanvas();
    this.drawing.base64 = ''
  }
  redoVersion() {
    this.canvasWhiteboard.redo();
  }
  undoVersion() {
    this.canvasWhiteboard.undo();
    // console.log(this.canvasWhiteboard.generateCanvasDataUrl());

    // this.imgSignatureBase64Temp.pop();
    // this.signaturePad.clear();
    // this.signaturePad.fromDataURL(this.imgSignatureBase64Temp[this.imgSignatureBase64Temp.length - 1]);
    // // this.base64 = this.signaturePad.toDataURL();
    // this.saved.emit(this.signaturePad.toDataURL('image/png', 1))
  }
  drawComplete() {
    // will be notified of szimek/signature_pad's onEnd event
    // console.log(this.signaturePad.toDataURL());
    // this.imgSignatureBase64Temp.push( this.signaturePad.toDataURL('image/png', 1) )
    // this.base64 = this.signaturePad.toDataURL();
    // this.saved.emit(this.signaturePad.toDataURL('image/png', 1))

  }
  sendBatchUpdate(result) {
    // this.imgSignatureBase64Temp.push(this.canvasWhiteboard.generateCanvasDataUrl())
    // this.saved.emit(this.canvasWhiteboard.generateCanvasDataUrl())
    // console.log(result)
    this.updated.emit(this.canvasWhiteboard.generateCanvasDataUrl())
  }
  // saveDrawing() {
  //   // this.updated.emit(this.canvasWhiteboard.generateCanvasDataUrl())
  // }
  downloadDrawing() {
    this.canvasWhiteboard.downloadCanvasImage()
  }
  changeSize(event) {
    // this.signaturePadOptions.minWidth = event.value;
    // this.signaturePad.set('minWidth', event.value);
    // this.signaturePad.set('maxWidth', event.value + 2);
  }
  drawStart() {
    // will be notified of szimek/signature_pad's onBegin event
    // console.log('begin drawing');
  }

}
