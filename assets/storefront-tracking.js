'use strict';
const params=new URLSearchParams(location.search),slug=document.querySelector('meta[name="hub-site-tenant"]')?.content||params.get('c'),token=params.get('token');
const node=id=>document.getElementById(id);
const stages={requested:'Recebido pela loja',approved:'Pedido aceito',preparing:'Em preparo',ready:'Pronto',dispatching:'Em entrega',delivered:'Concluído',cancelled:'Cancelado',awaiting_payment:'Aguardando pagamento'};
let latestRequest=0,checkingPayment=false;
if(slug)node('store-link').href='/lojas/'+encodeURIComponent(slug)+'/';
function paymentActions(result){
 const pending=result.paymentStatus!=='paid'&&result.status!=='cancelled'&&!result.paymentReviewRequired&&result.checkout?.url;
 let link=node('resume-payment'),button=node('refresh-payment');
 if(!pending){link?.remove();button?.remove();return;}
 let url;
 try{url=new URL(pending);if(url.protocol!=='https:'||!['www.mercadopago.com.br','www.mercadopago.com','mercadopago.com.br','mercadopago.com','sandbox.mercadopago.com.br','sandbox.mercadopago.com'].includes(url.hostname))throw Error();}catch{link?.remove();button?.remove();return;}
 if(!link){link=document.createElement('a');link.id='resume-payment';link.textContent='Pagar no Mercado Pago';link.style.display='block';link.style.marginTop='20px';node('payment').after(link);}link.href=url.href;
 if(!button){button=document.createElement('button');button.type='button';button.id='refresh-payment';button.textContent='Atualizar pagamento';button.style.minHeight='44px';button.style.marginTop='12px';button.addEventListener('click',reconcilePayment);link.after(button);}button.disabled=checkingPayment;
}
async function track(){
 if(!slug||!token)return null;
 const request=++latestRequest;
 try{
  const response=await fetch('/api/storefront/tracking?c='+encodeURIComponent(slug)+'&token='+encodeURIComponent(token),{signal:AbortSignal.timeout(20000)}),result=await response.json();
  if(!response.ok)throw Error(result.error||'Não foi possível consultar o pedido.');
  if(request!==latestRequest)return null;
  node('company').textContent=result.company;node('order-title').textContent='Pedido #'+result.id;node('status').textContent=result.paymentReviewRequired&&result.status==='awaiting_payment'?'Aguardando conferência da loja':result.paymentState==='expired'?'Pagamento expirado':stages[result.status]||'Aguardando atualização';
  node('items').replaceChildren(...result.items.map(i=>{const li=document.createElement('li');li.textContent=i.quantity+'× '+i.name+(i.variant?' · '+i.variant:'');return li;}));
  node('total').textContent=Number(result.total).toLocaleString('pt-BR',{style:'currency',currency:'BRL'});
  node('payment').textContent=result.paymentStatus==='refunded'?'Estorno registrado':result.paymentReviewRequired||result.paymentState==='expired'?result.paymentMessage||'O pagamento precisa ser conferido pela loja.':result.paymentStatus==='paid'?'Pagamento confirmado':result.checkout?'Aguardando confirmação do Mercado Pago':'Pagamento pendente de conferência';
  paymentActions(result);return result;
 }catch(error){if(request===latestRequest)node('status').textContent=error.message;return null;}
}
async function reconcilePayment(){
 if(checkingPayment||!slug||!token)return;
 checkingPayment=true;if(node('refresh-payment'))node('refresh-payment').disabled=true;
 try{
  const response=await fetch('/api/storefront/payment-status?c='+encodeURIComponent(slug)+'&token='+encodeURIComponent(token),{method:'POST',headers:{'Content-Type':'application/json'},body:'{}',signal:AbortSignal.timeout(30000)});
  if(!response.ok){const body=await response.json();throw Error(body.error||'Não foi possível conferir o pagamento. Tente atualizar novamente.');}
  await track();
 }catch(error){node('payment').textContent=error.message;}finally{checkingPayment=false;if(node('refresh-payment'))node('refresh-payment').disabled=false;}
}
track().then(result=>{if(result?.checkout?.url&&result.paymentStatus!=='paid'&&result.status!=='cancelled')reconcilePayment();});
if(slug&&token)setInterval(track,5000);
