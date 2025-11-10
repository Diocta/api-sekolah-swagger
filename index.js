const express = require('express');
const cors = require('cors');
const fs = require('fs');
const yaml = require('js-yaml');
const swaggerUi = require('swagger-ui-express');

const app = express();
app.use(cors());
app.use(express.json());

// --- Dummy data (RAM) ---
let siswa = [
  { 
    id: 1, 
    nama: 'Budi', 
    jurusan: 'TJKT',
    absen: 1,
    kelas: "XII SIJA 1",
    alamat: "Surabaya",
    telepon: "08123456789",
    email: "budi@gmail.com",
    tanggal_lahir: "2007-01-01",
    jenis_kelamin: "Laki-laki"
  },
  { 
    id: 2, 
    nama: 'Sari', 
    jurusan: 'RPL',
    absen: 2,
    kelas: "XII RPL 2",
    alamat: "Sidoarjo",
    telepon: "08987654321",
    email: "sari@gmail.com",
    tanggal_lahir: "2007-02-01",
    jenis_kelamin: "Perempuan"
  }
];

let nextId = 3;

// --- Load Swagger YAML ---
const swaggerDocument = yaml.load(
  fs.readFileSync('./openapi.yml', 'utf8')
);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// --- ROUTES ---

// ✅ Route test
app.get('/', (req, res) => {
  res.send('API Sekolah berjalan. Buka /api-docs untuk dokumentasi.');
});

// ✅ Halo
app.get('/halo', (req, res) => {
  res.json({ pesan: 'Halo dari API Sekolah!' });
});

// ✅ GET semua siswa
app.get('/siswa', (req, res) => {
  res.json(siswa);
});

// ✅ POST siswa baru (menyimpan SEMUA field)
app.post('/siswa', (req, res) => {
  const data = req.body;

  if (!data.nama || !data.jurusan) {
    return res.status(400).json({ pesan: 'nama & jurusan wajib' });
  }

  const baru = { id: nextId++, ...data };
  siswa.push(baru);

  res.status(201).json(baru);
});

// ✅ GET siswa by ID
app.get('/siswa/:id', (req, res) => {
  const id = Number(req.params.id);
  const item = siswa.find(s => s.id === id);

  if (!item) return res.status(404).json({ pesan: 'Tidak ditemukan' });

  res.json(item);
});

// ✅ PUT update semua data siswa
app.put('/siswa/:id', (req, res) => {
  const id = Number(req.params.id);
  const idx = siswa.findIndex(s => s.id === id);

  if (idx === -1) return res.status(404).json({ pesan: 'Tidak ditemukan' });

  siswa[idx] = { id, ...req.body };

  res.json(siswa[idx]);
});

// ✅ DELETE siswa by ID
app.delete('/siswa/:id', (req, res) => {
  const id = Number(req.params.id);
  const before = siswa.length;

  siswa = siswa.filter(s => s.id !== id);

  if (siswa.length === before) {
    return res.status(404).json({ pesan: 'Tidak ditemukan' });
  }

  res.status(204).send();
});

// --- Start server ---
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
  console.log(`Swagger UI: http://localhost:${PORT}/api-docs`);
});
