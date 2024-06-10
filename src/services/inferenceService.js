const tf = require('@tensorflow/tfjs-node');
const InputError = require('../exceptions/InputError');

async function predictClassification(model, image) {
    try {
        let tensor = tf.node.decodeJpeg(image);
        tensor = tf.image.resizeBilinear(tensor, [224, 224]);
        tensor = tensor.expandDims(0); 
        tensor = tensor.toFloat().div(tf.scalar(255.0));
        

        const prediction = model.predict(tensor);
        const score = await prediction.data();

        console.log('Prediction scores:', score);

        const maxScore = Math.max(...score);
        const classIndex = score.indexOf(maxScore);
        const confidenceScore = maxScore * 100; 

        const classesName = [
            'Betawi',
            'Cendrawasih',
            'Dayak',
            'Jlamprang',
            'Kawung',
            'Mega Mendung',
            'Parang',
            'Sidoluhur',
            'Tambal',
            'Tugu Muda',
        ];

        const originName = [
            'Jakarta',
            'Papua',
            'Kalimantan',
            'Pekalongan, Jawa Tengah',
            'Solo dan Yogyakarta',
            'Cirebon, Jawa Barat',
            'Solo dan Yogyakarta',
            'Yogyakarta dan Surakarta',
            'DIY dan Jawa Tengah',
            'Semarang, Jawa Tengah',
        ];

        const filosofiMotif = [
            'Motif batik Betawi memiliki penggambaran makhluk hidup hanya sebagai simbol untuk menyampaikan pesan.Salah satunya ialah buaya yang oleh masyarakat Betawi dianggap sebagai simbol kesetiaan kepada pasangan hidup. Selain itu, terdapat juga motif ondel-ondel dan tanjidor. Ondel-ondel dimaknai sebagai penolak bencana dan pengusir makhluk halus yang gentayangan. Sedangkan Tanjidor adalah orkes khas kesenian Betawi yang menggunakan alat musik tiup.',
            'Motif batik Cendrawasih melambangkan kekayaan, keindahan, dan keanggunan alam dan fauna Papua',
            'Motif batik Dayak terinspirasi dari bunga kenanga memiliki makna bahwa siapa pun yang memakai batik motif ini bisa memberi manfaat pada orang sekitar, seperti halnya kenanga yang harum dan memiliki banyak manfaat.',
            'Kegunaaan  motif  batik jlamprang dalam bentuk pemakaian kain batik secara sakral menyimbolkan jika batik jlamprang merupakan media yang digunakan untuk menghubungkan antara dunia manusia dan dunia dewa karena bentuk motifnya merupakan simbol mistis yang bisa diterima oleh dunia “Hyang”  yang menjadi dunianya ” Den Ayu Lanjar “. Dengan kata lain, Batik Jlamprang adalah warisan budaya kasmologis yang dipakai sebagai medium untuk menghubungkan dunia manusia (dunia bawah) dengan dunia para dewa( dunia atas atau dunia kayangan ).',
            'Kata Kawung memiliki makna buah kolang-kaling dari pohon aren. Buah Kawung berwarna putih dengan ukuran kecil dan berbentuk lonjong. Pola batik Kawung dibentuk dengan menyusun 4 bulatan Kawung dan 1 di tengah yang menggambarkan sepasar dalam budaya Jawa. Sepasar adalah satuan hari di Jawa, yakni; Legi, Pahing, Pon, Wage, Kliwon. Pola ini menjadi simbol hubungan masyarakat yang gotong-royong dan saling berdekatan sehingga masyarakat desa hidup damai sejahtera serta rukun satu sama lain.',
            'Motif batik Mega Mendung melambangkan pemberian harapan akan turunnya hujan yang penting untuk menyuburkan pertanian.',
            'Nama parang sendiri, diadopsi dari kata pereng yang memiliki makna lereng atau batuan karang. Motif batik ini pertama kali diciptakan oleh Panembahan Senopati yang saat itu tengah duduk mengamati gerak ombak laut selatan yang menerpa karang. Motif batik parang juga menggambarkan garis menurun dari tinggi ke rendah secara diagonal. Ini menandakan lambang penghormatan, cita-cita, dan kesetiaan pada nilai-nilai yang benar. Sedangkan, untuk jalinan motif yang tidak terputus, merepresentasikan kesinambungan.',
            'Motif batik Sidoluhur memiliki makna harapan untuk dapat mencapai kedudukan tinggi, dan bisa menjadi contoh atau panutan masyarakat.',
            'Motif batik Tambal melambangkan harapan untuk perbaikan, kebahagiaan, dan kebersamaan.',
            'Motif batik Tugu Muda melambangkan semangat perjuangan dan kemerdekaan.',
        ];

        const shortInsight = [
            'Corak batik Betawi memperoleh pengaruh dari kebudayaan Tiongkok, terutama dalam penggunaan warna dasar. Batik Betawi menggunakan warna merah, hijau, kuning, dan biru yang cerah. Pengaruh budaya Islam juga terlihat pada motif yang tergambar pada kain batik. Motif batik Betawi memiliki medali, wajit, dan kembang. Beberapa motifnya juga memiliki gambar kaligrafi yang menjadi ciri khas motif Timur Tengah. Penggunaan kaligrafi diperkenalkan oleh Kesultanan Demak dan Kesultanan Cirebon melalui batik Demak dan Batik Cirebon.',
            'Burung cendrawasih menginspirasi motif batik cendrawasih. Biasanya motif ini memadukan gambar burung cendrawasih dengan gambar tumbuhan dan bunga khas Papua. Batik Cendrawasih memiliki makna yang tersirat. Cendrawasih dianggap sebagai burung surga dan masyarakat setempat memiliki kepercayaan bahwa burung tersebut menghubungkan kehidupan surga dan bumi. Tak heran jika fauna endemik tersebut menjadi simbol yang sakral bagi masyarakat Papua.',
            'Motif batik Dayak mencerminkan budaya masyarakat Dayak. Istilah Dayak yang mempunyai arti “sungai”. Sehingga batik ini menggambarkan bermacam-macam aktivitas yang sering berkaitan dengan sungai. Secara umum batik Kalimantan memiliki ciri khas warna yang mencolok, berani, dan warna- warni.',
            'Motif Batik Pekalongan adalah Motif Jlamprang yaitu suatu motif yang berbentuk semacam nitik dari yogyakarta yang disebut juga dengan motif batik geometris biasanya berbentuk lingkaran maupun segitiga. Motif Batik Jlamprang Pekalongan mendapatkan inspirasi motif batik yang dari para pedagang asal Gujarat, India. Yaitu, dari kain tenun yang berbahan sutra yang dibduuat dengan teknik ikat dobel atau patola.  Kemudian oleh masyarakat pekalongan  diadopsi ke dalam motif batik yang serupa motif tenun tersebut. Jadilah Motif Jlamprang berupa ceplok yang terdiri dari bentuk bujur sangkar dan persegi panjang yang disusun menyerupai anyaman pada kain tenun patola.  Ditambah dengan warna-warna khas  Batik Pesisir Pekalongan, Tercipta motif jlamprang yang indah. Pada  waktu pendudukan Belanda dimasa lalu, sedangkan warna-warna cerah pada batik pekalongan dipengaruh kuat oleh Cina, India dan Arab. Pengaruh tersebut dibawa langsung oleh para pedagang yang yang melakukan perniagaan di negri Indonesia dan singgah di Pekalongan.',
            'Jenis dari motif batik Kawung sendiri sangat beragam. Pembagian tersebut berdasarkan dari pola, ukuran, dan motif perpaduan. Berdasarkan Pola, batik Kawung terbagi menjadi beberapa jenis yaitu batik Kawung Kopi, Kawung Sekar Ageng, Kawung semar, Kawung Sari, dan Kawung Geger. Berdasarkan Ukuran, batik Kawung terbagi menjadi batik Kawung Kemplong, Kawung Sen, Kawung Bribil, dan Kawung Picis. Berdasarkan Motif Perpaduan, batik Kawung terbagi menjadi batik Kawung Kembang, Kawung Seling, dan Kawung Buntal.',
            'Motif batik Mega Mendung ditandai dengan pola awan yang berlapis-lapis dan bergelombang. Warna biru sering digunakan, tetapi variasi warna lain seperti merah, hijau, dan ungu juga dapat ditemukan. motif batik Mega Mendung ini, berawal dari kedatangan bangsa Cina ke Cirebon. Kedatangan Cina turut menambah wawasan masyarakat pribumi, serta menularkan berbagai kesenian dari negeri Tiongkok tersebut, termasuk pembuatan motif kain sutra dari zaman Dinasti Ming dan Ching. Pola geometris elemen-elemen Cina kemudian diadaptasi oleh perajin batik Cirebon menjadi motif awan yang dikenal sebagai Mega Mendung. Jejak budaya Tionghoa juga terlihat dalam motif batik Jawa yang menggabungkan simbol-simbol seperti naga (liong), banji, hingga citra burung hong (phoenix).',
            'Motif Batik Parang dikenal sebagai motif batik tertua, diprediksi sudah ada sejak zaman Keraton Mataram. Batik Parang memiliki dua bentuk, yakni gareng dan mlinjon. Gareng berbentuk seperti lengkungan dan Mlinjon sendiri, lebih seperti menyerupai belah ketupat. Batik ini disebut Gareng yang berasal dari nama tokoh pewayangan Gareng, yang juga merupakan simbol dari kebijaksanaan. Sementara motif Mlinjon sendiri, tersusun rapi sejajar dengan memiliki ujung lancip seperti ketupat. Mlinjon sendiri dimaknai sebagai sebuah awal dari kehidupan manusia di muka bumi.',
            'Motif batik Sido Luhur dibuat oleh Ki Ageng Henis, adalah kakek dari Panembahan Senopati yang merupakan pendiri kerajaan Mataram Jawa, serta merupakan cucu daripada Ki Ageng Selo. Konon motif batik Sido Luhur ini dibuat secara khusus oleh Ki Ageng Henis untuk diberikan kepada anak dan keturunannya, dengan harapan dan doa agar si pemakai dapat memiliki hati serta pikiran yang luhur sehingga bisa berguna bagi negara dan masyarakat.',
            'Motif batik Tambal memiliki ciri khas berupa motif segiempat yang tercipta dari bidang segitiga dan kombinasi warna yang beragam. Motif Tambal kadang-kadang juga diartikan sebagai cerminan dari kehidupan yang penuh liku dan keberagaman namun tetap dapat membentuk keseluruhan yang harmonis',
            'Motif batik Tugu Muda adalah hasil kreasi Oentoeng Suwardi dan istrinya, Tamsiyati, yang merupakan pemilik perusahaan batik Sri Retno dari tahun 1973 hingga 1982. Motif ini menampilkan Tugu Muda yang dikelilingi oleh sulur atau tanaman menjalar. Pola ini terinspirasi oleh Tugu Muda, monumen yang dibuat untuk memperingati Pertempuran Lima Hari di Semarang, sebagai penghormatan kepada para pahlawan. Oleh karena itu, motif batik Tugu Muda mencerminkan nilai-nilai patriotisme, keberanian, dan semangat juang yang kuat untuk meraih kemerdekaan dan mempertahankannya.',
        ];

        const manufacturingMethod = [
            'Batik Betawi, dibuat dengan cara menggambar motif pada kain menggunakan pensil atau dapat menggunakan stempel (cap khusus) untuk membuat pola batik yang sama pada setiap kain. Pada kain yang tidak ingin bewarna, aplikasikan lilin malam menggunakan canting. Tahap ketiga adalah pewarnaan yang dibagi menjadi 2 tahap agar warna yang dihasilkan lebih kuat. Tahap keempat adalah menghilangkan lilin malam dengan cara merendam kain dalam air panas. Tahap terakhir adalah pengeringan, pengetingan dilakukan dengan cara menjemur kain batik di bawah sinar matahari secara langsung.',
            'Motif Cendrawasih dibuat dengan beberapa metode, di antaranya tulis dan cap atau printing. Batik Cendrawasih atau motif Papua pada umumnya menggunakan 3 jenis bahan: katun, sutra dan shantung. Tiap-tiap bahan memiliki kelebihannya masing-masing. Warna-warna yang terang dan cerah pada umumnya menggunakan jenis pewarna sintetis. Namun, ada juga yang dihasilkan dari pewarna alami.',
            'Tahapan yang pertama dimulai dari menyiapkan peralatan dan bahan baku berupa kain dobi, rayon kembang, sutra bermotif, sutra polos, pewarna, lilin, malam dan soda. Bahan-bahan baku ini biasanya didatangkan dari pulau Jawa. Lalu tahapan selanjutnya adalah pengecapan atau pemberian motif pada kain yang polos menggunakan canting. Dilanjutkan dengan pencoletan atau pemberian warna ke dalam motif yang sudah dibuat. Setelah itu, kain yang telah bermotif diberi warna dasar seperti warna prosen atau warna neptol, biasanya tahap ini disebut dengan penjegeran. Tahap berikutnya yang juga finalisasi yaitu plorotan atau perebusan kain untuk membersihkan yang masih melekat pada motif kain. Setelah kain direbus, kemudian dicuci sampai bersih lalu dijemur.',
            'Batik Jlamprang, dibuat dengan cara menggambar motif pada kain menggunakan pensil atau dapat menggunakan stempel (cap khusus) untuk membuat pola batik yang sama pada setiap kain. Pada kain yang tidak ingin bewarna, aplikasikan lilin malam menggunakan canting. Tahap ketiga adalah pewarnaan yang dibagi menjadi 2 tahap agar warna yang dihasilkan lebih kuat. Tahap keempat adalah menghilangkan lilin malam dengan cara merendam kain dalam air panas. Tahap terakhir adalah pengeringan, pengetingan dilakukan dengan cara menjemur kain batik di bawah sinar matahari secara langsung.',
            'Batik Kawung, dibuat dengan cara menggambar motif pada kain menggunakan pensil atau dapat menggunakan stempel (cap khusus) untuk membuat pola batik yang sama pada setiap kain. Pada kain yang tidak ingin bewarna, aplikasikan lilin malam menggunakan canting. Tahap ketiga adalah pewarnaan yang dibagi menjadi 2 tahap agar warna yang dihasilkan lebih kuat. Tahap keempat adalah menghilangkan lilin malam dengan cara merendam kain dalam air panas. Tahap terakhir adalah pengeringan, pengetingan dilakukan dengan cara menjemur kain batik di bawah sinar matahari secara langsung.',
            'Dahulu batik mega mendung dibuat dengan teknik batik tulis dan batik cap. Namun dengan pertimbangan ekonomis, saat ini kain batik motif mega mendung banyak diproduksi secara besar-besaran dengan teknik sablon(printing). Pada teknik batik tulis, Batik Mega Mendung dibuat dengan cara menggambarkan pola lalu melapisi pola denga lilin panas menggunakan canting hingga mengeras, lalu kain akan diwarnai. setelah diberi warna , akan dilakukan proses pelepasan lapisan lilin dan akan dilakukan proses finishing.',
            'Batik Parang, dibuat dengan cara menggambar motif pada kain menggunakan pensil atau dapat menggunakan stempel (cap khusus) untuk membuat pola batik yang sama pada setiap kain. Pada kain yang tidak ingin bewarna, aplikasikan lilin malam menggunakan canting. Tahap ketiga adalah pewarnaan yang dibagi menjadi 2 tahap agar warna yang dihasilkan lebih kuat. Tahap keempat adalah menghilangkan lilin malam dengan cara merendam kain dalam air panas. Tahap terakhir adalah pengeringan, pengetingan dilakukan dengan cara menjemur kain batik di bawah sinar matahari secara langsung.',
            'Batik Sidoluhur, dibuat dengan cara menggambar motif pada kain menggunakan pensil atau dapat menggunakan stempel (cap khusus) untuk membuat pola batik yang sama pada setiap kain. Pada kain yang tidak ingin bewarna, aplikasikan lilin malam menggunakan canting. Tahap ketiga adalah pewarnaan yang dibagi menjadi 2 tahap agar warna yang dihasilkan lebih kuat. Tahap keempat adalah menghilangkan lilin malam dengan cara merendam kain dalam air panas. Tahap terakhir adalah pengeringan, pengetingan dilakukan dengan cara menjemur kain batik di bawah sinar matahari secara langsung.',
            'Metode pembuatan batik tambal dimulai dengan pemilihan kain-kain dengan warna dan pola berbeda. setelah kain dipilih, akan dilakukan pengaturan pola dengan menyusun potongan kain sesuai dengan desain yang diinginkan. Dengan kata lain, batik tambal ini dibuat dengan cara menggabungkan atau "menambal" berbagai macam motif batik lainnya dalam bidang-bidang segitiga yang disusun sedemikian rupa.',
            ' Proses pembuatan batik motif tugu muda dimulai dengan penggambaran desain dengan pensil atau alat tulis untuk batik, lalu dilanjutkan dengan proses pemetaan warna. Setelah itu akan dilakukan proses canting untuk menambahkan detail-detail halus pada motif dan memberikan dimensi yang lebih mendalam.. Tahapan terakhir adalah dengan melakukan pewarnaan lanjutan dan finishing dengan mengunci warna dan memberikan kilauan pada batik yang telah selesai.',
        ]

        const predictedClass = classesName[classIndex];
        const predictedOrigin = originName[classIndex];
        const filosofi = filosofiMotif[classIndex];
        const insight = shortInsight[classIndex];
        const method = manufacturingMethod[classIndex];

        let suggestion;
        if (confidenceScore > 50) {
            suggestion = `Batik ${predictedClass} ditemukan pada gambar yang Anda unggah dari ${predictedOrigin}`;
        } else {
            suggestion = 'Batik tidak ditemukan pada gambar yang Anda unggah';
        }

        return {
            label: predictedClass,
            origin: predictedOrigin,
            filosofi: filosofi,
            shortInsight: insight,
            manufacturingMethod: method,
            confidenceScore,
            suggestion
        };

    } catch (error) {
        if (error instanceof InputError) {
            throw error;
        } else {
            console.error('An unexpected error occurred:', error);
        }
    }
}

module.exports = predictClassification;
