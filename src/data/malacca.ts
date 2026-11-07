import type { GameBlueprint } from '../types'

export const malaccaBm: GameBlueprint = {
  title: 'Legenda Selat Melaka',
  theme: 'Kesultanan Melayu Melaka · Pengembaraan Sejarah',
  story_intro:
    'Tahun 1400-an. Selat Melaka berkilau di bawah matahari, dan kapal-kapal dari China, India serta Arab berlabuh di pelabuhan. Anda seorang penjelajah muda yang tiba di gerbang kota. Tiga ujian menanti: fahami asal usul kerajaan, kuasai istiadat istana, dan bertahan dalam badai terakhir. Kumpul lencana dan jadilah penjaga warisan.',
  mechanics: {
    hp: 5,
    points_per_correct: 100,
    badges: ['Penjelajah Selat', 'Penjaga Istana', 'Pahlawan Melaka', 'Warisan Agung'],
  },
  levels: [
    {
      id: 'level-1',
      name: 'Gerbang Kota Melaka',
      scene: 'pelabuhan',
      difficulty: 'Mudah',
      objective_ids: ['obj-1', 'obj-2'],
      narrative:
        'Kapal-kapal dagang beratur di ufuk dan bunyi gong memanggil pedagang ke jeti. Di sebalik kesibukan pelabuhan, sebuah kerajaan sedang bangkit. Jawab dengan tepat untuk membuka gerbang kota.',
      image_prompt:
        'Stylised 2D game backdrop of a bustling 15th-century Malacca harbour at golden hour, wooden ships, palm trees, A Famosa hill silhouette, warm teal and gold palette, painterly, no text',
      questions: [
        {
          id: 'm1-q1',
          type: 'mcq',
          text: 'Siapakah pengasas Kesultanan Melayu Melaka?',
          options: [
            'Parameswara',
            'Sultan Alauddin Riayat Shah',
            'Raja Bersiong',
            'Sultan Mahmud Shah',
          ],
          answer: 'Parameswara',
          explanation:
            'Parameswara, putera Palembang, membuka Melaka sekitar tahun 1400 dan menjadi pemerintah pertama.',
          objective_id: 'obj-1',
        },
        {
          id: 'm1-q2',
          type: 'mcq',
          text: 'Apakah gelaran Parameswara selepas memeluk Islam?',
          options: [
            'Sultan Iskandar Shah',
            'Sultan Mansur Shah',
            'Sultan Muzaffar Shah',
            'Sultan Ahmad Shah',
          ],
          answer: 'Sultan Iskandar Shah',
          explanation:
            'Parameswara memeluk Islam dan menggunakan gelaran Sultan Iskandar Shah.',
          objective_id: 'obj-1',
        },
        {
          id: 'm1-q3',
          type: 'puzzle',
          text: 'Lengkapkan: Melaka terletak di tepi ____ Melaka, laluan perdagangan utama dunia.',
          answer: 'Selat',
          explanation:
            'Kedudukan di tepi Selat Melaka menjadikannya tempat persinggahan kapal dagang dari timur dan barat.',
          objective_id: 'obj-2',
        },
        {
          id: 'm1-q4',
          type: 'mcq',
          text: 'Mengapakah Melaka menjadi pusat perdagangan yang terkenal?',
          options: [
            'Kedudukan strategik di Selat Melaka',
            'Tanahnya terlalu sejuk untuk bercucuk tanam',
            'Tiada pelabuhan lain di Asia',
            'Ia terletak di kawasan pergunungan',
          ],
          answer: 'Kedudukan strategik di Selat Melaka',
          explanation:
            'Lokasi di tengah laluan timur–barat serta perlindungan daripada angin monsun menjadikan Melaka pelabuhan yang selamat dan sibuk.',
          objective_id: 'obj-2',
        },
        {
          id: 'm1-q5',
          type: 'puzzle',
          text: 'Apakah jawatan pemimpin pelabuhan yang menguruskan pedagang asing di Melaka?',
          answer: 'Syahbandar',
          explanation:
            'Syahbandar mengurus hal ehwal pedagang asing dan memastikan urusan perdagangan berjalan lancar.',
          objective_id: 'obj-2',
        },
      ],
    },
    {
      id: 'level-2',
      name: 'Dewan Singgahsana',
      scene: 'istana',
      difficulty: 'Sederhana',
      objective_ids: ['obj-3', 'obj-4'],
      narrative:
        'Di dalam istana, adat dan undang-undang mengikat setiap keputusan. Sultan memerintah dengan nasihat Bendahara, sementara Hukum Kanun Melaka menjadi pedoman. Buktikan kebijaksanaan anda di hadapan pembesar.',
      image_prompt:
        'Ornate 15th-century Malay palace interior, carved timber, songket textiles, golden throne, candlelight, deep indigo and gold palette, painterly 2D game background, no text',
      questions: [
        {
          id: 'm2-q1',
          type: 'mcq',
          text: 'Siapakah pembesar yang mengetuai pentadbiran dan menjadi penasihat utama Sultan?',
          options: ['Bendahara', 'Temenggung', 'Laksamana', 'Syahbandar'],
          answer: 'Bendahara',
          explanation:
            'Bendahara ialah ketua pembesar yang membantu Sultan dalam pentadbiran dan menjadi penasihat utama.',
          objective_id: 'obj-3',
        },
        {
          id: 'm2-q2',
          type: 'mcq',
          text: 'Apakah tugas utama Temenggung?',
          options: [
            'Menjaga keamanan dan keselamatan dalam negeri',
            'Mengurus perdagangan asing',
            'Mengetuai angkatan laut',
            'Menyimpan khazanah diraja',
          ],
          answer: 'Menjaga keamanan dan keselamatan dalam negeri',
          explanation:
            'Temenggung bertanggungjawab menjaga keamanan, termasuk menangkap penjenayah dan mengawal bandar.',
          objective_id: 'obj-3',
        },
        {
          id: 'm2-q3',
          type: 'puzzle',
          text: 'Apakah nama undang-undang bertulis utama Kesultanan Melayu Melaka?',
          answer: 'Hukum Kanun Melaka|Hukum Kanun',
          explanation:
            'Hukum Kanun Melaka mengandungi 44 fasal dan menjadi asas undang-undang serta pentadbiran negeri.',
          objective_id: 'obj-3',
        },
        {
          id: 'm2-q4',
          type: 'mcq',
          text: 'Apakah kesan kedatangan Islam terhadap masyarakat Melaka?',
          options: [
            'Memperkenalkan tulisan Jawi serta adat istiadat Islam',
            'Menghapuskan kegiatan perdagangan',
            'Menutup pelabuhan kepada pedagang asing',
            'Menukar bahasa rasmi kepada bahasa Latin',
          ],
          answer: 'Memperkenalkan tulisan Jawi serta adat istiadat Islam',
          explanation:
            'Islam membawa pengaruh dalam tulisan Jawi, undang-undang, adat istiadat, seni bina dan kesusasteraan.',
          objective_id: 'obj-4',
        },
        {
          id: 'm2-q5',
          type: 'puzzle',
          text: 'Apakah nama tulisan yang diperkenalkan melalui pengaruh Islam di Melaka?',
          answer: 'Jawi|Tulisan Jawi',
          explanation:
            'Tulisan Jawi digunakan dalam urusan pentadbiran, surat-menyurat dan karya sastera Melaka.',
          objective_id: 'obj-4',
        },
      ],
    },
    {
      id: 'level-3',
      name: 'Badai 1511',
      scene: 'medan_perang',
      difficulty: 'Cabar',
      objective_ids: ['obj-5'],
      narrative:
        'Tahun 1511. Armada Portugis muncul di ufuk dan meriam bergema di seberang selat. Pertahanan Melaka diuji, dan setiap keputusan menentukan sama ada warisan ini terus hidup. Bersedia menghadapi badai terakhir?',
      image_prompt:
        'Dramatic 2D game battlefield at dusk, Malacca fortress walls, Portuguese ships on the horizon, smoke and embers, deep red and navy palette, cinematic painterly, no text',
      questions: [
        {
          id: 'm3-q1',
          type: 'mcq',
          text: 'Pada tahun bilakah Melaka jatuh ke tangan Portugis?',
          options: ['1511', '1400', '1641', '1786'],
          answer: '1511',
          explanation:
            'Melaka jatuh kepada Portugis pada tahun 1511 selepas serangan yang diketuai Alfonso de Albuquerque.',
          objective_id: 'obj-5',
        },
        {
          id: 'm3-q2',
          type: 'mcq',
          text: 'Siapakah pemimpin Portugis yang mengetuai serangan ke atas Melaka pada 1511?',
          options: [
            'Alfonso de Albuquerque',
            'Vasco da Gama',
            'Ferdinand Magellan',
            'Christopher Columbus',
          ],
          answer: 'Alfonso de Albuquerque',
          explanation:
            'Alfonso de Albuquerque mengetuai ekspedisi Portugis yang menawan Melaka pada 1511.',
          objective_id: 'obj-5',
        },
        {
          id: 'm3-q3',
          type: 'puzzle',
          text: 'Lengkapkan: Kelemahan ____ dalam kalangan pembesar menjadi salah satu faktor kemerosotan Melaka.',
          answer: 'perpaduan|persefahaman',
          explanation:
            'Perpecahan dan persaingan dalam kalangan pembesar melemahkan pentadbiran serta pertahanan Melaka.',
          objective_id: 'obj-5',
        },
        {
          id: 'm3-q4',
          type: 'mcq',
          text: 'Antara berikut, yang manakah faktor dalaman kemerosotan Melaka?',
          options: [
            'Persaingan dan kelemahan kepimpinan pembesar',
            'Kekurangan kapal di pelabuhan',
            'Tiada hasil rempah di Melaka',
            'Ketiadaan pedagang asing',
          ],
          answer: 'Persaingan dan kelemahan kepimpinan pembesar',
          explanation:
            'Persaingan pembesar, kelemahan pentadbiran dan kurangnya sokongan rakyat melemahkan Melaka dari dalam.',
          objective_id: 'obj-5',
        },
        {
          id: 'm3-q5',
          type: 'puzzle',
          text: 'Siapakah Sultan Melaka ketika Melaka jatuh pada tahun 1511?',
          answer: 'Sultan Mahmud Shah|Sultan Mahmud',
          explanation:
            'Sultan Mahmud Shah memerintah ketika Melaka jatuh dan kemudian berundur ke Johor.',
          objective_id: 'obj-5',
        },
      ],
    },
  ],
}

export const malaccaEn: GameBlueprint = {
  title: 'Legends of the Malacca Strait',
  theme: 'The Malacca Sultanate · A History Adventure',
  story_intro:
    'The 1400s. The Strait of Malacca glitters under the sun as ships from China, India and Arabia crowd the harbour. You are a young explorer arriving at the city gates. Three trials await: understand the kingdom’s origins, master the palace court, and survive the final storm. Collect badges and become a guardian of heritage.',
  mechanics: {
    hp: 5,
    points_per_correct: 100,
    badges: ['Strait Explorer', 'Palace Guardian', 'Malacca Warrior', 'Grand Legacy'],
  },
  levels: [
    {
      id: 'level-1',
      name: 'Gates of Malacca',
      scene: 'pelabuhan',
      difficulty: 'Easy',
      objective_ids: ['obj-1', 'obj-2'],
      narrative:
        'Trade ships line the horizon and a gong calls merchants to the jetty. Behind the bustle, a kingdom is rising. Answer correctly to open the city gates.',
      image_prompt:
        'Stylised 2D game backdrop of a bustling 15th-century Malacca harbour at golden hour, wooden ships, palm trees, A Famosa hill silhouette, warm teal and gold palette, painterly, no text',
      questions: [
        {
          id: 'm1-q1',
          type: 'mcq',
          text: 'Who founded the Malacca Sultanate?',
          options: [
            'Parameswara',
            'Sultan Alauddin Riayat Shah',
            'Raja Bersiong',
            'Sultan Mahmud Shah',
          ],
          answer: 'Parameswara',
          explanation:
            'Parameswara, a prince of Palembang, founded Malacca around 1400 and became its first ruler.',
          objective_id: 'obj-1',
        },
        {
          id: 'm1-q2',
          type: 'mcq',
          text: 'What title did Parameswara adopt after converting to Islam?',
          options: [
            'Sultan Iskandar Shah',
            'Sultan Mansur Shah',
            'Sultan Muzaffar Shah',
            'Sultan Ahmad Shah',
          ],
          answer: 'Sultan Iskandar Shah',
          explanation:
            'Parameswara converted to Islam and took the title Sultan Iskandar Shah.',
          objective_id: 'obj-1',
        },
        {
          id: 'm1-q3',
          type: 'puzzle',
          text: 'Complete: Malacca sits beside the Strait of ____, a major world trade route.',
          answer: 'Malacca|Melaka',
          explanation:
            'Its position beside the Strait of Malacca made it a stopping point for ships from east and west.',
          objective_id: 'obj-2',
        },
        {
          id: 'm1-q4',
          type: 'mcq',
          text: 'Why did Malacca become a famous trading centre?',
          options: [
            'Its strategic position on the Strait of Malacca',
            'Its land was too cold for farming',
            'There were no other ports in Asia',
            'It was located in the mountains',
          ],
          answer: 'Its strategic position on the Strait of Malacca',
          explanation:
            'Its location along the east–west route and shelter from monsoon winds made Malacca a safe, busy port.',
          objective_id: 'obj-2',
        },
        {
          id: 'm1-q5',
          type: 'puzzle',
          text: 'Which official managed foreign merchants at the port of Malacca?',
          answer: 'Syahbandar|Harbourmaster|Harbor master',
          explanation:
            'The Syahbandar handled foreign traders and kept port affairs running smoothly.',
          objective_id: 'obj-2',
        },
      ],
    },
    {
      id: 'level-2',
      name: 'The Throne Hall',
      scene: 'istana',
      difficulty: 'Medium',
      objective_ids: ['obj-3', 'obj-4'],
      narrative:
        'Inside the palace, custom and law bind every decision. The Sultan rules with the Bendahara’s counsel, while the Malacca Legal Code guides the court. Prove your wisdom before the nobles.',
      image_prompt:
        'Ornate 15th-century Malay palace interior, carved timber, songket textiles, golden throne, candlelight, deep indigo and gold palette, painterly 2D game background, no text',
      questions: [
        {
          id: 'm2-q1',
          type: 'mcq',
          text: 'Which noble led the administration and served as the Sultan’s chief adviser?',
          options: ['Bendahara', 'Temenggung', 'Laksamana', 'Syahbandar'],
          answer: 'Bendahara',
          explanation:
            'The Bendahara was the senior noble who assisted the Sultan with administration and counsel.',
          objective_id: 'obj-3',
        },
        {
          id: 'm2-q2',
          type: 'mcq',
          text: 'What was the Temenggung’s main responsibility?',
          options: [
            'Maintaining internal security and public order',
            'Managing foreign trade',
            'Commanding the navy',
            'Keeping the royal treasury',
          ],
          answer: 'Maintaining internal security and public order',
          explanation:
            'The Temenggung kept the peace, arrested criminals and maintained order in the city.',
          objective_id: 'obj-3',
        },
        {
          id: 'm2-q3',
          type: 'puzzle',
          text: 'What is the main written legal code of the Malacca Sultanate?',
          answer: 'Hukum Kanun Melaka|Malacca Legal Code|Hukum Kanun',
          explanation:
            'The Hukum Kanun Melaka contains 44 clauses and formed the basis of law and administration.',
          objective_id: 'obj-3',
        },
        {
          id: 'm2-q4',
          type: 'mcq',
          text: 'What was one effect of Islam’s arrival on Malaccan society?',
          options: [
            'It introduced Jawi script and Islamic customs',
            'It ended all trading activity',
            'It closed the port to foreign merchants',
            'It changed the official language to Latin',
          ],
          answer: 'It introduced Jawi script and Islamic customs',
          explanation:
            'Islam influenced Jawi writing, law, customs, architecture and literature in Malacca.',
          objective_id: 'obj-4',
        },
        {
          id: 'm2-q5',
          type: 'puzzle',
          text: 'Which writing system arrived in Malacca through Islamic influence?',
          answer: 'Jawi|Jawi script',
          explanation:
            'Jawi was used in administration, letters and literary works across the Malacca Sultanate.',
          objective_id: 'obj-4',
        },
      ],
    },
    {
      id: 'level-3',
      name: 'Storm of 1511',
      scene: 'medan_perang',
      difficulty: 'Challenging',
      objective_ids: ['obj-5'],
      narrative:
        '1511. The Portuguese fleet appears on the horizon and cannons echo across the strait. Malacca’s defences are tested, and every decision shapes whether this legacy survives. Ready for the final storm?',
      image_prompt:
        'Dramatic 2D game battlefield at dusk, Malacca fortress walls, Portuguese ships on the horizon, smoke and embers, deep red and navy palette, cinematic painterly, no text',
      questions: [
        {
          id: 'm3-q1',
          type: 'mcq',
          text: 'In which year did Malacca fall to the Portuguese?',
          options: ['1511', '1400', '1641', '1786'],
          answer: '1511',
          explanation:
            'Malacca fell to the Portuguese in 1511 after an assault led by Alfonso de Albuquerque.',
          objective_id: 'obj-5',
        },
        {
          id: 'm3-q2',
          type: 'mcq',
          text: 'Who led the Portuguese attack on Malacca in 1511?',
          options: [
            'Alfonso de Albuquerque',
            'Vasco da Gama',
            'Ferdinand Magellan',
            'Christopher Columbus',
          ],
          answer: 'Alfonso de Albuquerque',
          explanation:
            'Alfonso de Albuquerque commanded the Portuguese expedition that captured Malacca in 1511.',
          objective_id: 'obj-5',
        },
        {
          id: 'm3-q3',
          type: 'puzzle',
          text: 'Complete: Weak ____ among the nobles was one internal factor in Malacca’s decline.',
          answer: 'unity|solidarity',
          explanation:
            'Division and rivalry among the nobles weakened Malacca’s administration and defence.',
          objective_id: 'obj-5',
        },
        {
          id: 'm3-q4',
          type: 'mcq',
          text: 'Which of these was an internal factor in Malacca’s decline?',
          options: [
            'Rivalry and weak noble leadership',
            'A shortage of ships in the port',
            'No spices in Malacca',
            'The absence of foreign traders',
          ],
          answer: 'Rivalry and weak noble leadership',
          explanation:
            'Noble rivalry, weak administration and a lack of popular support weakened Malacca from within.',
          objective_id: 'obj-5',
        },
        {
          id: 'm3-q5',
          type: 'puzzle',
          text: 'Which Sultan ruled Malacca when it fell in 1511?',
          answer: 'Sultan Mahmud Shah|Sultan Mahmud',
          explanation:
            'Sultan Mahmud Shah was on the throne when Malacca fell; he later retreated to Johor.',
          objective_id: 'obj-5',
        },
      ],
    },
  ],
}
