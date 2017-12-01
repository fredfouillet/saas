var Notification = require('../models/notification.model'),
  User = require('../models/user.model'),
  TypeRights = require('../models/typeRights.const'),
  User = require('../models/user.model'),
  Quote = require('../models/quote.model'),
  Companie = require('../models/companie.model'),
  pdf = require('html-pdf');

options = {
  format: 'Letter',
  "header": {
    "height": "70px"
  },
  "footer": {
    "height": "0px"
  },
  "border": "10px"
};

module.exports = {

  generatePDF (req, res, next) {
    return new Promise(function(resolve, reject) {

      User.findOne({_id: req.user._id}).exec(function(err, user) {
        if (err) {
          return res.status(403).json({title: 'There was a problem', error: err})
        }

        if (!user) {
          return res.status(404).json({
            title: 'No form found',
            error: {
              message: 'Item not found!'
            }
          });
        }

        Companie.findById(user.ownerCompanies[0]).populate({path: 'forms', model: 'Form'}).populate({path: 'rights', model: 'Right'}).exec(function(err, companie) {
          if (err) {
            return res.status(404).json({message: '', err: err})
          }
          if (!companie) {
            return res.status(404).json({
              title: 'No obj found',
              error: {
                message: 'Obj not found!'
              }
            })
          } else {

            Quote.findById((req.params.quoteId), function(err, obj) {
              if (err) {
                return res.status(500).json({message: 'An error occured', err: err})
              }
              if (!obj) {
                return res.status(404).json({
                  title: 'No form found',
                  error: {
                    message: 'Form not found!'
                  }
                })
              }

              // let findQuery = {}
              // findQuery['_id'] = req.params.id
              Quote.findById({_id: req.params.quoteId}).populate({
                path: 'projects',
                model: 'Project',
                populate: {
                  path: 'assignedTos',
                  model: 'User'
                }
              }).populate({path: 'signature.users', model: 'User'}).populate({path: 'clients', model: 'User'}).populate({
                path: 'devisDetails.bucketProducts.productInit',
                model: 'Product',
                populate: {
                  path: 'forms',
                  model: 'Form'
                }
              }).exec(function(err, item) {
                if (err) {
                  return res.status(404).json({message: '', err: err})
                }
                if (!item) {
                  return res.status(404).json({
                    title: 'No obj found',
                    error: {
                      message: 'Obj not found!'
                    }
                  })
                } else {

                  var html = ''
                  html += `
                     <style type="text/css">

                           .col-1 {
                             width: 8.33%;
                           }
                           .col-2 {
                             width: 16.66%;
                           }
                           .col-3 {
                             width: 25%;
                           }
                           .col-4 {
                             width: 33.33%;
                           }
                           .col-5 {
                             width: 41.66%;
                           }
                           .col-6 {
                             width: 50%;
                           }
                           .col-7 {
                             width: 58.33%;
                           }
                           .col-8 {
                             width: 66.66%;
                           }
                           .col-9 {
                             width: 75%;
                           }
                           .col-10 {
                             width: 83.33%;
                           }
                           .col-11 {
                             width: 91.66%;
                           }
                           .col-12 {
                             width: 100%;
                           }
                           .img {
                             height: 20px;
                           }
                           .imgSignature {
                             height: 45px;
                           }
                           .imglogo {
                             height: 50px;
                             text-align: center;
                            display: block;
                            margin-left: auto;
                            margin-right: auto
                           }
                           .tabo {
                             border: 1px solid #ddd;
                           }
                           .bgh {
                             background-color: #595959;
                             color: white;
                             border: 1px solid #ddd;
                           }

                           .bghFree {
                             background-color: #595959;
                             color: #595959;
                             border: 1px solid #ddd;
                           }
                           .desc {
                             text-align: left;
                           }
                           .elem {
                             text-align: center;
                             font-size: 9px;
                           }
                           .smallSize {
                             font-size: 9px;
                           }
                           .titleGooplus1 {
                             font-size: 11px;
                           }
                           .alright {
                             text-align: right;
                           }
                           .inf {
                             font-size: 10px;
                           }
                           .inf2 {
                             font-size: 9px;
                           }
                           .nobo {
                             border-top: none!important;
                             border-bottom: none!important;
                           }
                           .cobo {
                             border: 1px solid #ddd;
                           }
                           table {
                             border-collapse: collapse;
                             width: 100%;
                           }



                           td {

                             height: 20px;
                             vertical-align: center;
                             border-left: 1px solid #ddd;
                             border-right: 1px solid #ddd;
                           }
                           th {
                             /*font-size: 10px;*/
                           }
                            .cgv {
                             font-size: 6px;
                            text-align: center!important;
                           }
                            p  {
                             font-size: 9px;
                              font-weight: 300;
                           }
                           .ts {
                             background-color: #aba4a4;
                             font-weight: bold;
                           }
                           #pageHeader {
                             width:100%;
                             height: 50px;
                          }
                          .avoid {
                              page-break-inside: avoid !important;
                              margin: 4px 0 4px 0;  /* to keep the page break from cutting too close to the text in the div */
                            }
                         #pageBody {height: 0px;}
                         .test2 {margin-bottom: -50px; }
                     </style>
                     `
                  html += `
                  <div id="pageHeader" class="col-12">
                    <img class="imglogo" src="http://belmard-renovation.fr/wp-content/uploads/2017/10/belmard_logo_100.png">
                  </div>
                  <table class="print-friendly">
                           <thead>
                             <tr>
                               <th class="col-4 cobo desc">
                               <p><b>Belmard Bâtiment</b></p>
                               <p>30, rue Belgrand</p>
                               <p>75020 Paris</p>
                               <p>Tel : 01.40.33.88.33</p>
                               <p>Mail : Belmard.batiment@gmail.com</p>
                               </th>
                               <th class="col-4 nobo"></th>
                               <th class="col-4 cobo desc">`

                  item.clients.forEach(user => {

                    html += '<p><b>'
                    html += user.profile.title + ' ' + user.profile.name + ' ' + user.profile.lastName
                    html += '</b></p>'
                    user.profile.address.forEach(singleAddress => {
                      if (singleAddress.nameAddress === 'billing') {
                        html += '<p>'
                        html += singleAddress.address + ' ' + singleAddress.address2
                        html += '</p>'
                        html += '<p>'
                        html += singleAddress.city + ' ' + singleAddress.state
                        html += '</p>'
                        html += '<p>'
                        html += singleAddress.zip + ' ' + singleAddress.country
                        html += '</p>'
                      }
                    })

                    html += '<p>'
                    html += 'Tel : ' + user.profile.phoneNumber
                    html += '</p><p>'
                    html += 'Mail : ' + user.email
                    html += '</p>'
                  })

                  html += `
                               </th>
                             </tr>
                           </thead>
                         </table>
                         <br>
                         <table>
                           <thead>
                             <tr>
                               <th class="col-12 cobo desc smallSize">Objet : ` + item.name + `
                               </th>
                             </tr>
                           </thead>
                         </table>
                         <br>
                         <table class="tabo">
                           <thead>
                             <tr>
                               <th class="col-5 bgh titleGooplus1">Description</th>
                               <th class="col-1 bgh titleGooplus1">Image</th>
                               <th class="col-1 bgh titleGooplus1">Price_Unit</th>
                               <th class="col-1 bgh titleGooplus1">Quantity</th>
                               <th class="col-1 bgh titleGooplus1">Unit</th>
                               <th class="col-1 bgh titleGooplus1">Total_tax_excl</th>
                               <th class="col-2 bgh titleGooplus1">Tax</th>
                             </tr>
                           </thead>
                           <tbody>`
                  item.devisDetails.forEach(devisDetail => {
                    html += '<tr class="ts">'
                    html += '<td class="desc elem">' + devisDetail.nameBucketProducts + '</td>'
                    html += `
                               <td class="desc"></td>
                               <td class="desc"></td>
                               <td class="desc"></td>
                               <td class="desc"></td>
                               <td class="desc"></td>
                               <td class="desc"></td>
                            </tr>`
                    devisDetail.bucketProducts.forEach(bucketProduct => {
                      html += '<tr>'
                      let description = ''
                      let img = ''
                      let unit = ''
                      if (bucketProduct.typeRow === 'text') {
                        description = bucketProduct.title
                      }
                      if (bucketProduct.typeRow === 'product') {
                        bucketProduct.productInit.forEach(product => {
                          description = product.details.referenceName
                          unit = product.details.unit
                          product.forms.forEach(form => {
                            img = '<img class="img" src="' + 'http://localhost/uploads/forms/' + form.owner + '/' + form.imagePath + '">'
                          })
                        })
                      }
                      html += '<td class="desc"><div class="avoid elem">' + description + '</div></td>'
                      html += '<td class="elem">' + img + '</td>'
                      // html += '<td class="desc">' + bucketProduct.typeRow + '</td>'
                      // html += '<td class="elem">' + bucketProduct.title + '</td>'
                      html += '<td class="elem">' + unit + '</td>'
                      html += '<td class="elem">' + bucketProduct.quantity + '</td>'
                      html += '<td class="elem">' + bucketProduct.priceWithoutTaxes + '</td>'
                      html += '<td class="elem">' + bucketProduct.priceWithQuantity + '</td>'
                      html += '<td class="elem">' + bucketProduct.vat + '%</td>'
                      html += '</tr>'

                    })
                  })

                  html += `
                           </tbody>
                         </table>

                         <br>
                         <table class="cobo">
                             <tr class="cobo">
                               <td class="col-6 alright"></td>`

                  item.priceQuote.priceQuoteTaxes.forEach(priceQuoteTaxe => {
                    html += `<td class="col-2 ts elem">TVA: ` + priceQuoteTaxe.VAT + `%</td>`
                    // html += `<td class="col-2 ts elem">` + priceQuoteTaxe.TotalVAT + `€</td>`
                  })

                  //  <td class="col-2 ts elem">TVA 5.5%</td>
                  //  <td class="col-2 ts elem">TVA 10%</td>
                  html += `
                                <td class="col-2 ts elem"><b>TOTAL</b></td>
                               </tr>
                               <tr class="cobo">
                                <td class="col-6 alright ts elem">Sous-Total HT</td>`

                  item.priceQuote.priceQuoteTaxes.forEach(priceQuoteTaxe => {
                    //  html += `<td class="col-2 ts elem">TVA: ` + priceQuoteTaxe.VAT + `%</td>`
                    html += `<td class="col-2 elem">` + Math.round(priceQuoteTaxe.TotalVAT / (priceQuoteTaxe.VAT / 100)) + `€</td>`
                  })
                  html += `
                                <td class="col-2 elem"><b>` + Math.round(item.priceQuote.priceQuoteWithoutTaxes) + `€</b></td>
                               </tr>`

                  html += `<tr class="cobo">
                                 <td class="col-6 alright ts elem">Montant de TVA</td>`
                  let vatTotal = 0
                  item.priceQuote.priceQuoteTaxes.forEach(priceQuoteTaxe => {
                    vatTotal += priceQuoteTaxe.TotalVAT * 1
                    //  html += `<td class="col-2 ts elem">TVA: ` + priceQuoteTaxe.VAT + `%</td>`
                    html += `<td class="col-2 elem">` + Math.round(priceQuoteTaxe.TotalVAT) + `€</td>`
                    //  html += `<td class="col-2 elem">` + priceQuoteTaxe.VAT + priceQuoteTaxe.TotalVAT / (priceQuoteTaxe.VAT /100) + `€</td>`
                  })
                  html += `
                             <td class="col-2 elem"><b>` + Math.round(vatTotal) + `€</b></td>
                           </tr>
                           <tr class="cobo">
                            <td class="col-6 alright ts elem"><b>TOTAL TTC</b></td>`

                  item.priceQuote.priceQuoteTaxes.forEach(priceQuoteTaxe => {
                    //  html += `<td class="col-2 ts elem">TVA: ` + priceQuoteTaxe.VAT + `%</td>`
                    html += `<td class="col-2 elem">` + Math.round(priceQuoteTaxe.TotalVAT / (priceQuoteTaxe.VAT / 100) + priceQuoteTaxe.TotalVAT * 1) + `€</td>`
                  })
                  html += `
                               <td class="col-2 elem"><b>` + Math.round(item.priceQuote.priceQuoteWithTaxes) + `€</b></td>
                             </tr>
                         </table>
                         <br>`

                  html += `<table class="cobo">
                               <tr class="cobo">
                               <td class="col-6 alright ts elem">Acompte à la commande 40% </td>
                               <td class="col-6 alright elem">=40% du total ttc</td>
                               </tr>
                               <tr class="cobo">
                               <td class="col-6 alright ts elem">Acompte intermédiaire</td>
                               <td class="col-6 alright elem">sur avancement</td>
                               </tr>
                               <tr class="cobo">
                               <td class="col-6 alright ts elem"><b>Solde</b></td>
                               <td class="col-6 alright elem"><b>à la livraison</b></td>
                             </tr>
                         </table>
                         <br>`

                  html += `
                         <table>
                           <thead>
                             <tr>
                               <th class="col-3 desc">
                               <p>Entreprise</p>
                               <p class="inf2">Lu et approuvé</p>
                               <p class="inf2">Le</p>
                             </th>
                             <th class="col-6 nobo"></th>
                             <th class="col-3 desc">
                               <p>Client : `
                  item.clients.forEach(user => {
                    html += user.profile.title + ' ' + user.profile.name + ' ' + user.profile.lastName
                  })
                  html += `</p><p class="inf2">Lu et approuvé</p>`

                  if (item.drawingSignature.base64)
                    html += `<img class="imgSignature" src="${item.drawingSignature.base64}" />`

                  html += `<p class="inf2">Le `
                  if (item.drawingSignature.dateSignature)
                    html += item.drawingSignature.dateSignature.toLocaleDateString("fr-FR")

                  html += `</p></th>
                             </tr>
                           </thead>
                         </table>
                      <br>
                      <a class="cgv">Ce devis est valable 3 mois. Les prix sont établis sur la base des taux en vigeur à la date de remise de l'offre et toute variation ultérieure de ces taux sera répercutée sur ces prix en application du Code Général des Impôts</a>
                        `

                  pdf.create(html, options).toFile('./server/uploads/pdf/' + req.params.quoteId + '.pdf', function(err, resPDF) {
                    if (err) {
                      //return res.status(404).json({message: '', err: err})

                      reject(err)
                    } else {
                      resolve(req.params.quoteId)

                    }
                  })

                }
              })
            })

          }
        })
      })
    })
  },

  generatePaiementQuotePDF (req, res, next) {
    return new Promise(function(resolve, reject) {

      User.findOne({_id: req.user._id}).exec(function(err, user) {
        if (err) {
          return res.status(403).json({title: 'There was a problem', error: err})
        }

        if (!user) {
          return res.status(404).json({
            title: 'No form found',
            error: {
              message: 'Item not found!'
            }
          });
        }

        // Companie.findById(user.ownerCompanies[0]).populate({path: 'forms', model: 'Form'}).populate({path: 'rights', model: 'Right'}).exec(function(err, companie) {
        //   if (err) {
        //     return res.status(404).json({message: '', err: err})
        //   }
        //   if (!companie) {
        //     return res.status(404).json({
        //       title: 'No obj found',
        //       error: {
        //         message: 'Obj not found!'
        //       }
        //     })
        //   } else {

            // Quote.findById((req.params.quoteId), function(err, obj) {
            //   if (err) {
            //     return res.status(500).json({message: 'An error occured', err: err})
            //   }
            //   if (!obj) {
            //     return res.status(404).json({
            //       title: 'No form found',
            //       error: {
            //         message: 'Form not found!'
            //       }
            //     })
            //   }

              // let findQuery = {}
              // findQuery['_id'] = req.params.id
              // Quote.findById({_id: req.params.quoteId}).populate({
              //   path: 'projects',
              //   model: 'Project',
              //   populate: {
              //     path: 'assignedTos',
              //     model: 'User'
              //   }
              // }).populate({path: 'signature.users', model: 'User'}).populate({path: 'clients', model: 'User'}).populate({
              //   path: 'devisDetails.bucketProducts.productInit',
              //   model: 'Product',
              //   populate: {
              //     path: 'forms',
              //     model: 'Form'
              //   }
              // }).exec(function(err, item) {
              //   if (err) {
              //     return res.status(404).json({message: '', err: err})
              //   }
              //   if (!item) {
              //     return res.status(404).json({
              //       title: 'No obj found',
              //       error: {
              //         message: 'Obj not found!'
              //       }
              //     })
              //   } else {

                  var html = ''
                  html += `
                     <style type="text/css">

                           .col-1 {
                             width: 8.33%;
                           }
                           .col-2 {
                             width: 16.66%;
                           }
                           .col-3 {
                             width: 25%;
                           }
                           .col-4 {
                             width: 33.33%;
                           }
                           .col-5 {
                             width: 41.66%;
                           }
                           .col-6 {
                             width: 50%;
                           }
                           .col-7 {
                             width: 58.33%;
                           }
                           .col-8 {
                             width: 66.66%;
                           }
                           .col-9 {
                             width: 75%;
                           }
                           .col-10 {
                             width: 83.33%;
                           }
                           .col-11 {
                             width: 91.66%;
                           }
                           .col-12 {
                             width: 100%;
                           }
                           .img {
                             height: 20px;
                           }
                           .imgSignature {
                             height: 45px;
                           }
                           .imglogo {
                             height: 50px;
                             text-align: center;
                            display: block;
                            margin-left: auto;
                            margin-right: auto
                           }
                           .tabo {
                             border: 1px solid #ddd;
                           }
                           .bgh {
                             background-color: #595959;
                             color: white;
                             border: 1px solid #ddd;
                           }

                           .bghFree {
                             background-color: #595959;
                             color: #595959;
                             border: 1px solid #ddd;
                           }
                           .desc {
                             text-align: left;
                           }
                           .elem {
                             text-align: center;
                             font-size: 9px;
                           }
                           .smallSize {
                             font-size: 9px;
                           }
                           .titleGooplus1 {
                             font-size: 11px;
                           }
                           .alright {
                             text-align: right;
                           }
                           .inf {
                             font-size: 10px;
                           }
                           .inf2 {
                             font-size: 9px;
                           }
                           .nobo {
                             border-top: none!important;
                             border-bottom: none!important;
                           }
                           .cobo {
                             border: 1px solid #ddd;
                           }
                           table {
                             border-collapse: collapse;
                             width: 100%;
                           }



                           td {

                             height: 20px;
                             vertical-align: center;
                             border-left: 1px solid #ddd;
                             border-right: 1px solid #ddd;
                           }
                           th {
                             /*font-size: 10px;*/
                           }
                            .cgv {
                             font-size: 6px;
                            text-align: center!important;
                           }
                            p  {
                             font-size: 9px;
                              font-weight: 300;
                           }
                           .ts {
                             background-color: #aba4a4;
                             font-weight: bold;
                           }
                           #pageHeader {
                             width:100%;
                             height: 50px;
                          }
                          .avoid {
                              page-break-inside: avoid !important;
                              margin: 4px 0 4px 0;  /* to keep the page break from cutting too close to the text in the div */
                            }
                         #pageBody {height: 0px;}
                         .test2 {margin-bottom: -50px; }
                     </style>
                     `
                  html += `
                  <div id="pageHeader" class="col-12">
                    <img class="imglogo" src="http://belmard-renovation.fr/wp-content/uploads/2017/10/belmard_logo_100.png">
                  </div>
                  <table class="print-friendly">
                           <thead>
                             <tr>
                               <th class="col-4 cobo desc">
                               <p><b>Belmard Bâtiment</b></p>
                               <p>30, rue Belgrand</p>
                               <p>75020 Paris</p>
                               <p>Tel : 01.40.33.88.33</p>
                               <p>Mail : Belmard.batiment@gmail.com</p>
                               </th>
                               <th class="col-4 nobo"></th>
                               <th class="col-4 cobo desc">`

                  // item.clients.forEach(user => {
                  //
                  //   html += '<p><b>'
                  //   html += user.profile.title + ' ' + user.profile.name + ' ' + user.profile.lastName
                  //   html += '</b></p>'
                  //   user.profile.address.forEach(singleAddress => {
                  //     if (singleAddress.nameAddress === 'billing') {
                  //       html += '<p>'
                  //       html += singleAddress.address + ' ' + singleAddress.address2
                  //       html += '</p>'
                  //       html += '<p>'
                  //       html += singleAddress.city + ' ' + singleAddress.state
                  //       html += '</p>'
                  //       html += '<p>'
                  //       html += singleAddress.zip + ' ' + singleAddress.country
                  //       html += '</p>'
                  //     }
                  //   })
                  //
                  //   html += '<p>'
                  //   html += 'Tel : ' + user.profile.phoneNumber
                  //   html += '</p><p>'
                  //   html += 'Mail : ' + user.email
                  //   html += '</p>'
                  // })

                  html += `
                               </th>
                             </tr>
                           </thead>
                         </table>
                         <br>
                         <table>
                           <thead>
                             <tr>
                               <th class="col-12 cobo desc smallSize">Objet :
                               </th>
                             </tr>
                           </thead>
                         </table>
                         <br>
                         <table class="tabo">
                           <thead>
                             <tr>
                               <th class="col-5 bgh titleGooplus1">Description</th>
                               <th class="col-1 bgh titleGooplus1">Image</th>
                               <th class="col-1 bgh titleGooplus1">Price_Unit</th>
                               <th class="col-1 bgh titleGooplus1">Quantity</th>
                               <th class="col-1 bgh titleGooplus1">Unit</th>
                               <th class="col-1 bgh titleGooplus1">Total_tax_excl</th>
                               <th class="col-2 bgh titleGooplus1">Tax</th>
                             </tr>
                           </thead>
                           <tbody>`



                  html += `
                           </tbody>
                         </table>

                         <br>
                         <table class="cobo">
                             <tr class="cobo">
                               <td class="col-6 alright"></td>`

                  html += `
                                <td class="col-2 ts elem"><b>TOTAL</b></td>
                               </tr>
                               <tr class="cobo">
                                <td class="col-6 alright ts elem">Sous-Total HT</td>`


                  html += `
                                <td class="col-2 elem"><b>€</b></td>
                               </tr>`

                  html += `<tr class="cobo">
                                 <td class="col-6 alright ts elem">Montant de TVA</td>`

                  html += `
                             <td class="col-2 elem"><b>€</b></td>
                           </tr>
                           <tr class="cobo">
                            <td class="col-6 alright ts elem"><b>TOTAL TTC</b></td>`

                  html += `
                               <td class="col-2 elem"><b>€</b></td>
                             </tr>
                         </table>
                         <br>`

                  html += `<table class="cobo">
                               <tr class="cobo">
                               <td class="col-6 alright ts elem">Acompte à la commande 40% </td>
                               <td class="col-6 alright elem">=40% du total ttc</td>
                               </tr>
                               <tr class="cobo">
                               <td class="col-6 alright ts elem">Acompte intermédiaire</td>
                               <td class="col-6 alright elem">sur avancement</td>
                               </tr>
                               <tr class="cobo">
                               <td class="col-6 alright ts elem"><b>Solde</b></td>
                               <td class="col-6 alright elem"><b>à la livraison</b></td>
                             </tr>
                         </table>
                         <br>`

                  html += `
                         <table>
                           <thead>
                             <tr>
                               <th class="col-3 desc">
                               <p>Entreprise</p>
                               <p class="inf2">Lu et approuvé</p>
                               <p class="inf2">Le</p>
                             </th>
                             <th class="col-6 nobo"></th>
                             <th class="col-3 desc">
                               <p>Client : `

                  html += `</p></th>
                             </tr>
                           </thead>
                         </table>
                      <br>
                      <a class="cgv">Ce devis est valable 3 mois. Les prix sont établis sur la base des taux en vigeur à la date de remise de l'offre et toute variation ultérieure de ces taux sera répercutée sur ces prix en application du Code Général des Impôts</a>
                        `

                  pdf.create(html, options).toFile('./server/uploads/pdf/' + req.params.quoteId + '.pdf', function(err, resPDF) {
                    if (err) {
                      //return res.status(404).json({message: '', err: err})

                      reject(err)
                    } else {
                      resolve(req.params.quoteId)

                    }
                  })

                // }
              // })
            // })
        //
        //   }
        // })
      })
    })
  }

}
