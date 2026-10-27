const API_URL = "https://dummyjson.com/products";
const listEl = document.getElementById("product-list");
const statusEl = document.getElementById("status");
const reloadBtn = document.getElementById("btn-reload");

const rupiah = (idr) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 })
    .format(idr * 16000);

function setStatus(text, isError = false) {
  statusEl.textContent = text;
  statusEl.classList.toggle("error", isError);
}

function renderProducts(products) {
  listEl.innerHTML = "";
  products.forEach((p) => {
    const card = document.createElement("article");
    card.className = "card";

    const img = document.createElement("img");
    img.src = p.thumbnail;
    img.alt = p.title;
    img.loading = "lazy";

    const body = document.createElement("div");
    body.className = "body";

    const name = document.createElement("h3");
    name.textContent = p.title;

    const price = document.createElement("div");
    price.className = "price";
    price.textContent = rupiah(p.price);

    const cat = document.createElement("div");
    cat.className = "cat";
    cat.textContent = p.category;

    body.append(name, price, cat);
    card.append(img, body);
    listEl.appendChild(card);
  });
}

async function loadProducts() {
  listEl.innerHTML = "";
  reloadBtn.disabled = true;
  setStatus("Memuat data produk...");
  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error("Server mengembalikan status " + response.status);
    const data = await response.json();
    if (!Array.isArray(data.products) || data.products.length === 0) {
      throw new Error("Data produk kosong");
    }
    renderProducts(data.products);
    setStatus(data.products.length + " produk berhasil dimuat.");
  } catch (err) {
    setStatus("Gagal memuat produk: " + err.message + ". Periksa koneksi internet lalu klik Muat ulang.", true);
  } finally {
    reloadBtn.disabled = false;
  }
}

reloadBtn.addEventListener("click", loadProducts);
document.addEventListener("DOMContentLoaded", loadProducts);
