# Surat NSD — Deploy Otomatis ke Vercel (Alternatif Cloudflare)

Setiap kali kamu mengubah file di GitHub, Vercel otomatis memperbarui website dalam ~15 detik tanpa perlu `wrangler.toml` atau `package.json`.

## Cara Deploy ke Vercel (2 Menit)
1. Unggah `index.html`, `vercel.json`, `README.md`, dan folder `api/` (berisi `compose.js`) ke repository GitHub baru (atau timpa di repo GitHub-mu).
2. Buka https://vercel.com/new -> **Continue with GitHub** -> pilih repository tersebut.
3. Klik **Environment Variables**, tambahkan:
   - `GEMINI_API_KEY` = API Key Gemini milikmu
   - `GEMINI_MODEL` = `gemini-4-hydrogen`
4. Klik **Deploy**. Website langsung live di alamat `.vercel.app` dan otomatis terupdate setiap kali GitHub diubah!
