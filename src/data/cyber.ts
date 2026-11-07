import type { GameBlueprint } from '../types'

export const cyberEn: GameBlueprint = {
  title: 'Neon Citadel: Code of Defense',
  theme: 'Introduction to Cybersecurity · Neon Citadel',
  story_intro:
    'The city of Neo-Kuala Lumpur runs on data. When the Neon Citadel’s core is breached, you become the last security analyst on the grid. Cross three sectors, outsmart hostile agents and restore trust to the network before the city goes dark.',
  mechanics: {
    hp: 5,
    points_per_correct: 100,
    badges: ['Packet Ranger', 'Cipher Breaker', 'Zero Trust Guardian', 'Grid Legend'],
  },
  levels: [
    {
      id: 'level-1',
      name: 'The Firewall Gate',
      scene: 'firewall',
      difficulty: 'Easy',
      objective_ids: ['cy-obj-1', 'cy-obj-3'],
      narrative:
        'At the edge of the grid, packets queue at the firewall. A phishing wave is probing for weak links and a flood of traffic is testing the gates. Prove you can tell signal from noise.',
      image_prompt:
        'Futuristic neon firewall gate over a dark city grid, glowing cyan barriers, streams of data packets, rain, cyberpunk 2D game background, no text',
      questions: [
        {
          id: 'c1-q1',
          type: 'mcq',
          text: 'Which trio makes up the CIA triad?',
          options: [
            'Confidentiality, Integrity, Availability',
            'Control, Identity, Access',
            'Cryptography, Inspection, Authorization',
            'Confidentiality, Identity, Authentication',
          ],
          answer: 'Confidentiality, Integrity, Availability',
          explanation:
            'The CIA triad guides security decisions: keep data secret, keep it unaltered, and keep it accessible when needed.',
          objective_id: 'cy-obj-1',
        },
        {
          id: 'c1-q2',
          type: 'mcq',
          text: 'A ransomware attack encrypts hospital records. Which CIA principle is most directly affected?',
          options: ['Availability', 'Confidentiality', 'Non-repudiation', 'Anonymity'],
          answer: 'Availability',
          explanation:
            'Ransomware makes systems and data unavailable to authorised users, directly attacking availability.',
          objective_id: 'cy-obj-1',
        },
        {
          id: 'c1-q3',
          type: 'puzzle',
          text: 'What does the “I” in the CIA triad stand for?',
          answer: 'Integrity',
          explanation:
            'Integrity means data is accurate, complete and has not been altered without authorisation.',
          objective_id: 'cy-obj-1',
        },
        {
          id: 'c1-q4',
          type: 'mcq',
          text: 'An email urges you to “verify your password immediately” through a shortened link. What is this most likely?',
          options: ['Phishing', 'A firmware update', 'A DDoS attack', 'A brute-force attack'],
          answer: 'Phishing',
          explanation:
            'Phishing uses urgent, deceptive messages to trick people into revealing credentials or clicking malicious links.',
          objective_id: 'cy-obj-3',
        },
        {
          id: 'c1-q5',
          type: 'puzzle',
          text: 'Which attack floods a service with traffic until it becomes unavailable? (abbreviation)',
          answer: 'DDoS|DoS',
          explanation:
            'A distributed denial-of-service (DDoS) attack overwhelms a service with traffic from many sources.',
          objective_id: 'cy-obj-3',
        },
      ],
    },
    {
      id: 'level-2',
      name: 'The Cipher Vault',
      scene: 'vault',
      difficulty: 'Medium',
      objective_ids: ['cy-obj-2', 'cy-obj-4'],
      narrative:
        'Behind the firewall lies the Cipher Vault, where identity is proven and secrets are sealed. One wrong key and the vault locks forever. Authenticate, authorise and decrypt your way through.',
      image_prompt:
        'Glowing cryptographic vault door with floating keys and cipher glyphs, violet and cyan neon, dark data centre, cyberpunk 2D game background, no text',
      questions: [
        {
          id: 'c2-q1',
          type: 'mcq',
          text: 'What is the difference between authentication and authorization?',
          options: [
            'Authentication proves identity; authorization grants access',
            'Authorization proves identity; authentication grants access',
            'They are exactly the same process',
            'Authentication only applies to passwords',
          ],
          answer: 'Authentication proves identity; authorization grants access',
          explanation:
            'Authentication answers “who are you?”. Authorization answers “what are you allowed to do?”.',
          objective_id: 'cy-obj-2',
        },
        {
          id: 'c2-q2',
          type: 'mcq',
          text: 'Which is the strongest example of multi-factor authentication?',
          options: [
            'Password + one-time code from an authenticator app',
            'Password + security question',
            'Username + password',
            'Two different passwords',
          ],
          answer: 'Password + one-time code from an authenticator app',
          explanation:
            'MFA combines factors from different categories, such as something you know and something you have.',
          objective_id: 'cy-obj-2',
        },
        {
          id: 'c2-q3',
          type: 'puzzle',
          text: 'Which type of encryption uses the same secret key to encrypt and decrypt?',
          answer: 'symmetric|symmetric encryption',
          explanation:
            'Symmetric encryption is fast and uses one shared key, which must be distributed securely.',
          objective_id: 'cy-obj-4',
        },
        {
          id: 'c2-q4',
          type: 'mcq',
          text: 'Which security property does a cryptographic hash primarily provide?',
          options: ['Integrity', 'Availability', 'Authorization', 'Compression'],
          answer: 'Integrity',
          explanation:
            'A hash acts like a fingerprint. If the data changes, the hash changes, revealing tampering.',
          objective_id: 'cy-obj-4',
        },
        {
          id: 'c2-q5',
          type: 'puzzle',
          text: 'In public-key cryptography, which key is shared openly so others can encrypt messages to you?',
          answer: 'public|public key',
          explanation:
            'Anyone can use your public key to encrypt a message; only your private key can decrypt it.',
          objective_id: 'cy-obj-4',
        },
      ],
    },
    {
      id: 'level-3',
      name: 'Zero Trust Citadel',
      scene: 'citadel',
      difficulty: 'Challenging',
      objective_ids: ['cy-obj-5'],
      narrative:
        'The breach came from inside. The Citadel must assume nothing and verify everything. Segment the network, contain the incident and bring the grid back online before the city goes dark.',
      image_prompt:
        'Vast zero-trust citadel interior, segmented network rings, holographic security dashboards, red alert lighting with cyan accents, cyberpunk 2D game background, no text',
      questions: [
        {
          id: 'c3-q1',
          type: 'mcq',
          text: 'What is the core principle of zero trust?',
          options: [
            'Never trust, always verify',
            'Trust everyone inside the firewall',
            'Use one password everywhere',
            'Disable logging to save storage',
          ],
          answer: 'Never trust, always verify',
          explanation:
            'Zero trust assumes no implicit trust, even inside the network, and verifies every request.',
          objective_id: 'cy-obj-5',
        },
        {
          id: 'c3-q2',
          type: 'mcq',
          text: 'Which sequence best represents the incident response lifecycle?',
          options: [
            'Prepare, detect, contain, eradicate, recover, learn',
            'Detect, delete logs, restart, ignore',
            'Contain, prepare, celebrate, recover',
            'Scan, encrypt, pay, repeat',
          ],
          answer: 'Prepare, detect, contain, eradicate, recover, learn',
          explanation:
            'Incident response moves from preparation through detection, containment, eradication, recovery and lessons learned.',
          objective_id: 'cy-obj-5',
        },
        {
          id: 'c3-q3',
          type: 'puzzle',
          text: 'What is the term for dividing a network into smaller zones to limit the spread of an attack?',
          answer: 'segmentation|network segmentation',
          explanation:
            'Network segmentation limits lateral movement, so a compromised host cannot reach every system.',
          objective_id: 'cy-obj-5',
        },
        {
          id: 'c3-q4',
          type: 'mcq',
          text: 'A workstation is infected with malware. What should you do first to limit damage?',
          options: [
            'Isolate it from the network',
            'Email the file to colleagues',
            'Restart it repeatedly',
            'Disable backups',
          ],
          answer: 'Isolate it from the network',
          explanation:
            'Containment comes early in incident response. Isolating the host prevents lateral movement.',
          objective_id: 'cy-obj-5',
        },
        {
          id: 'c3-q5',
          type: 'puzzle',
          text: 'The 3-2-1 rule is mainly used for which security control? (one word)',
          answer: 'backups|backup',
          explanation:
            'The 3-2-1 rule keeps three copies of data, on two media types, with one copy off-site.',
          objective_id: 'cy-obj-5',
        },
      ],
    },
  ],
}

export const cyberBm: GameBlueprint = {
  title: 'Neon Citadel: Kod Pertahanan',
  theme: 'Pengenalan Keselamatan Siber · Neon Citadel',
  story_intro:
    'Kota Neo-Kuala Lumpur bergantung sepenuhnya pada data. Apabila teras Neon Citadel dicerobohi, anda menjadi penganalisis keselamatan terakhir dalam grid. Lintasi tiga sektor, tipu agen musuh dan pulihkan kepercayaan rangkaian sebelum kota dilanda kegelapan.',
  mechanics: {
    hp: 5,
    points_per_correct: 100,
    badges: ['Renjer Paket', 'Pemecah Sifer', 'Penjaga Zero Trust', 'Legenda Grid'],
  },
  levels: [
    {
      id: 'level-1',
      name: 'Gerbang Firewall',
      scene: 'firewall',
      difficulty: 'Mudah',
      objective_ids: ['cy-obj-1', 'cy-obj-3'],
      narrative:
        'Di pinggir grid, paket data beratur di hadapan firewall. Gelombang phishing sedang mencari pautan lemah dan limpahan trafik menguji gerbang. Buktikan anda mampu membezakan isyarat daripada bunyi bising.',
      image_prompt:
        'Futuristic neon firewall gate over a dark city grid, glowing cyan barriers, streams of data packets, rain, cyberpunk 2D game background, no text',
      questions: [
        {
          id: 'c1-q1',
          type: 'mcq',
          text: 'Apakah tiga elemen yang membentuk triad CIA?',
          options: [
            'Kerahsiaan, Integriti, Ketersediaan',
            'Kawalan, Identiti, Akses',
            'Kriptografi, Pemeriksaan, Kebenaran',
            'Kerahsiaan, Identiti, Pengesahan',
          ],
          answer: 'Kerahsiaan, Integriti, Ketersediaan',
          explanation:
            'Triad CIA membimbing keputusan keselamatan: simpan data rahsia, kekalkan ketepatannya dan pastikan ia boleh diakses bila diperlukan.',
          objective_id: 'cy-obj-1',
        },
        {
          id: 'c1-q2',
          type: 'mcq',
          text: 'Serangan ransomware menyulitkan rekod hospital. Prinsip CIA manakah paling terjejas?',
          options: ['Ketersediaan', 'Kerahsiaan', 'Tanpa-penafian', 'Anonimiti'],
          answer: 'Ketersediaan',
          explanation:
            'Ransomware menjadikan sistem dan data tidak tersedia kepada pengguna sah, sekali gus menyerang ketersediaan.',
          objective_id: 'cy-obj-1',
        },
        {
          id: 'c1-q3',
          type: 'puzzle',
          text: 'Apakah maksud “I” dalam triad CIA?',
          answer: 'Integriti|Integrity',
          explanation:
            'Integriti bermaksud data tepat, lengkap dan tidak diubah tanpa kebenaran.',
          objective_id: 'cy-obj-1',
        },
        {
          id: 'c1-q4',
          type: 'mcq',
          text: 'E-mel mendesak anda “sahkan kata laluan segera” melalui pautan pendek. Apakah kemungkinan besar ini?',
          options: ['Phishing', 'Kemas kini firmware', 'Serangan DDoS', 'Serangan brute-force'],
          answer: 'Phishing',
          explanation:
            'Phishing menggunakan mesej mendesak dan menipu untuk memperoleh kelayakan atau memaksa pengguna menekan pautan berniat jahat.',
          objective_id: 'cy-obj-3',
        },
        {
          id: 'c1-q5',
          type: 'puzzle',
          text: 'Serangan manakah membanjiri perkhidmatan dengan trafik sehingga ia tidak tersedia? (singkatan)',
          answer: 'DDoS|DoS',
          explanation:
            'Serangan distributed denial-of-service (DDoS) melimpahi perkhidmatan dengan trafik daripada banyak sumber.',
          objective_id: 'cy-obj-3',
        },
      ],
    },
    {
      id: 'level-2',
      name: 'Peti Sifer',
      scene: 'vault',
      difficulty: 'Sederhana',
      objective_ids: ['cy-obj-2', 'cy-obj-4'],
      narrative:
        'Di sebalik firewall terletak Peti Sifer, tempat identiti dibuktikan dan rahsia dimeterai. Satu kunci yang salah akan mengunci peti selama-lamanya. Lalui pengesahan, kebenaran dan penyahsulitan.',
      image_prompt:
        'Glowing cryptographic vault door with floating keys and cipher glyphs, violet and cyan neon, dark data centre, cyberpunk 2D game background, no text',
      questions: [
        {
          id: 'c2-q1',
          type: 'mcq',
          text: 'Apakah perbezaan antara pengesahan (authentication) dan kebenaran (authorization)?',
          options: [
            'Pengesahan membuktikan identiti; kebenaran memberi akses',
            'Kebenaran membuktikan identiti; pengesahan memberi akses',
            'Kedua-duanya proses yang sama',
            'Pengesahan hanya terpakai pada kata laluan',
          ],
          answer: 'Pengesahan membuktikan identiti; kebenaran memberi akses',
          explanation:
            'Pengesahan menjawab “siapa anda?”. Kebenaran menjawab “apa yang anda dibenarkan lakukan?”.',
          objective_id: 'cy-obj-2',
        },
        {
          id: 'c2-q2',
          type: 'mcq',
          text: 'Antara berikut, yang manakah contoh terkuat bagi pengesahan berbilang faktor?',
          options: [
            'Kata laluan + kod sekali guna daripada aplikasi pengesah',
            'Kata laluan + soalan keselamatan',
            'Nama pengguna + kata laluan',
            'Dua kata laluan berbeza',
          ],
          answer: 'Kata laluan + kod sekali guna daripada aplikasi pengesah',
          explanation:
            'MFA menggabungkan faktor daripada kategori berbeza, seperti sesuatu yang anda tahu dan sesuatu yang anda miliki.',
          objective_id: 'cy-obj-2',
        },
        {
          id: 'c2-q3',
          type: 'puzzle',
          text: 'Jenis penyulitan manakah menggunakan kunci rahsia yang sama untuk menyulit dan menyahsulit?',
          answer: 'simetri|symmetric|penyulitan simetri',
          explanation:
            'Penyulitan simetri pantas dan menggunakan satu kunci dikongsi yang perlu diagihkan dengan selamat.',
          objective_id: 'cy-obj-4',
        },
        {
          id: 'c2-q4',
          type: 'mcq',
          text: 'Sifat keselamatan manakah yang utama diberikan oleh hash kriptografi?',
          options: ['Integriti', 'Ketersediaan', 'Kebenaran', 'Mampatan'],
          answer: 'Integriti',
          explanation:
            'Hash berfungsi seperti cap jari. Jika data berubah, hash turut berubah dan pendedahan gangguan dapat dikesan.',
          objective_id: 'cy-obj-4',
        },
        {
          id: 'c2-q5',
          type: 'puzzle',
          text: 'Dalam kriptografi kunci awam, kunci manakah dikongsi secara terbuka supaya orang lain boleh menyulit mesej kepada anda?',
          answer: 'awam|public|kunci awam',
          explanation:
            'Sesiapa boleh menggunakan kunci awam anda untuk menyulit mesej; hanya kunci peribadi anda boleh menyahsulitnya.',
          objective_id: 'cy-obj-4',
        },
      ],
    },
    {
      id: 'level-3',
      name: 'Kota Zero Trust',
      scene: 'citadel',
      difficulty: 'Cabar',
      objective_ids: ['cy-obj-5'],
      narrative:
        'Serangan datang dari dalam. Kota ini tidak boleh mempercayai sesiapa dan mesti mengesahkan segala-galanya. Pecahkan rangkaian kepada segmen, kawal insiden dan hidupkan semula grid sebelum kota dilanda kegelapan.',
      image_prompt:
        'Vast zero-trust citadel interior, segmented network rings, holographic security dashboards, red alert lighting with cyan accents, cyberpunk 2D game background, no text',
      questions: [
        {
          id: 'c3-q1',
          type: 'mcq',
          text: 'Apakah prinsip teras zero trust?',
          options: [
            'Jangan percaya sesiapa, sentiasa sahkan',
            'Percayai semua orang di dalam firewall',
            'Gunakan satu kata laluan di mana-mana',
            'Matikan log untuk menjimatkan storan',
          ],
          answer: 'Jangan percaya sesiapa, sentiasa sahkan',
          explanation:
            'Zero trust tidak menganggap kepercayaan automatik walaupun di dalam rangkaian, dan mengesahkan setiap permintaan.',
          objective_id: 'cy-obj-5',
        },
        {
          id: 'c3-q2',
          type: 'mcq',
          text: 'Urutan manakah paling tepat bagi kitaran tindak balas insiden?',
          options: [
            'Sedia, kesan, kawal, hapus, pulih, belajar',
            'Kesan, hapus log, mula semula, abaikan',
            'Kawal, sedia, raikan, pulih',
            'Imbas, sulit, bayar, ulang',
          ],
          answer: 'Sedia, kesan, kawal, hapus, pulih, belajar',
          explanation:
            'Tindak balas insiden bergerak daripada persediaan ke pengesanan, pengawalan, penghapusan, pemulihan dan pengajaran.',
          objective_id: 'cy-obj-5',
        },
        {
          id: 'c3-q3',
          type: 'puzzle',
          text: 'Apakah istilah bagi membahagikan rangkaian kepada zon lebih kecil untuk mengehadkan penyebaran serangan?',
          answer: 'segmentasi|segmentation|segmentasi rangkaian',
          explanation:
            'Segmentasi rangkaian mengehadkan pergerakan sisi supaya hos yang dicerobohi tidak dapat mencapai semua sistem.',
          objective_id: 'cy-obj-5',
        },
        {
          id: 'c3-q4',
          type: 'mcq',
          text: 'Satu stesen kerja dijangkiti perisian hasad. Apakah tindakan pertama untuk mengehadkan kerosakan?',
          options: [
            'Asingkan ia daripada rangkaian',
            'Hantar fail itu kepada rakan sekerja',
            'Mulakan semula berulang kali',
            'Matikan sandaran',
          ],
          answer: 'Asingkan ia daripada rangkaian',
          explanation:
            'Pengawalan berlaku awal dalam tindak balas insiden. Mengasingkan hos menghalang pergerakan sisi.',
          objective_id: 'cy-obj-5',
        },
        {
          id: 'c3-q5',
          type: 'puzzle',
          text: 'Peraturan 3-2-1 digunakan terutamanya untuk kawalan keselamatan yang mana? (satu perkataan)',
          answer: 'sandaran|backup|backups',
          explanation:
            'Peraturan 3-2-1 menyimpan tiga salinan data, pada dua jenis media, dengan satu salinan di luar tapak.',
          objective_id: 'cy-obj-5',
        },
      ],
    },
  ],
}
