const fs = require('fs');
const path = require('path');
const NodeID3 = require('node-id3');

const AUDIO_DIR = path.join(__dirname, 'assets', 'audio_tao');
const COVER_PATH = path.join(__dirname, 'assets', 'img', 'portada_a_journey_of_a_thousand_miles.jpg');

const ALBUM_NAME = "千里之行 始于足下 (A Journey of a Thousand Miles Begins with a Single Step)";
const ARTIST = "The Research Band";
const COMPOSER = "Eduardo Ramírez de Cartagena";
const PUBLISHER = "Khem Aura Records";
const COPYRIGHT = "© 2026 Khem Aura Records / Eduardo Ramírez de Cartagena";
const YEAR = "2026";
const GENRE = "Progressive Rock / Worldbeat";
const COMMENT = "SGAE Socio Nº 29.751. All master and publishing rights reserved. Khem Aura Records.";

const TRACKS = [
  {
    filename: "Dreams and other things (instrumental).mp3",
    trackNumber: "1/14",
    discNumber: "1/2",
    title: "Dreams and Other Things (梦境与余事)"
  },
  {
    filename: "Keep a Place for You.mp3",
    trackNumber: "2/14",
    discNumber: "1/2",
    title: "Keep a Place for You (为你留一席地)"
  },
  {
    filename: "Oriental pagoda (instrumental).mp3",
    trackNumber: "3/14",
    discNumber: "1/2",
    title: "Oriental Pagoda (东方宝塔)"
  },
  {
    filename: "Hold the Measure.mp3",
    trackNumber: "4/14",
    discNumber: "1/2",
    title: "Hold the Measure (把握分寸)"
  },
  {
    filename: "Paper Lantern River.mp3",
    trackNumber: "5/14",
    discNumber: "1/2",
    title: "Paper Lantern River (纸灯之河)"
  },
  {
    filename: "In the warmth of the Yangtze River (instrumental).mp3",
    trackNumber: "6/14",
    discNumber: "1/2",
    title: "In the Warmth of the Yangtze River (长江的温存)"
  },
  {
    filename: "I Remain.mp3",
    trackNumber: "7/14",
    discNumber: "1/2",
    title: "I Remain (我依然在)"
  },
  {
    filename: "Angular A Minor.mp3",
    trackNumber: "8/14",
    discNumber: "2/2",
    title: "Angular A Minor (棱角A小调)"
  },
  {
    filename: "Spanish Misty Guzheng (instrumental chillout).mp3",
    trackNumber: "9/14",
    discNumber: "2/2",
    title: "Spanish Misty Guzheng (西班牙迷雾古筝)"
  },
  {
    filename: "Li Ann, my sunshine.mp3",
    trackNumber: "10/14",
    discNumber: "2/2",
    title: "Li Ann, My Sunshine (丽安，我的阳光)"
  },
  {
    filename: "Pause Before the Rain.mp3",
    trackNumber: "11/14",
    discNumber: "2/2",
    title: "Pause Before the Rain (雨前伫足)"
  },
  {
    filename: "Where the Pieces Fell.mp3",
    trackNumber: "12/14",
    discNumber: "2/2",
    title: "Where the Pieces Fell (碎片散落之处)"
  },
  {
    filename: "The Turning of the Tide .mp3",
    trackNumber: "13/14",
    discNumber: "2/2",
    title: "The Turning of the Tide (潮汐回转)"
  },
  {
    filename: "A Single Spanish Step (instrumental).mp3",
    trackNumber: "14/14",
    discNumber: "2/2",
    title: "A Single Spanish Step (西班牙一步)"
  }
];

console.log("=== INICIANDO DEPURACIÓN Y ETIQUETADO ID3 METADATOS KHEM AURA RECORDS ===\n");

let coverImageBuffer = null;
if (fs.existsSync(COVER_PATH)) {
  coverImageBuffer = COVER_PATH;
  console.log(`✓ Portada oficial encontrada: ${COVER_PATH}`);
} else {
  console.log(`! Aviso: Portada no encontrada en ${COVER_PATH}`);
}

TRACKS.forEach((track, idx) => {
  const filePath = path.join(AUDIO_DIR, track.filename);
  if (!fs.existsSync(filePath)) {
    console.error(`✗ ERROR: Archivo no encontrado: ${filePath}`);
    return;
  }

  const tags = {
    title: track.title,
    artist: ARTIST,
    performerInfo: ARTIST,
    album: ALBUM_NAME,
    composer: COMPOSER,
    publisher: PUBLISHER,
    copyright: COPYRIGHT,
    year: YEAR,
    date: "2026-10-22",
    genre: GENRE,
    trackNumber: track.trackNumber,
    partOfSet: track.discNumber,
    comment: {
      language: "eng",
      shortText: "SGAE",
      text: COMMENT
    }
  };

  if (coverImageBuffer) {
    tags.image = {
      mime: "image/jpeg",
      type: { id: 3, name: "front cover" },
      description: "Album Cover",
      imageBuffer: fs.readFileSync(COVER_PATH)
    };
  }

  const success = NodeID3.write(tags, filePath);
  if (success) {
    const verified = NodeID3.read(filePath);
    console.log(`[${track.trackNumber}] ✓ ${track.title}`);
    console.log(`       Artista: ${verified.artist} | Álbum: ${verified.album.substring(0, 30)}...`);
    console.log(`       Sello: ${verified.publisher} | Compositor: ${verified.composer}`);
  } else {
    console.error(`✗ Falló la escritura de tags en: ${track.filename}`);
  }
});

console.log("\n=== DEPURACIÓN DE METADATOS ID3 COMPLETADA CON ÉXITO ===");
