# DICCIONARIO FONÉTICO SUNO - ESPAÑOL DE ESPAÑA (CASTELLANO)
**Proyecto:** Eduardo Ramírez de Cartagena / The Research Band (TRBAND)  
**Objetivo:** Evitar el seseo latino involuntario en Suno y forzar la pronunciación castellana auténtica (/θ/ distinción de C y Z).

---

## 1. La Regla de Oro Fonética: El Fonema Interdental (/θ/)
Los modelos vocales de Suno están fuertemente entrenados en español neutro / latinoamericano, por lo que tienden a sesear todas las `C` (ante `e, i`) y las `Z` (las pronuncian como `S`: *sielo, naser, bario, vasi-o*).

Para obligar al motor a pronunciar la **C** y la **Z** como en España, se utiliza la combinación fonética inglesa **`th`** (sonido de *think, teeth*):

| Palabra estándar | Escritura fonética para Suno | Pronunciación resultante |
| :--- | :--- | :--- |
| **Cielo** | `Zielo` o `Thielo` | /θjelo/ (Cielo de España) |
| **Cruzaron** | `Crutharon` | /kruθaɾon/ |
| **Arcilla** | `Arthilla` | /aɾθiʎa/ |
| **Mezclaron** | `Mezzclaron` o `Metzclaron` | Marca la z / fricativa |
| **Vacío** | `Vathío` | /baθio/ |
| **Hicieron** | `Hithieron` | /iθjeɾon/ |
| **Obedecer** | `Obedether` | /obeðeθeɾ/ |
| **Empezó** | `Empethó` | /empeθo/ |
| **Nacer** | `Nather` | /naθeɾ/ |
| **Venas** | `Venas` (con v labiodental si se requiere marcar) | /benas/ |
| **Corazón** | `Corathón` | /koɾaθon/ |
| **Luz** | `Luth` | /luθ/ |
| **Paz** | `Path` | /paθ/ |
| **Fuerza** | `Fuertha` | /fweɾθa/ |
| **Caza / Cazar** | `Catha / Cathar` | /kaθa/ |

---

## 2. Otras Reglas de Articulación y Acentuación
1. **La `B` vs `V`:** Si la voz empasta demasiado la `V`, escribir doble consonante o asociar con sílaba tónica.
2. **La `J` castellana fuerte:** Escribir `kh` o `j` mayúscula si se quiere más raspada (tipo *Khem*).
3. **Evitar unión no deseada de vocales (Sinalefa rota):** Si Suno junta dos palabras en una sola nota rápida (ej. *de un* -> *diun*), separar con apóstrofe o puntuación (*de... un*).

---

## 3. Ejemplo Maestro Aplicado: «Hijos de las estrellas» (26/10/2026)
```text
Crutharon la noche de un zielo olvidado,
buscando en la roca el metal sagrado.
Un mundo de sombra, de fango y de sed,
donde el dios extranjero tendió su red.

Tomaron la arthilla del lecho del río,
mezzclaron su sangre en el barro vathío.
Hithieron al hombre para obedether...
¡pero un fuego prohibido empethó a nather!
```
