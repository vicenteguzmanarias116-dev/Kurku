# Vela Team

Gestión de atletas y entrenamiento para un equipo de vela (ILCA / Laser).
Proyecto **independiente** — no comparte repo, base de datos ni hosting con
ningún otro proyecto.

Stack: Next.js 16 (App Router) · Supabase (Postgres + Auth + RLS) · Tailwind ·
deploy en Vercel.

## MVP (lo que ya hace)

- **Atletas** — alta/edición/baja, clase de barco, peso, foto, notas. Solo staff edita.
- **Entrenamientos** — lista de sesiones + alta manual (min, distancia, RPE, viradas/trasluchadas).
  Importar GPX/FIT/TCX de relojes e instrumentos: fase siguiente.
- **Panel** — carga de entrenamiento por atleta con ratio ACWR (agudo 7d / crónico 28d) y semáforo.
- **Calendario** — entrenamientos y regatas.
- **Comunicación** — anuncios al equipo.

Roles: `admin`, `coach` (= staff, editan todo), `athlete` (ve el equipo y solo
sus propias sesiones). Todo protegido con RLS en Postgres.

## Puesta en marcha

1. Crear un proyecto **nuevo** en [supabase.com](https://supabase.com).
2. SQL Editor → pegar y ejecutar `supabase/migrations/0001_init.sql`.
3. Copiar credenciales a `.env.local`:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=...
   ```
4. `npm install && npm run dev` → http://localhost:3000
5. Entrar con tu correo (enlace mágico). **El primer usuario que entra queda como `admin`.**
   El resto entra como `athlete`; el admin los promueve a `coach` desde la tabla
   `profiles` en Supabase (o se hará una pantalla de admin más adelante).

### Correo de acceso

Supabase Auth manda el enlace con su SMTP de pruebas (limitado). Para producción,
configurar un SMTP propio (Resend, etc.) en Supabase → Auth → SMTP, y añadir
`http://localhost:3000/**` y la URL de Vercel en Auth → URL Configuration → Redirect URLs.

## Deploy

Vercel → nuevo proyecto conectado a este repo → añadir las 2 variables de
entorno → deploy. Añadir la URL final a los Redirect URLs de Supabase.

## Roadmap (fase 2+)

Importar archivos GPX/FIT/TCX y derivar métricas de la traza (SOG, viradas por
cambio de rumbo, tiempo por amura). APIs en vivo por marca (Garmin, Sailmon,
Vakaros) después. Luego: gestión de lesiones, análisis de vídeo + telestration,
tácticas/diagramas, colecciones, reportes. Multi-deporte cuando llegue el 2º
deporte (hay columna `sport` en `teams`).
