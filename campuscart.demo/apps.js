// demo data
const products = [
  {id:1, title:'Buku Nota A5', price:8, category:'notes', img:'https://via.placeholder.com/280x160/eeffee/0b3d91?text=Nota+A5', desc:'Buku nota 80 muka surat.'},
  {id:2, title:'Set Pen', price:5, category:'notes', img:'https://via.placeholder.com/280x160/fff0ee/0b3d91?text=Set+Pen', desc:'Set pen untuk nota.'},
  {id:3, title:'Nasi Lemak Bungkus', price:6, category:'food', img:'https://via.placeholder.com/280x160/fff7e6/0b3d91?text=Nasi+Lemak', desc:'Nasi lemak kampus.'},
  {id:4, title:'Kopi Study', price:3, category:'food', img:'https://via.placeholder.com/280x160/eeffee/0b3d91?text=Kopi', desc:'Kopi panas, ready.'},
  {id:5, title:'Campus Hoodie', price:45, category:'lifestyle', img:'https://via.placeholder.com/280x160/eeeeff/0b3d91?text=Hoodie', desc:'Hoodie rasmi KPTM.'},
  {id:6, title:'Powerbank 10k', price:30, category:'lifestyle', img:'https://via.placeholder.com/280x160/fff0ee/0b3d91?text=Powerbank', desc:'Powerbank 10000mAh.'}
];

const grid = document.getElementById('product-grid');
const search = document.getElementById('search');
const cats = document.querySelectorAll('.cat');
const cartCountEl = document.getElementById('count');

let cart = JSON.parse(localStorage.getItem('campuscart_cart') || '{}');

function saveCart(){ localStorage.setItem('campuscart_cart', JSON.stringify(cart)); }

function renderProducts(list = products){
  grid.innerHTML = '';
  if(!list.length){
    grid.innerHTML = '<div style="grid-column:1/-1;padding:20px;background:#fff;border-radius:10px;text-align:center">Tiada produk ditemui.</div>';
    return;
  }
  list.forEach(p=>{
    const el = document.createElement('div'); el.className = 'card';
    el.innerHTML = `
      <div class="product-img"><img src="${p.img}" alt="${p.title}" style="max-width:100%;height:100%;object-fit:cover;border-radius:8px" /></div>
      <div><div class="product-title">${p.title}</div><div class="product-desc">${p.desc}</div></div>
      <div class="price-row">
        <div class="price">RM ${p.price}</div>
        <div>
          <button class="add-btn" onclick="openModal(${p.id})">Butiran</button>
          <button class="add-btn" onclick="addToCart(${p.id})">+Troli</button>
        </div>
      </div>`;
    grid.appendChild(el);
  });
}

function addToCart(id){
  cart[id] = (cart[id] || 0) + 1;
  saveCart(); updateCartUI();
  showToast('Ditambah ke troli');
}

function updateCartUI(){
  const keys = Object.keys(cart);
  const totalCount = keys.reduce((s,k)=>s+cart[k],0);
  cartCountEl.textContent = totalCount;
  document.getElementById('cart-items').innerHTML = '';
  let total = 0;
  keys.forEach(k=>{
    const p = products.find(pp=>pp.id==k);
    const qty = cart[k];
    total += p.price * qty;
    const div = document.createElement('div'); div.className='cart-item';
    div.innerHTML = `
      <img src="${p.img}" alt="${p.title}">
      <div style="flex:1">
        <div style="font-weight:700">${p.title}</div>
        <div class="small">RM ${p.price} x ${qty} = RM ${p.price * qty}</div>
      </div>
      <div style="display:flex;flex-direction:column;gap:6px">
        <button onclick="changeQty(${p.id},1)">+</button>
        <div style="text-align:center">${qty}</div>
        <button onclick="changeQty(${p.id},-1)">−</button>
      </div>`;
    document.getElementById('cart-items').appendChild(div);
  });
  document.getElementById('total').textContent = 'RM ' + total;
}

function changeQty(id, delta){
  if(!cart[id]) return;
  cart[id] += delta;
  if(cart[id] <= 0) delete cart[id];
  saveCart(); updateCartUI();
}

function toggleCart(){
  const d = document.getElementById('cart-drawer');
  if(d.style.display === 'block') d.style.display = 'none';
  else d.style.display = 'block';
}

function clearCart(){ cart = {}; saveCart(); updateCartUI(); showToast('Troli dikosongkan'); }

function gotoCheckout(){
  const keys = Object.keys(cart);
  if(keys.length === 0){ alert('Troli kosong!'); return; }
  // populate checkout modal
  const list = document.getElementById('checkout-list'); list.innerHTML = '';
  let total = 0;
  keys.forEach(k=>{
    const p = products.find(pp=>pp.id==k);
    total += p.price * cart[k];
    const div = document.createElement('div'); div.style.marginBottom = '8px';
    div.textContent = `${p.title} x ${cart[k]} — RM ${p.price * cart[k]}`;
    list.appendChild(div);
  });
  const ttl = document.createElement('div'); ttl.style.marginTop='10px'; ttl.innerHTML = `<strong>Total: RM ${total}</strong>`;
  list.appendChild(ttl);
  openCheckout();
}

function openModal(id){
  const p = products.find(pp=>pp.id==id);
  const c = document.getElementById('modal-content');
  c.innerHTML = `
    <div style="display:flex;gap:14px;align-items:flex-start">
      <img src="${p.img}" alt="${p.title}" style="width:220px;border-radius:8px;object-fit:cover" />
      <div style="flex:1">
        <h2>${p.title}</h2>
        <p class="small">${p.desc}</p>
        <p style="font-weight:800;color:var(--kptm-blue)">RM ${p.price}</p>
        <div style="margin-top:12px;display:flex;gap:8px">
          <button class="btn primary" onclick="addToCart(${p.id}); closeModal()">+Troli</button>
          <button class="btn ghost" onclick="closeModal()">Tutup</button>
        </div>
      </div>
    </div>`;
  showModal('modal');
}

function showModal(id){ const m = document.getElementById(id); m.style.display='flex'; m.setAttribute('aria-hidden','false'); }
function closeModal(){ const m = document.getElementById('modal'); m.style.display='none'; m.setAttribute('aria-hidden','true'); }

function openLogin(){ showModal('login-modal'); }
function closeLogin(){ const m = document.getElementById('login-modal'); m.style.display='none'; m.setAttribute('aria-hidden','true'); }

function openCheckout(){ showModal('checkout'); }
function closeCheckout(){ const m = document.getElementById('checkout'); m.style.display='none'; m.setAttribute('aria-hidden','true'); }

function confirmPayment(){
  alert('Pembayaran berjaya (demo). Terima kasih!');
  cart = {}; saveCart(); updateCartUI(); closeCheckout(); toggleCart();
}

// search & categories
search.addEventListener('input', (e)=>{
  const q = e.target.value.trim().toLowerCase();
  if(!q) renderProducts(products);
  else renderProducts(products.filter(p => (p.title + ' ' + p.desc).toLowerCase().includes(q)));
});

document.querySelectorAll('.cat').forEach(btn=>{
  btn.addEventListener('click', e=>{
    document.querySelectorAll('.cat').forEach(c=>c.classList.remove('active'));
    e.target.classList.add('active');
    const cat = e.target.dataset.cat;
    if(cat === 'all') renderProducts(products);
    else renderProducts(products.filter(p=>p.category === cat));
  });
});

// small toast
function showToast(msg){
  const t = document.createElement('div');
  t.textContent = msg; t.style.position='fixed'; t.style.left='50%'; t.style.transform='translateX(-50%)'; t.style.bottom='26px';
  t.style.background='rgba(11,61,145,0.95)'; t.style.color='white'; t.style.padding='8px 12px'; t.style.borderRadius='10px'; t.style.zIndex=999;
  document.body.appendChild(t);
  setTimeout(()=>t.remove(),1500);
}

// initial
renderProducts(products);
updateCartUI();
