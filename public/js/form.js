const form = document.getElementById("order-form");
const result = document.getElementById("result");
const catatan = document.getElementById("catatan");
const counter = document.getElementById("counter");

const rules = {
  nama(v) {
    if (!v.trim()) return "Nama wajib diisi.";
    if (v.trim().length < 3) return "Nama minimal 3 karakter.";
    if (!/^[A-Za-z\s.'-]+$/.test(v)) return "Nama hanya boleh berisi huruf.";
    return "";
  },
  email(v) {
    if (!v.trim()) return "Email wajib diisi.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return "Format email belum benar, contoh: nama@email.com.";
    return "";
  },
  produk(v) {
    return v ? "" : "Pilih salah satu produk.";
  },
  jumlah(v) {
    const n = Number(v);
    if (!v) return "Jumlah wajib diisi.";
    if (!Number.isInteger(n) || n < 1 || n > 20) return "Jumlah harus bilangan bulat 1-20.";
    return "";
  },
};

function validateField(name) {
  const input = form.elements[name];
  const message = rules[name](input.value);
  document.getElementById("err-" + name).textContent = message;
  input.classList.toggle("invalid", message !== "");
  input.classList.toggle("valid", message === "");
  return message === "";
}

Object.keys(rules).forEach((name) => {
  const input = form.elements[name];
  input.addEventListener("input", () => validateField(name));
  input.addEventListener("blur", () => validateField(name));
});

catatan.addEventListener("input", () => {
  counter.textContent = catatan.value.length + " / 120 karakter";
});

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const allValid = Object.keys(rules).map(validateField).every(Boolean);
  if (!allValid) {
    result.hidden = true;
    const firstBad = form.querySelector(".invalid");
    if (firstBad) firstBad.focus();
    return;
  }

  const d = new FormData(form);
  result.innerHTML = "";
  const title = document.createElement("h3");
  title.textContent = "Pesanan berhasil dikirim";
  const dl = document.createElement("dl");
  [
    ["Nama", d.get("nama").trim()],
    ["Email", d.get("email").trim()],
    ["Produk", d.get("produk")],
    ["Jumlah", d.get("jumlah")],
    ["Catatan", d.get("catatan").trim() || "-"],
  ].forEach(([k, v]) => {
    const dt = document.createElement("dt");
    dt.textContent = k;
    const dd = document.createElement("dd");
    dd.textContent = v;
    dl.append(dt, dd);
  });
  result.append(title, dl);
  result.hidden = false;
  form.reset();
  counter.textContent = "0 / 120 karakter";
  form.querySelectorAll("input,select").forEach((el) => el.classList.remove("valid", "invalid"));
});
