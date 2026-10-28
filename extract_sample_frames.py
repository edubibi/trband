import sys, os, re, cv2

sys.stdout.reconfigure(encoding='utf-8')

video_path = r'D:\RESCATE 2\ANUNAKI\Anunnaki Genesis_ Full Movie _ The Gods Who Created Humanity.mp4'
index_path = r'c:\Users\Usuario\.gemini\antigravity-ide\scratch\01_APLICACIONES_Y_WEB\MIS DISCOS\TRBANDMUSIC_ES\INDICE_1994_ESCENAS_ANUNNAKI.md'

out_dir_d = r'D:\RESCATE 2\ANUNAKI\FRAMES_REFERENCIA'
out_dir_desk = r'C:\Users\Usuario\Desktop\FRAMES_ANUNNAKI'
os.makedirs(out_dir_d, exist_ok=True)
os.makedirs(out_dir_desk, exist_ok=True)

# Parse first 20 scenes
scenes = []
with open(index_path, 'r', encoding='utf-8') as f:
    for line in f:
        m = re.match(r'\|\s*Escena\s*(\d+)\s*\|\s*`?(\d{2}:\d{2}:\d{2}\.\d+)`?\s*\|\s*([\d\.]+)s\s*\|', line)
        if m:
            s_num = int(m.group(1))
            tc = m.group(2)
            dur = float(m.group(3))
            parts = tc.split(':')
            sec = int(parts[0])*3600 + int(parts[1])*60 + float(parts[2])
            scenes.append((s_num, tc, sec, dur))
            if len(scenes) >= 20:
                break

print(f"Extrayendo {len(scenes)} escenas de muestra...")

cap = cv2.VideoCapture(video_path)
fps = cap.get(cv2.CAP_PROP_FPS)
width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))

print(f"Resolución: {width}x{height} | FPS: {fps:.2f} | Total frames: {total_frames}")

extracted = []
for s_num, tc, sec, dur in scenes:
    target_sec = sec + (dur / 2.0)
    frame_idx = int(target_sec * fps)
    cap.set(cv2.CAP_PROP_POS_FRAMES, frame_idx)
    ret, frame = cap.read()
    if ret:
        clean_tc = tc.replace(':', '-').replace('.', '_')
        fname = f"Escena_{s_num:03d}_{clean_tc}.jpg"
        p1 = os.path.join(out_dir_d, fname)
        p2 = os.path.join(out_dir_desk, fname)
        cv2.imwrite(p1, frame, [int(cv2.IMWRITE_JPEG_QUALITY), 95])
        cv2.imwrite(p2, frame, [int(cv2.IMWRITE_JPEG_QUALITY), 95])
        extracted.append((s_num, tc, dur, fname))
        print(f"OK -> Escena {s_num:03d} [{tc}] (+{dur:.1f}s) guardada: {fname}")
    else:
        print(f"Fallo al leer Escena {s_num}")

cap.release()
print(f"\n¡Listo! {len(extracted)} fotogramas guardados en:")
print(f"1) {out_dir_desk}")
print(f"2) {out_dir_d}")
