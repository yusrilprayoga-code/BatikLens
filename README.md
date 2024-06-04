# Method Path Api pada Batik Lens

# For testing api : https://batiklens-ctthvh4ssa-et.a.run.app

## Home ("/")
* Method: GET
* Description: Halaman utama dari aplikasi. Ini bisa digunakan untuk menampilkan informasi umum atau halaman landing.
* Protected: Tidak

## Register ("/register")
* Method: POST
* Description: Endpoint untuk pendaftaran pengguna baru. Mengharuskan pengguna mengirimkan email, password, dan konfirmasi password dalam format JSON.
Request Payload:
json
* Copy code
{
  "email": "user@example.com",
  "password": "password123",
  "confirmPassword": "password123"
}
* Protected: Tidak


## Login ("/login")
* Method: POST
Description: Endpoint untuk login pengguna. Mengharuskan pengguna mengirimkan email dan password dalam format JSON. Jika berhasil, akan mengembalikan token JWT yang harus disimpan di frontend untuk akses rute yang dilindungi.
Request Payload:
json
* Copy code
{
  "email": "user@example.com",
  "password": "password123"
}
* Protected: Tidak

## Protected ("/protected")
* Method: GET
* Description: Endpoint yang dilindungi yang hanya bisa diakses oleh pengguna yang telah diautentikasi. Mengembalikan pesan sukses dan informasi pengguna yang terotentikasi.
Headers:
* Authorization: Bearer <JWT_TOKEN>
* Protected: Ya

## Prediction ("/predict)
* Method: POST
* Description: Endpoint digunakan untuk memprediksi Motif Batik

## Logout ("/logout")

* Path: /logout
* Method: GET
* Handler: logoutHandler
* Options:
* auth: 'jwt' - Memerlukan autentikasi menggunakan JWT.
* Deskripsi: Menghandle proses logout pengguna.
Not Found

## Path: /{any*}
* Method: GET
* Handler: Fungsi anonim yang mengembalikan pesan bahwa halaman tidak ditemukan.
* Deskripsi: Menghandle semua rute yang tidak dikenali, mengembalikan pesan kesalahan 404.
