/* Comparaison à phase et quantité identiques. Aucun prix visiteur n'est inventé. */
(function(root){
 'use strict';
 function compare({bagPrice,bagKg,formulaKg,processingKg=0,commercialTransportKg=0,quantityKg=1000}={}){
  const v=[bagPrice,bagKg,formulaKg,processingKg,commercialTransportKg,quantityKg].map(Number);
  if(!v.every(Number.isFinite)||v[0]<=0||v[1]<=0||v[2]<0||v[3]<0||v[4]<0||v[5]<=0)return {ready:false,message:'Renseigner un prix de sac positif, son poids et des coûts valides.'};
  const [price,weight,formula,processing,transport,quantity]=v;
  const commercial=price/weight+transport,formulated=formula+processing,difference=commercial-formulated;
  return {ready:true,commercial,formulated,difference,percent:difference/commercial*100,commercialTotal:commercial*quantity,formulatedTotal:formulated*quantity,total:difference*quantity,quantityKg:quantity,bagKg:weight};
 }
 root.SKCompare={compare};
})(typeof window!=='undefined'?window:globalThis);
