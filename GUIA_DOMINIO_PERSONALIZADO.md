# 🌐 Guía: Cómo poner tu Dominio Personalizado (.com / .es)

¡Genial decisión! Un dominio propio (ej. `www.theresearchband.com`) da una imagen mucho más profesional.

Aquí tienes los pasos para cuando hayas comprado el dominio.

## 1. En tu Proveedor de Dominio (donde lo compres)
*Debes buscar la sección llamada **"DNS"** o **"Zona DNS"**.*

Tienes que crear (o modificar) estos 2 registros:

### A) El registro A (Para el dominio raíz)
Apunta el dominio "sin www" a los servidores de GitHub.
- **Tipo:** `A`
- **Nombre/Host:** `@` (o déjalo en blanco)
- **Valor/Destino:** `185.199.108.153`
*(Puedes añadir 3 más cambiando el final por .109.153, .110.153, .111.153, pero con uno basta para empezar).*

### B) El registro CNAME (Para el www)
Esto conecta el "www" con tu usuario de GitHub.
- **Tipo:** `CNAME`
- **Nombre/Host:** `www`
- **Valor/Destino:** `dudeduart-cpu.github.io`

---

## 2. En GitHub (Tu Repositorio)
Una vez configurado lo anterior (espera unos minutos):

1. Ve a la pestaña **Settings** > **Pages**.
2. Baja a **Custom domain**.
3. Escribe tu dominio (ej. `www.theresearchband.com`).
4. Dale a **Save**.
5. Marca la casilla **"Enforce HTTPS"** (para que salga el candadito seguro 🔒).

---

## 💡 Consejo Pro
Si vais a hacer una web completa del grupo, podrías usar:
- `www.theresearchband.com` -> Para la web principal (biografía, fechas...).
- `player.theresearchband.com` -> Para este reproductor.

¡Si tienes dudas cuando lo compres, avísame y lo configuramos juntos!
