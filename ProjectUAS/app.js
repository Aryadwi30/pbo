import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const supabase = createClient(
  'https://afithkfvpcpmmtvxkofy.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFmaXRoa2Z2cGNwbW10dnhrb2Z5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk1Mjc1NzQsImV4cCI6MjA2NTEwMzU3NH0.mQGqhW30fbhg1aHcVtsAo2vmypDBSvnuvhYNvtSg0Jk'
);

// Tab Switching
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));

    btn.classList.add('active');
    document.getElementById(btn.dataset.tab).classList.add('active');
  });
});

function logout() {
  localStorage.clear();
  window.location.href = 'login.html';
}

// Load konfirmasi (status = Menunggu)
async function loadKonfirmasi() {
  const { data, error } = await supabase
    .from('peminjaman')
    .select('*')
    .eq('status', 'Menunggu')
    .order('id', { ascending: false });

  const tbody = document.getElementById('konfirmasiBody');
  tbody.innerHTML = '';
  if (error) {
    console.error(error);
    return;
  }

  data.forEach(item => {
    tbody.innerHTML += `
      <tr>
        <td>${item.nama_siswa}</td>
        <td>${item.nim}</td>
        <td>${item.barang}</td>
        <td>${item.jumlah}</td>
        <td>
          <button onclick="updateStatus(${item.id}, 'Diterima')">✔️</button>
          <button onclick="updateStatus(${item.id}, 'Ditolak')">❌</button>
        </td>
      </tr>`;
  });
}

// Load semua riwayat
async function loadRiwayat() {
  const { data, error } = await supabase
    .from('peminjaman')
    .select('*')
    .order('id', { ascending: false });

  const tbody = document.getElementById('riwayatBody');
  tbody.innerHTML = '';
  if (error) {
    console.error(error);
    return;
  }

  data.forEach(item => {
    tbody.innerHTML += `
      <tr>
        <td>${item.nama_siswa}</td>
        <td>${item.nim}</td>
        <td>${item.barang}</td>
        <td>${item.jumlah}</td>
        <td class="status ${item.status}">${item.status}</td>
      </tr>`;
  });
}

// Update status peminjaman
window.updateStatus = async function (id, status) {
  const { error } = await supabase
    .from('peminjaman')
    .update({ status })
    .eq('id', id);

  if (error) {
    alert('Gagal memperbarui status');
  } else {
    loadKonfirmasi();
    loadRiwayat();
  }
};

loadKonfirmasi();
loadRiwayat();
