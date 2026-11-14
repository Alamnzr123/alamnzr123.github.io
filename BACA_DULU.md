# Perbaikan Antislop: alamnzr123.github.io (15 Nov 2026)

## Cara pasang
1. Salin semua isi folder ini ke F:\alamnzr123.github.io (timpa file lama).
2. Hapus dua file ini secara manual, karena menyalin file tidak menghapus apa pun:
   - alamnzr123.github.io.zip (berisi Portfolio PDF yang sudah kamu hapus, masih bisa diunduh publik)
   - assets\img\mama-recipe.jpg (tidak dipakai)
3. Di folder itu jalankan:
   git add -A
   git commit -m "fix: antislop audit 001 (theme toggle, a11y, motion, copy)"
   git push
4. Tunggu 1 sampai 2 menit, lalu buka https://alamnzr123.github.io dengan Ctrl+F5.

## Catatan
- Zip di root repo sudah dihapus dari HEAD, tetapi masih ada di riwayat git. Kalau Portfolio PDF itu tidak boleh diakses sama sekali, riwayat perlu dibersihkan (git filter-repo) atau repo dibuat ulang.
- Folder anti-slop/ ikut ter-publish di GitHub Pages (tidak di-link dari situs). Hapus kalau tidak mau publik.
- og-image.jpg dirender dengan huruf Inter karena Space Grotesk tidak tersedia di lingkungan saya; tampilannya tetap sesuai hero baru.
