import os, sys
from mutagen.mp3 import MP3
from mutagen.id3 import ID3, TIT2, TPE1, TPE2, TALB, TDRC, TCON, TCOM, TCOP, COMM, TRCK, TPOS, ID3NoHeaderError
from mutagen.wave import WAVE

sys.stdout.reconfigure(encoding='utf-8')
target_dir = r'D:\ARCHIVOS NEW2026\Descargas_C_Backup2025\JAZZ MUSIC EDU\TODO SONGS\MP3 SONGS\MP3  SONGS trband\SGAE\ultimas'

songs = [
    {
        'base': 'Politics reflexions',
        'title': 'Politics Reflexions',
        'genre': 'Jazz Rock / Fusion',
    },
    {
        'base': 'The Cartographer of Glass Moons',
        'title': 'The Cartographer of Glass Moons',
        'genre': 'Progressive Rock / Art Rock',
    }
]

for s in songs:
    title = s['title']
    genre = s['genre']
    album = f"{title} - Single"
    
    # --- MP3 ---
    mp3_file = os.path.join(target_dir, s['base'] + '.mp3')
    if os.path.exists(mp3_file):
        try:
            id3 = ID3(mp3_file)
            id3.delete()
        except ID3NoHeaderError:
            pass
        
        id3 = ID3()
        id3.add(TIT2(encoding=3, text=[title]))
        id3.add(TPE1(encoding=3, text=['The Research Band']))
        id3.add(TPE2(encoding=3, text=['The Research Band']))
        id3.add(TALB(encoding=3, text=[album]))
        id3.add(TCOM(encoding=3, text=['Eduardo Ramírez de Cartagena']))
        id3.add(TDRC(encoding=3, text=['2026']))
        id3.add(TCON(encoding=3, text=[genre]))
        id3.add(TCOP(encoding=3, text=['(C) 2026 Khem Aura Records / The Research Band']))
        id3.add(COMM(encoding=3, lang='spa', desc='', text=['SGAE Nº 29.751 - Eduardo Ramírez de Cartagena']))
        id3.add(TRCK(encoding=3, text=['1/1']))
        id3.add(TPOS(encoding=3, text=['1/1']))
        id3.save(mp3_file, v2_version=3)
        print(f"MP3 OK: {s['base']}.mp3")
        
    # --- WAV ---
    wav_file = os.path.join(target_dir, s['base'] + '.wav')
    if os.path.exists(wav_file):
        w = WAVE(wav_file)
        if w.tags:
            w.tags.clear()
        else:
            w.add_tags()
            
        w.tags.add(TIT2(encoding=3, text=[title]))
        w.tags.add(TPE1(encoding=3, text=['The Research Band']))
        w.tags.add(TPE2(encoding=3, text=['The Research Band']))
        w.tags.add(TALB(encoding=3, text=[album]))
        w.tags.add(TCOM(encoding=3, text=['Eduardo Ramírez de Cartagena']))
        w.tags.add(TDRC(encoding=3, text=['2026']))
        w.tags.add(TCON(encoding=3, text=[genre]))
        w.tags.add(TCOP(encoding=3, text=['(C) 2026 Khem Aura Records / The Research Band']))
        w.tags.add(COMM(encoding=3, lang='spa', desc='', text=['SGAE Nº 29.751 - Eduardo Ramírez de Cartagena']))
        w.tags.add(TRCK(encoding=3, text=['1/1']))
        w.tags.add(TPOS(encoding=3, text=['1/1']))
        w.save()
        print(f"WAV OK: {s['base']}.wav")

print('\n¡Limpieza y actualización completada con éxito!')
