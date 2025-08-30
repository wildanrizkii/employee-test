const soalTkd = [
  {
    id: 1,
    jenis: 'Tes Sinonim',
    petunjuk:
      'Masing-­masing soal terdiri dari satu kata yang dicetak dengan huruf besar (huruf kapital) diikuti lima kemungkinan jawaban. Pilihlah satu jawaban yang mempunyai arti sama atau paling dekat dengan arti kata yang dicetak dengan huruf kapital.',
    pertanyaan: 'INISIATIF =',
    jawaban: ['Prakarsa', 'Usaha', 'Dorongan', 'Kemauan', 'Hasrat']
  },
  {
    id: 2,
    jenis: 'Tes Sinonim',
    petunjuk:
      'Masing-­masing soal terdiri dari satu kata yang dicetak dengan huruf besar (huruf kapital) diikuti lima kemungkinan jawaban. Pilihlah satu jawaban yang mempunyai arti sama atau paling dekat dengan arti kata yang dicetak dengan huruf kapital.',
    pertanyaan: 'LOYALITAS =',
    jawaban: ['Dedikasi', 'Kesatuan', 'Kesetiaan', 'Kepatuhan', 'Kesediaan']
  },
  {
    id: 3,
    jenis: 'Tes Sinonim',
    petunjuk:
      'Masing-­masing soal terdiri dari satu kata yang dicetak dengan huruf besar (huruf kapital) diikuti lima kemungkinan jawaban. Pilihlah satu jawaban yang mempunyai arti sama atau paling dekat dengan arti kata yang dicetak dengan huruf kapital.',
    pertanyaan: 'DINAMIS =',
    jawaban: ['Stabil', 'Bergerak pelan', 'Positif', 'Konstan', 'Bergerak maju']
  },
  {
    id: 4,
    jenis: 'Tes Sinonim',
    petunjuk:
      'Masing-­masing soal terdiri dari satu kata yang dicetak dengan huruf besar (huruf kapital) diikuti lima kemungkinan jawaban. Pilihlah satu jawaban yang mempunyai arti sama atau paling dekat dengan arti kata yang dicetak dengan huruf kapital.',
    pertanyaan: 'SUPERVISI = ',
    jawaban: [
      'Pengawalan',
      'Perhatian',
      'Pengawasan',
      'Pemantapan',
      'Perlindungan'
    ]
  },
  {
    id: 5,
    jenis: 'Tes Sinonim',
    petunjuk:
      'Masing-­masing soal terdiri dari satu kata yang dicetak dengan huruf besar (huruf kapital) diikuti lima kemungkinan jawaban. Pilihlah satu jawaban yang mempunyai arti sama atau paling dekat dengan arti kata yang dicetak dengan huruf kapital.',
    pertanyaan: 'KARAKTERISTIK =',
    jawaban: ['Ciri', 'Watak', 'Tabiat', 'Jiwa', 'Akhlak']
  },
  {
    id: 6,
    jenis: 'Tes Antonim',
    petunjuk:
      'Masing-­masing soal terdiri dari satu kata yang dicetak dengan huruf besar (huruf kapital) diikuti lima kemungkinan jawaban. Pilihlah satu jawaban yang mempunyai arti yang berlawanan dengan arti kata yang dicetak dengan huruf kapital.',
    pertanyaan: 'PRIMITIF ',
    jawaban: ['Konservatif', 'Konvensional', 'Ortodoks', 'Arkais', 'Aktual']
  },
  {
    id: 7,
    jenis: 'Tes Antonim',
    petunjuk:
      'Masing-­masing soal terdiri dari satu kata yang dicetak dengan huruf besar (huruf kapital) diikuti lima kemungkinan jawaban. Pilihlah satu jawaban yang mempunyai arti yang berlawanan dengan arti kata yang dicetak dengan huruf kapital.',
    pertanyaan: 'MEMBALUTKAN',
    jawaban: [
      'Mengaitkan',
      'Mengikatkan',
      'Meniadakan',
      'Menghancurkan',
      'Menanggalkan'
    ]
  },
  {
    id: 8,
    jenis: 'Tes Antonim',
    petunjuk:
      'Masing-­masing soal terdiri dari satu kata yang dicetak dengan huruf besar (huruf kapital) diikuti lima kemungkinan jawaban. Pilihlah satu jawaban yang mempunyai arti yang berlawanan dengan arti kata yang dicetak dengan huruf kapital.',
    pertanyaan: 'FLEKSIBEL ',
    jawaban: ['Luwes', 'Tak pilih pilih', 'Selaras', 'Stagnan', 'Kaku']
  },
  {
    id: 9,
    jenis: 'Tes Antonim',
    petunjuk:
      'Masing-­masing soal terdiri dari satu kata yang dicetak dengan huruf besar (huruf kapital) diikuti lima kemungkinan jawaban. Pilihlah satu jawaban yang mempunyai arti yang berlawanan dengan arti kata yang dicetak dengan huruf kapital.',
    pertanyaan: 'ABSAH',
    jawaban: ['Terlarang', 'Sahih', 'Cacat', 'Ilegal', 'Benar']
  },
  {
    id: 10,
    jenis: 'Tes Antonim',
    petunjuk:
      'Masing-­masing soal terdiri dari satu kata yang dicetak dengan huruf besar (huruf kapital) diikuti lima kemungkinan jawaban. Pilihlah satu jawaban yang mempunyai arti yang berlawanan dengan arti kata yang dicetak dengan huruf kapital.',
    pertanyaan: 'DEFISIT',
    jawaban: ['Anggaran', 'Kekurangan', 'Ganjil', 'Surplus', 'Sedikit']
  },
  {
    id: 11,
    jenis: 'Tes Analogi',
    petunjuk:
      'Masing-­masing soal terdiri dari dua kata yang berpasangan diikuti lima kemungkinan jawaban. Pilihlah satu jawaban paling tepat yang mempunyai kesamaan hubungan dengan soal yang diberikan.',
    pertanyaan: 'MUSIBAH ; BENCANA',
    jawaban: [
      'Celaka ; terluka',
      'Sakit ; sehat',
      'Takut ; berani',
      'Lentur ; elastis',
      'Kaku ; baik'
    ]
  },
  {
    id: 12,
    jenis: 'Tes Analogi',
    petunjuk:
      'Masing-­masing soal terdiri dari dua kata yang berpasangan diikuti lima kemungkinan jawaban. Pilihlah satu jawaban paling tepat yang mempunyai kesamaan hubungan dengan soal yang diberikan.',
    pertanyaan: 'PABRIK ; PRODUK',
    jawaban: [
      'Diktat ; mahasiswa',
      'Cemas ; bingung',
      'Mesin cetak ; tinta',
      'Tukang kayu ; mebelair',
      'Ibu ; anak'
    ]
  },
  {
    id: 13,
    jenis: 'Tes Analogi',
    petunjuk:
      'Masing-­masing soal terdiri dari dua kata yang berpasangan diikuti lima kemungkinan jawaban. Pilihlah satu jawaban paling tepat yang mempunyai kesamaan hubungan dengan soal yang diberikan.',
    pertanyaan: 'MELATI : PUTIH',
    jawaban: [
      'Makan : Minum',
      'Langit : Biru',
      'Mawar : Duri',
      'Susu : Stroberi',
      'Burung : Sayap'
    ]
  },
  {
    id: 14,
    jenis: 'Tes Analogi',
    petunjuk:
      'Masing-­masing soal terdiri dari dua kata yang berpasangan diikuti lima kemungkinan jawaban. Pilihlah satu jawaban paling tepat yang mempunyai kesamaan hubungan dengan soal yang diberikan.',
    pertanyaan: 'DRAMA : TRAGEDI',
    jawaban: [
      'Musik : Keras',
      'Lagu : Indah',
      'Merpati : Putih',
      'Mobil : Sedan ',
      'Meja : ruang'
    ]
  },
  {
    id: 15,
    jenis: 'Tes Analogi',
    petunjuk:
      'Masing-­masing soal terdiri dari dua kata yang berpasangan diikuti lima kemungkinan jawaban. Pilihlah satu jawaban paling tepat yang mempunyai kesamaan hubungan dengan soal yang diberikan.',
    pertanyaan: 'KUNCI : PINTU',
    jawaban: [
      'Baju : Celana',
      'Pisau : Tajam',
      'Air : Mineral',
      'Celana : panjang',
      'Api : lilin'
    ]
  },
  {
    id: 16,
    jenis: 'Tes Analogi',
    petunjuk:
      'Masing-­masing soal terdiri dari dua kata yang berpasangan diikuti lima kemungkinan jawaban. Pilihlah satu jawaban paling tepat yang mempunyai kesamaan hubungan dengan soal yang diberikan.',
    pertanyaan: '	MENCATAT ; KERTAS ; BALLPOINT',
    jawaban: [
      'Minyak ; menyala ; kompor',
      'Menjahit ; kain ; jarum',
      'Sepak ; bola ; tendang',
      'Monitor ; harddisk ; card',
      'Arus ; voltase ; volt'
    ]
  },
  {
    id: 17,
    jenis: 'Tes Analogi',
    petunjuk:
      'Masing-­masing soal terdiri dari dua kata yang berpasangan diikuti lima kemungkinan jawaban. Pilihlah satu jawaban paling tepat yang mempunyai kesamaan hubungan dengan soal yang diberikan.',
    pertanyaan: 'SAPI ; MEMBAJAK ; LADANG',
    jawaban: [
      'Sambal ; pedas ; cobek',
      'Kambing ; tali ; kandang',
      'Mata ; melihat ; pemandangan',
      'Pensil ; mencatat ; kain',
      'Kembang ; wangi ; taman'
    ]
  },
  {
    id: 18,
    jenis: 'Tes Analogi',
    petunjuk:
      'Masing-­masing soal terdiri dari dua kata yang berpasangan diikuti lima kemungkinan jawaban. Pilihlah satu jawaban paling tepat yang mempunyai kesamaan hubungan dengan soal yang diberikan.',
    pertanyaan: 'DOSEN ; DEKAN ; REKTOR',
    jawaban: [
      'SD ; SMA ; SMP',
      'Tamtama ; bintara ; perwira',
      'Bodoh ; baik ; sabar',
      'Sopir ; manajer ; bos',
      'Bos ; manajer ; klien'
    ]
  },
  {
    id: 19,
    jenis: 'Tes Analogi',
    petunjuk:
      'Masing-­masing soal terdiri dari dua kata yang berpasangan diikuti lima kemungkinan jawaban. Pilihlah satu jawaban paling tepat yang mempunyai kesamaan hubungan dengan soal yang diberikan.',
    pertanyaan: 'SUSU ; PROTEIN ; KALSIUM',
    jawaban: [
      'Jus ; Apel ; Melon',
      'Sayur ; Wortel ; Brokoli',
      'Bayam ; kacang ; singkong',
      'Daging ; protein ; serat',
      'Nasi ; bubur ; susu'
    ]
  },
  {
    id: 20,
    jenis: 'Tes Analogi',
    petunjuk:
      'Masing-­masing soal terdiri dari dua kata yang berpasangan diikuti lima kemungkinan jawaban. Pilihlah satu jawaban paling tepat yang mempunyai kesamaan hubungan dengan soal yang diberikan.',
    pertanyaan: 'DRUM; TAMBORIN ; REBANA',
    jawaban: [
      'ember ; air ; kolam',
      'makan ; minum ; kenyang',
      'film ; lagu ; televisi',
      'Kalkulator ; neraca ; sempoa',
      'Wortel ; nangka ; bayam'
    ]
  },
  {
    id: 21,
    jenis: 'Tes Penalaran Analitis',
    petunjuk:
      'Soal di bawah ini terdiri dari pernyataan-­pernyataan yang akan mengungkap kemampuan Anda dalam menyimpulkan suatu permasalahan. Setiap soal terdiri dari dua atau lebih pernyataan. Bacalah baik-­baik pernyataan itu dan tentukan kesimpulan yang dapat ditarik dari pernyataan itu. Kemudian, pilihlah satu dari lima pilihan jawaban yang ada sebagai kesimpulan dari pernyataan itu.',
    pertanyaan:
      'Suatu keluarga mempunyai empat anak yang bergelar sarjana. A memperoleh gelar sarjana sesudah C, B memperoleh kesarjanaan sebelum D dan bersamaan dengan A. Urutan yang benar dalam perolehan kesarjanaan adalah ...',
    jawaban: [
      'D memperoleh gelar sarjana sebelum C',
      'A memperoleh gelar sarjana sesudah C',
      'C memperoleh gelar sarjana sesudah A',
      'A memperoleh gelar sarjana bersamaan dengan D',
      'B memperoleh gelar sarjana sebelum C'
    ]
  },
  {
    id: 22,
    jenis: 'Tes Penalaran Analitis',
    petunjuk:
      'Soal di bawah ini terdiri dari pernyataan-­pernyataan yang akan mengungkap kemampuan Anda dalam menyimpulkan suatu permasalahan. Setiap soal terdiri dari dua atau lebih pernyataan. Bacalah baik-­baik pernyataan itu dan tentukan kesimpulan yang dapat ditarik dari pernyataan itu. Kemudian, pilihlah satu dari lima pilihan jawaban yang ada sebagai kesimpulan dari pernyataan itu.',
    pertanyaan:
      'Usia Santi lebih tua dari Wanti. Usia Kanti lebih muda dari Wanti. Usia Tanti dan Yanti lebih tua dari Santi. Usia Yanti lebih muda dari Tanti. Urutan usia tertua hingga termuda adalah ...',
    jawaban: [
      'Santi-Wanti-Kanti-Tanti-Yanti',
      'Tanti-Yanti-Santi-Wanti-Kanti',
      'Kanti-Yanti-Tanti-Santi-Wanti',
      'Wanti-Santi-Kanti-Yanti-Tanti',
      'Yanti-Kanti-Santi-Wanti-Kanti'
    ]
  },
  {
    id: 23,
    jenis: 'Tes Penalaran Analitis',
    petunjuk:
      'Soal di bawah ini terdiri dari pernyataan-­pernyataan yang akan mengungkap kemampuan Anda dalam menyimpulkan suatu permasalahan. Setiap soal terdiri dari dua atau lebih pernyataan. Bacalah baik-­baik pernyataan itu dan tentukan kesimpulan yang dapat ditarik dari pernyataan itu. Kemudian, pilihlah satu dari lima pilihan jawaban yang ada sebagai kesimpulan dari pernyataan itu.',
    pertanyaan:
      'Andre adalah adik Nunung. Nina adalah kakak Andre dan lebih muda daripada Nunung. Siapa yang paling tua?',
    jawaban: [
      'Andre',
      'Nunung',
      'Nina',
      'Nina dan Nunung',
      'Tidak dapat ditentukan'
    ]
  },
  {
    id: 24,
    jenis: 'Tes Penalaran Analitis',
    petunjuk:
      'Soal di bawah ini terdiri dari pernyataan-­pernyataan yang akan mengungkap kemampuan Anda dalam menyimpulkan suatu permasalahan. Setiap soal terdiri dari dua atau lebih pernyataan. Bacalah baik-­baik pernyataan itu dan tentukan kesimpulan yang dapat ditarik dari pernyataan itu. Kemudian, pilihlah satu dari lima pilihan jawaban yang ada sebagai kesimpulan dari pernyataan itu.',
    pertanyaan:
      'Kejujuran S tidak sebaik D, terkadang M kurang jujur, tapi sesungguhnya dia masih lebih jujur dari R. B lebih suka berbohong daripada H, D cukup jujur, tapi secara umum M lebih jujur daripada D. I sama jujurnya dengan K. D lebih jujur daripada H dan K. Siapakah diantara mereka yang paling jujur? ',
    jawaban: ['K', 'H', 'I', 'D', 'M']
  },
  {
    id: 25,
    jenis: 'Tes Penalaran Analitis',
    petunjuk:
      'Soal di bawah ini terdiri dari pernyataan-­pernyataan yang akan mengungkap kemampuan Anda dalam menyimpulkan suatu permasalahan. Setiap soal terdiri dari dua atau lebih pernyataan. Bacalah baik-­baik pernyataan itu dan tentukan kesimpulan yang dapat ditarik dari pernyataan itu. Kemudian, pilihlah satu dari lima pilihan jawaban yang ada sebagai kesimpulan dari pernyataan itu.',
    pertanyaan:
      'Jarak antara kampus A dan B adalah dua kali jarak kampus C dan D. Kampus E terletak ditengah-tengah antara kampus C dan D. Selanjutnya diketahui bahwa jarak kampus C ke kampus A sama dengan jarak kampus D ke B, yaitu setengah dari jarak kampus A ke kampus E. Kampus yang jaraknya paling jauh dari A adalah',
    jawaban: ['Kampus A', 'Kampus B', 'Kampus C', 'Kampus D', 'Kampus E']
  },
  {
    id: 26,
    jenis: 'Tes Penalaran Logis',
    petunjuk:
      'Soal di bawah ini terdiri dari pernyataan-­pernyataan yang akan mengungkap kemampuan Anda dalam menyimpulkan suatu permasalahan. Setiap soal terdiri dari dua atau lebih pernyataan. Bacalah baik-­baik pernyataan itu dan tentukan kesimpulan yang dapat ditarik dari pernyataan itu. Kemudian, pilihlah satu dari lima pilihan jawaban yang ada sebagai kesimpulan dari pernyataan itu.',
    pertanyaan:
      'Tabungan A lebih banyak daripada tabungan B dan C. Tabungan B lebih banyak daripada tabungan C. Tabungan D lebih banyak daripada jumlah tabungan A, B, dan C.',
    jawaban: [
      'C mempunyai tabungan paling sedikit',
      'Yang mempunyai tabungan paling banyak adalah A',
      'Tabungan A lebih banyak daripada tabungan D',
      'Jumlah tabungan D dan C sama dengan jumlah tabungan A dan B',
      'Tabungan D merupakan penjumlahan tabungan A, B, dan C'
    ]
  },
  {
    id: 27,
    jenis: 'Tes Penalaran Logis',
    petunjuk:
      'Soal di bawah ini terdiri dari pernyataan-­pernyataan yang akan mengungkap kemampuan Anda dalam menyimpulkan suatu permasalahan. Setiap soal terdiri dari dua atau lebih pernyataan. Bacalah baik-­baik pernyataan itu dan tentukan kesimpulan yang dapat ditarik dari pernyataan itu. Kemudian, pilihlah satu dari lima pilihan jawaban yang ada sebagai kesimpulan dari pernyataan itu.',
    pertanyaan:
      'Sebagai petani buah yang memiliki banyak kebun, pada hari Rabu kemarin, Pak Tubagus sudah memanen kebun mangganya di daerah Panyileukan. Besok lusanya dia panen di daerah Rancaekek. Seminggu kemudian dia memanen di daerah Cinunuk. Jika Pak Tubagus memiliki empat lahan kebun mangga, pada hari apakah besok lusa dari panen terakhir di daerah Cicaheum.',
    jawaban: ['Senin', 'Rabu', 'Jumat', 'Sabtu', 'Minggu']
  },
  {
    id: 28,
    jenis: 'Tes Penalaran Logis',
    petunjuk:
      'Soal di bawah ini terdiri dari pernyataan-­pernyataan yang akan mengungkap kemampuan Anda dalam menyimpulkan suatu permasalahan. Setiap soal terdiri dari dua atau lebih pernyataan. Bacalah baik-­baik pernyataan itu dan tentukan kesimpulan yang dapat ditarik dari pernyataan itu. Kemudian, pilihlah satu dari lima pilihan jawaban yang ada sebagai kesimpulan dari pernyataan itu.',
    pertanyaan:
      'Tidak semua insinyur menguasai bahasa Inggris. Semua insinyur teknik sipil lancar berbicara bahasa Inggris. Semua sarjana sosial politik lancar berbicara bahasa Indonesia. Hendrawan adalah insinyur teknik sipil. Kesimpulan = ...',
    jawaban: [
      'Hendrawan tidak lancar berbicara bahasa Inggris',
      'Hendrawan mungkin tidak lancar berbicara bahasa Indonesia',
      'Hendrawan mungkin lancar bahasa Inggris',
      'Hendrawan mustahil tidak lancar berbahasa Inggris',
      'Tidak ada kesimpulan yang benar'
    ]
  },
  {
    id: 29,
    jenis: 'Tes Penalaran Logis',
    petunjuk:
      'Soal di bawah ini terdiri dari pernyataan-­pernyataan yang akan mengungkap kemampuan Anda dalam menyimpulkan suatu permasalahan. Setiap soal terdiri dari dua atau lebih pernyataan. Bacalah baik-­baik pernyataan itu dan tentukan kesimpulan yang dapat ditarik dari pernyataan itu. Kemudian, pilihlah satu dari lima pilihan jawaban yang ada sebagai kesimpulan dari pernyataan itu.',
    pertanyaan:
      'Semua buku yang dimiliki Anton bukan kamus. Sebagian buku yang dimiliki Anton adalah buku-buku agama. Kesimpulan = ...',
    jawaban: [
      'Sebagian buku yang dimiliki Anton adalah buku buku agama dan bukan kamus',
      'Semua buku yang dimiliki Anton adalah buku-buku agama namun bukan kamus',
      'Semua buku yang dimiliki Anton bukan buku-buku agama dan juga bukan kamus',
      'Semua buku yang dimiliki Anton adalah buku-buku agama',
      'Sebagian buku yang dimiliki Anton adalah buku-buku agama dan sebagian sisanya adalah buku-buku umum'
    ]
  },
  {
    id: 30,
    jenis: 'Tes Penalaran Logis',
    petunjuk:
      'Soal di bawah ini terdiri dari pernyataan-­pernyataan yang akan mengungkap kemampuan Anda dalam menyimpulkan suatu permasalahan. Setiap soal terdiri dari dua atau lebih pernyataan. Bacalah baik-­baik pernyataan itu dan tentukan kesimpulan yang dapat ditarik dari pernyataan itu. Kemudian, pilihlah satu dari lima pilihan jawaban yang ada sebagai kesimpulan dari pernyataan itu.',
    pertanyaan:
      'Semua murid lelaki menjadi anggota pramuka. Sebagian murid lelaki gemar bertualang. Kesimpulan = ...',
    jawaban: [
      'Murid-murid perempuan tidak gemar berpetualang',
      'Murid lelaki yang tidak gemar berpetualang bukan anggota pramuka',
      'Sebagian murid lelaki yang tidak gemar berpetualang tidak menjadi anggota pramuka',
      'Semua anggota pramuka gemar berpetualang',
      'Tidak dapat ditarik kesimpulan'
    ]
  },
  {
    id: 31,
    jenis: 'Tes Aritmatika',
    petunjuk:
      'Soal­-soal aritmatika terdiri dari soal-­soal hitungan sederhana, konsep aljabar, dan permasalahan aritmatika lainnya. Setiap soal disertai dengan lima pilihan jawaban. Jawablah setiap soal dengan cara memilih satu dari lima jawaban yang ada.',
    pertanyaan: 'Berapakah nilai dari 4,353 : 0,003',
    jawaban: ['1.451', '1.455', '1.465', '1.471', '1.475']
  },
  {
    id: 32,
    jenis: 'Tes Aritmatika',
    petunjuk:
      'Soal­-soal aritmatika terdiri dari soal-­soal hitungan sederhana, konsep aljabar, dan permasalahan aritmatika lainnya. Setiap soal disertai dengan lima pilihan jawaban. Jawablah setiap soal dengan cara memilih satu dari lima jawaban yang ada.',
    pertanyaan: 'Berapa nilai 7,2 : 0,9 ',
    jawaban: ['4', '8', '10', '12', '16']
  },
  {
    id: 33,
    jenis: 'Tes Aritmatika',
    petunjuk:
      'Soal­-soal aritmatika terdiri dari soal-­soal hitungan sederhana, konsep aljabar, dan permasalahan aritmatika lainnya. Setiap soal disertai dengan lima pilihan jawaban. Jawablah setiap soal dengan cara memilih satu dari lima jawaban yang ada.',
    pertanyaan:
      'Sewa VCD di rental Murni adalah Rp1.500 untuk tiga hari pertama dan untuk hari selanjutnya adalah Rp1.000 per hari. Jika Pak Joko menyewa sebuah VCD dan membayar sebanyak Rp16.500, berapa hari Pak Joko menyewa VCD tersebut?',
    jawaban: ['15 hari', '16 hari', '18 hari', '19 hari', '20 hari']
  },
  {
    id: 34,
    jenis: 'Tes Aritmatika',
    petunjuk:
      'Soal­-soal aritmatika terdiri dari soal-­soal hitungan sederhana, konsep aljabar, dan permasalahan aritmatika lainnya. Setiap soal disertai dengan lima pilihan jawaban. Jawablah setiap soal dengan cara memilih satu dari lima jawaban yang ada.',
    pertanyaan:
      'Di sebuah kandang ada 50 ekor merpati. Banyaknya merpati jantan adalah 27 ekor, 18 ekor di antaranya berbulu hitam. Jika jumlah merpati berbulu hitam adalah 35 ekor, banyaknya merpati betina yang tidak berbulu hitam adalah ...',
    jawaban: ['6', '2', '4', '11', '19']
  },
  {
    id: 35,
    jenis: 'Tes Aritmatika',
    petunjuk:
      'Soal­-soal aritmatika terdiri dari soal-­soal hitungan sederhana, konsep aljabar, dan permasalahan aritmatika lainnya. Setiap soal disertai dengan lima pilihan jawaban. Jawablah setiap soal dengan cara memilih satu dari lima jawaban yang ada.',
    pertanyaan:
      'Terdapat 2 buah roda. Jika roda pertama berputar 9 kali, roda kedua akan berputar 24 kali. Jika roda yang pertama berputar 27 kali, berapa kali putaran roda yang kedua?',
    jawaban: ['92 kali', '82 kali', '74 kali', '84 kali', '72 kali']
  },
  {
    id: 36,
    jenis: 'Tes Aritmatika',
    petunjuk:
      'Soal­-soal aritmatika terdiri dari soal-­soal hitungan sederhana, konsep aljabar, dan permasalahan aritmatika lainnya. Setiap soal disertai dengan lima pilihan jawaban. Jawablah setiap soal dengan cara memilih satu dari lima jawaban yang ada.',
    pertanyaan:
      'Seorang pengusaha ingin memasang iklan sebanyak 3 baris pada sebuah surat kabar. Untuk hari pertama, ia harus membayar Rp2.500 per baris, untuk 5 hari berikutnya ia harus membayar Rp1.500 per baris, dan untuk hari-­hari berikutnya ia harus membayar Rp1.000 per baris. Jika ia membayar Rp60.000, berapa hari iklan itu dipasang?',
    jawaban: ['20 hari', '30 hari', '16 hari', '15 hari', '10 hari']
  },
  {
    id: 37,
    jenis: 'Tes Aritmatika',
    petunjuk:
      'Soal­-soal aritmatika terdiri dari soal-­soal hitungan sederhana, konsep aljabar, dan permasalahan aritmatika lainnya. Setiap soal disertai dengan lima pilihan jawaban. Jawablah setiap soal dengan cara memilih satu dari lima jawaban yang ada.',
    pertanyaan:
      'Sebuah perusahaan mempekerjakan 3 kali jumlah karyawan dari tahun lalu. Tahun lalu jumlah pekerja adalah 29 orang dan yang berhenti sebanyak 3 orang sedangkan yang masuk adalah 2  kali dari jumlah yang keluar. Berapa jumlah karyawan perusahaan tersebut pada tahun ini?',
    jawaban: ['87 orang', '69 orang', '86 orang', '76 orang', '96 orang']
  },
  {
    id: 38,
    jenis: 'Tes Aritmatika',
    petunjuk:
      'Soal­-soal aritmatika terdiri dari soal-­soal hitungan sederhana, konsep aljabar, dan permasalahan aritmatika lainnya. Setiap soal disertai dengan lima pilihan jawaban. Jawablah setiap soal dengan cara memilih satu dari lima jawaban yang ada.',
    pertanyaan:
      'Sanjaya mendapatkan nilai 82 untuk IPA, 78 untuk IPS, 98 untuk Matematika, dan 86 untuk Bahasa Inggris. Apabila Sanjaya ingin mendapatkan nilai rata-rata 87, berapakah nilai untuk Bahasa Indonesia yang harus didapat?',
    jawaban: ['91', '90', '89', '88', '87']
  },
  {
    id: 39,
    jenis: 'Tes Aritmatika',
    petunjuk:
      'Soal­-soal aritmatika terdiri dari soal-­soal hitungan sederhana, konsep aljabar, dan permasalahan aritmatika lainnya. Setiap soal disertai dengan lima pilihan jawaban. Jawablah setiap soal dengan cara memilih satu dari lima jawaban yang ada.',
    pertanyaan:
      'Setiap anak di TK Semesta mendapatkan kue bolu kukus sebanyak 3 buah, sedangkan persediaan bolu kukus sebanyak 150 buah, maka berapa banyak anak murid di TK Semesta apabila ada 14 anak murid yang tidak masuk pada hari pembagian kue tersebut?',
    jawaban: ['50', '52', '58', '64', '68']
  },
  {
    id: 40,
    jenis: 'Tes Aritmatika',
    petunjuk:
      'Soal­-soal aritmatika terdiri dari soal-­soal hitungan sederhana, konsep aljabar, dan permasalahan aritmatika lainnya. Setiap soal disertai dengan lima pilihan jawaban. Jawablah setiap soal dengan cara memilih satu dari lima jawaban yang ada.',
    pertanyaan:
      'Dalam pekerjaan membangun rumah, 25 orang mampu menyelesaikan pekerjaan tersebut selama 3 minggu. Apabila pekerjaan membangun rumah tersebut dikerjakan oleh 40 orang, maka berapa hari lebih cepatkah daripada ketika dikerjakan oleh 25 orang?',
    jawaban: ['2 hari', '5 hari', '7 hari', '9 hari', '11 hari']
  },
  {
    id: 41,
    jenis: 'Tes Deretan Angka',
    petunjuk:
      'Masing-­masing soal terdiri dari suatu deretan angka yang belum selesai. Setiap soal disertai dengan lima pilihan jawaban yang ada di bawahnya. Angka-­angka tersebut berderet mengikuti suatu prinsip tertentu. Pilihlah satu jawaban untuk menyelesaikan deretan angka itu, sesuai dengan prinsip yang mendasari.',
    pertanyaan: '3 5   8  12  17  23 ...   .....',
    jawaban: ['30 dan 37', '29 dan 36', '29 dan 37', '31 dan 39', '30 dan 38']
  },
  {
    id: 42,
    jenis: 'Tes Deretan Angka',
    petunjuk:
      'Masing-­masing soal terdiri dari suatu deretan angka yang belum selesai. Setiap soal disertai dengan lima pilihan jawaban yang ada di bawahnya. Angka-­angka tersebut berderet mengikuti suatu prinsip tertentu. Pilihlah satu jawaban untuk menyelesaikan deretan angka itu, sesuai dengan prinsip yang mendasari.',
    pertanyaan: '0 5   12   21   32 ...',
    jawaban: ['37', '39', '43', '45', '47']
  },
  {
    id: 43,
    jenis: 'Tes Deretan Angka',
    petunjuk:
      'Masing-­masing soal terdiri dari suatu deretan angka yang belum selesai. Setiap soal disertai dengan lima pilihan jawaban yang ada di bawahnya. Angka-­angka tersebut berderet mengikuti suatu prinsip tertentu. Pilihlah satu jawaban untuk menyelesaikan deretan angka itu, sesuai dengan prinsip yang mendasari.',
    pertanyaan: '5  9   7   11   9   13 ...  .....',
    jawaban: ['17 dan 15', '17 dan 21', '11 dan 15', '11 dan 9', '15 dan 19']
  },
  {
    id: 44,
    jenis: 'Tes Deretan Angka',
    petunjuk:
      'Masing-­masing soal terdiri dari suatu deretan angka yang belum selesai. Setiap soal disertai dengan lima pilihan jawaban yang ada di bawahnya. Angka-­angka tersebut berderet mengikuti suatu prinsip tertentu. Pilihlah satu jawaban untuk menyelesaikan deretan angka itu, sesuai dengan prinsip yang mendasari.',
    pertanyaan: '1 3   4   7   9   13   16   21   25 ...',
    jawaban: ['26', '27', '29', '31', '36']
  },
  {
    id: 45,
    jenis: 'Tes Deretan Angka',
    petunjuk:
      'Masing-­masing soal terdiri dari suatu deretan angka yang belum selesai. Setiap soal disertai dengan lima pilihan jawaban yang ada di bawahnya. Angka-­angka tersebut berderet mengikuti suatu prinsip tertentu. Pilihlah satu jawaban untuk menyelesaikan deretan angka itu, sesuai dengan prinsip yang mendasari.',
    pertanyaan: (
      <span>
        Tentukanlah dua bilangan yang paling tepat dari deret bilangan di bawah
        ini :<br /> 3 7 18 26 33 45 48 ... ...
      </span>
    ),
    jawaban: ['63 dan 67', '63 dan 62', '64 dan 63', '64 dan 66', '64 dan 65']
  },
  {
    id: 46,
    jenis: 'Tes Deretan Angka',
    petunjuk:
      'Masing-­masing soal terdiri dari suatu deretan angka yang belum selesai. Setiap soal disertai dengan lima pilihan jawaban yang ada di bawahnya. Angka-­angka tersebut berderet mengikuti suatu prinsip tertentu. Pilihlah satu jawaban untuk menyelesaikan deretan angka itu, sesuai dengan prinsip yang mendasari.',
    pertanyaan: (
      <span>
        Tentukan nilai X, Y, dan Z dari deret bilangan di bawah ini : <br /> 1 0
        8 3 3 7 5 6 6 7 9 5 9 12 4 X Y Z
      </span>
    ),
    jawaban: [
      '1, 11, dan 15',
      '15, 11, dan 1',
      '11, 15, dan 3',
      '11, 1, dan 15',
      '1, 15, dan 16'
    ]
  },
  {
    id: 47,
    jenis: 'Tes Deretan Angka',
    petunjuk:
      'Masing-­masing soal terdiri dari suatu deretan angka yang belum selesai. Setiap soal disertai dengan lima pilihan jawaban yang ada di bawahnya. Angka-­angka tersebut berderet mengikuti suatu prinsip tertentu. Pilihlah satu jawaban untuk menyelesaikan deretan angka itu, sesuai dengan prinsip yang mendasari.',
    pertanyaan: (
      <span>
        Tentukanlah nilai X, Y, dan Z dari susunan bilangan di bawah ini :{' '}
        <br /> 3 4 6 9 10 12 15 16 18 21 X Y Z
      </span>
    ),
    jawaban: [
      '27, 24, dan 22',
      '27, 22, dan 24',
      '22, 24, dan 27',
      '24, 22, dan 27',
      '24, 27, dan 22'
    ]
  },
  {
    id: 48,
    jenis: 'Tes Deretan Angka',
    petunjuk:
      'Masing-­masing soal terdiri dari suatu deretan angka yang belum selesai. Setiap soal disertai dengan lima pilihan jawaban yang ada di bawahnya. Angka-­angka tersebut berderet mengikuti suatu prinsip tertentu. Pilihlah satu jawaban untuk menyelesaikan deretan angka itu, sesuai dengan prinsip yang mendasari.',
    pertanyaan: (
      <span>
        Tentukanlah nilai X dari bilangin berikut : <br />
        30 27 25 24 24 X{' '}
      </span>
    ),
    jawaban: ['25', '32', '36', '39', '55']
  },
  {
    id: 49,
    jenis: 'Tes Deretan Angka',
    petunjuk:
      'Masing-­masing soal terdiri dari suatu deretan angka yang belum selesai. Setiap soal disertai dengan lima pilihan jawaban yang ada di bawahnya. Angka-­angka tersebut berderet mengikuti suatu prinsip tertentu. Pilihlah satu jawaban untuk menyelesaikan deretan angka itu, sesuai dengan prinsip yang mendasari.',
    pertanyaan: (
      <span>
        Tentukanlah nilai X dari susunan bilangan berikut :<br />3 6 18 72 X
      </span>
    ),
    jawaban: ['56', '125', '300', '320', '360']
  },
  {
    id: 50,
    jenis: 'Tes Deretan Angka',
    petunjuk:
      'Masing-­masing soal terdiri dari suatu deretan angka yang belum selesai. Setiap soal disertai dengan lima pilihan jawaban yang ada di bawahnya. Angka-­angka tersebut berderet mengikuti suatu prinsip tertentu. Pilihlah satu jawaban untuk menyelesaikan deretan angka itu, sesuai dengan prinsip yang mendasari.',
    pertanyaan: (
      <span>
        Tentukanlah nilai X dari susunan bilangan berikut :<br />
        110 100 25 15 X 75
      </span>
    ),
    jawaban: ['125', '85', '56', '25', '22']
  },

  {
    id: 51,
    jenis: 'Tes Gambar',
    petunjuk:
      'Tentukan satu gambar dari gambar-gambar yang tidak mempunyai persamaan.',
    pertanyaan: '',
    jawaban: [
      '51pilihan1.svg',
      '51pilihan2.svg',
      '51pilihan3.svg',
      '51pilihan4.svg',
      '51pilihan5.svg'
    ]
  },
  {
    id: 52,
    jenis: 'Tes Gambar',
    petunjuk:
      'Tentukan satu gambar dari gambar-gambar yang tidak mempunyai persamaan.',
    pertanyaan: '',
    jawaban: [
      '52pilihan1.svg',
      '52pilihan2.svg',
      '52pilihan3.svg',
      '52pilihan4.svg',
      '52pilihan5.svg'
    ]
  },
  {
    id: 53,
    jenis: 'Tes Gambar',
    petunjuk:
      'Tentukan satu gambar dari gambar-gambar yang tidak mempunyai persamaan.',
    pertanyaan: '',
    jawaban: [
      '53pilihan1.svg',
      '53pilihan2.svg',
      '53pilihan3.svg',
      '53pilihan4.svg',
      '53pilihan5.svg'
    ]
  },
  {
    id: 54,
    jenis: 'Tes Gambar',
    petunjuk:
      'Tentukan satu gambar dari gambar-gambar yang tidak mempunyai persamaan.',
    pertanyaan: '',
    jawaban: [
      '54pilihan1.svg',
      '54pilihan2.svg',
      '54pilihan3.svg',
      '54pilihan4.svg',
      '54pilihan5.svg'
    ]
  },
  {
    id: 55,
    jenis: 'Tes Gambar',
    petunjuk:
      'Tentukan satu gambar dari gambar-gambar yang tidak mempunyai persamaan.',
    pertanyaan: '',
    jawaban: [
      '55pilihan1.svg',
      '55pilihan2.svg',
      '55pilihan3.svg',
      '55pilihan4.svg',
      '55pilihan5.svg'
    ]
  },
  {
    id: 56,
    jenis: 'Tes Gambar',
    petunjuk:
      'Tentukan gambar selanjutnya dari gambar-gambar tersebut di bawah ini.',
    pertanyaan: 'oal56.svg',

    jawaban: [
      '56pilihan1.svg',
      '56pilihan2.svg',
      '56pilihan3.svg',
      '56pilihan4.svg'
    ]
  },
  {
    id: 57,
    jenis: 'Tes Gambar',
    petunjuk:
      'Tentukan gambar selanjutnya dari gambar-gambar tersebut di bawah ini.',
    pertanyaan: 'soal57.svg',
    jawaban: [
      '57pilihan1.svg',
      '57pilihan2.svg',
      '57pilihan3.svg',
      '57pilihan4.svg',
      '57pilihan5.svg'
    ]
  },
  {
    id: 58,
    jenis: 'Tes Gambar',
    petunjuk:
      'Tentukan gambar selanjutnya dari gambar-gambar tersebut di bawah ini.',
    pertanyaan: 'soal58.svg',
    jawaban: [
      '58pilihan1.svg',
      '58pilihan2.svg',
      '58pilihan3.svg',
      '58pilihan4.svg',
      '58pilihan5.svg'
    ]
  },
  {
    id: 59,
    jenis: 'Tes Gambar',
    petunjuk:
      'Tentukan gambar selanjutnya dari gambar-gambar tersebut di bawah ini.',
    pertanyaan: 'soal59.svg',
    jawaban: [
      '59pilihan1.svg',
      '59pilihan2.svg',
      '59pilihan3.svg',
      '59pilihan4.svg',
      '59pilihan5.svg'
    ]
  },
  {
    id: 60,
    jenis: 'Tes Gambar',
    petunjuk:
      'Tentukan gambar selanjutnya dari gambar-gambar tersebut di bawah ini..',
    pertanyaan: 'soal60.svg',
    jawaban: [
      '60pilihan1.svg',
      '60pilihan2.svg',
      '60pilihan3.svg',
      '60pilihan4.svg',
      '60pilihan5.svg'
    ]
  }
];

export default soalTkd;
