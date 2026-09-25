---
format: 1080x1920
duration: 55s
message: "Bookear un proveedor en TodoEventos es un chat con Raymi AI, no un trámite largo"
arc: Hook → Problema → Solución (Raymi) → Flujo (3 pasos) → Confirmación → Cierre
audience: personas organizando una fiesta que aún no conocen TodoEventos
mode: autonomous
---

## Video direction

- **Palette (from `frame.md`, Capsule remix):** cream `#F8F4EF` canvas, ink `#2B2730` display/body, accent naranja `#D9713C` (foreground subjects, highlights, CTA), morado marca como segundo acento en tarjetas/confirmaciones, candy secondaries (lime/sky/mint) solo como chips decorativos de fondo — nunca cargan el mensaje.
- **Motion grammar + reveal model:** long-tail `power3` en todo (nunca bouncy salvo el spring-pop de logo/confirmación, que es la firma del blueprint). Cada Scene revela SOLO lo que la VO está diciendo en ese instante — nada se vuelca de una en t=0. Durante un hold: quietud, a lo sumo jitter sutil — nunca "respiración" continua.
- **Rhythm / held frames:** Frame 3 (Product_Intro) y Frame 8 (cierre) son los beats de respiro — llegan a un lockup y se quedan quietos leyéndose. Los demás desarrollan su reveal a lo largo de toda la duración.
- **Negative list:** sin interfaz real de WhatsApp/Excel (son ICONOGRAFÍA inventada, nunca screenshots reales de apps de terceros); sin gradientes bokeh morado-azul genéricos de "IA"; sin nav bars/cursores de navegador reales; nunca front-load (todo de una vez) ni screensaver (elementos flotando sin jerarquía).

## Frame 1 — Hook

- scene: Pregunta directa golpea la pantalla — ¿20 chats de WhatsApp para un proveedor?
- duration: 4.672s
- transition_in: cut
- status: animated
- voiceover: "¿Bookear un proveedor para tu fiesta te toma veinte chats de WhatsApp?"
- src: compositions/frames/01-hook.html

Abrir con la fricción que todos conocen. Tipografía grande, directa, hace la pregunta que engancha.

- blueprint: kinetic-type-beats (Adapt)
- focal: la pregunta ("¿20 chats de WhatsApp?")
- roles: pregunta = foreground subject (tipografía hero) · fondo crema = background (plano, sin textura) · marca de conteo "20" = supporting (acento naranja)
- sfx: whoosh-soft (entrada de cada palabra)

Adapt: mantiene la firma del word-swap en el mismo centro; en vez de reemplazar palabras, la frase se construye palabra por palabra hasta completar la pregunta.
Scene 1 (0.0–1.8s): fondo crema liso; entra "¿Bookear un proveedor" en display ink, centrado, per-word reveal — Centered, ~45% del frame.
Scene 2 (1.8–3.4s): se suma "para tu fiesta" debajo, mismo ritmo de per-word reveal; jerarquía por tamaño ya establecida arriba.
Scene 3 (3.4–5.0s): remata "¿te toma veinte chats de WhatsApp?" con "veinte" en naranja y un leve spring-pop en ese número — hold final, quieto, se lee completo.

## Frame 2 — El problema

- scene: Iconos dispersos de WhatsApp, Excel y llamadas flotando en caos
- duration: 7.147s
- transition_in: crossfade
- status: animated
- voiceover: "Proveedores en WhatsApp, precios en un Excel, disponibilidad por teléfono. Todo separado."
- src: compositions/frames/02-problema.html

Nombrar el dolor concreto: dispersión de canales. Visual invented — iconografía simple de chat/hoja de cálculo/teléfono desordenados.

- blueprint: overwhelm-surround (Adapt)
- focal: los tres íconos-canal (chat / hoja de cálculo / teléfono)
- roles: íconos-canal = foreground subject · fondo crema con grid sutil = background (dim) · líneas de conexión rotas = supporting
- sfx: tick (cada ícono al entrar), impact-soft (cierre del frame)

Adapt: mantiene la firma de "elementos cerrando desde los bordes"; en vez de un avatar central, el punto de cierre es un signo de interrogación.
Scene 1 (0.0–2.0s): ícono de chat entra arriba-izquierda al nombrar "WhatsApp" — asymmetric 60/40, fondo dim ~40%.
Scene 2 (2.0–4.0s): ícono de hoja de cálculo entra centro-derecha al nombrar "Excel"; una línea quebrada los conecta.
Scene 3 (4.0–6.0s): ícono de teléfono entra abajo al nombrar "por teléfono"; los tres íconos se acercan levemente hacia el centro (closing-in), sin tocar — hold final, quieto, lectura clara de "todo separado".

## Frame 3 — La solución: Raymi

- scene: Wordmark TodoEventos entra, Raymi AI se presenta como el chat central
- duration: 9.109s
- transition_in: crossfade
- status: animated
- voiceover: "TodoEventos lo junta todo. Y Raymi, su IA, hace el booking por vos — en un solo chat."
- src: compositions/frames/03-solucion.html

Presentar la marca y a Raymi como la respuesta. Momento de identidad — logo/wordmark limpio, sin ruido.

- blueprint: logo-assemble-lockup (Reproduce)
- focal: wordmark "TodoEventos" + etiqueta "Raymi AI"
- roles: wordmark = foreground subject · fondo crema limpio = background · etiqueta "Raymi AI" = supporting (aparece debajo, acento morado)
- sfx: spring-pop (al asentar el lockup)

Reproduce: escenario limpio, el mark se arma desde cero y se asienta en spring-pop — la firma del blueprint, tal cual.
Scene 1 (0.0–2.5s): escenario vacío crema; al decir "TodoEventos lo junta todo" las letras del wordmark entran desde ambos lados y se ensamblan al centro — Centered, ~50% del frame.
Scene 2 (2.5–4.5s): al nombrar "Raymi", la etiqueta "Raymi AI" aparece debajo del wordmark con un spring-pop suave, acento morado.
Scene 3 (4.5–7.0s): lockup completo se asienta y HOLD — quieto, se lee sin competencia (beat de respiro del video).

## Frame 4 — Paso 1: contale a Raymi

- scene: Mockup de chat abstracto — el cliente escribe tipo de fiesta, fecha y presupuesto
- duration: 5.269s
- transition_in: cut
- status: animated
- voiceover: "Le contás qué fiesta es, la fecha y el presupuesto. Nada más."
- src: compositions/frames/04-paso1.html

Primer paso del flujo. Visual: burbuja de chat invented con texto tipo "Fiesta de cumpleaños, 15 de noviembre, presupuesto $X".

- blueprint: prompt-type-submit-generate (Reproduce)
- focal: la burbuja de chat con el mensaje del cliente
- roles: burbuja de chat = foreground subject · fondo crema con etiqueta "Raymi" arriba = background · cursor/caret de escritura = supporting
- sfx: tick (cada palabra tipeada), whoosh-soft (al enviar)

Reproduce: input real del producto que se tipea y se envía — la firma del blueprint tal cual, adaptada a un chat en vez de una barra de búsqueda.
Scene 1 (0.0–2.5s): campo de chat vacío abajo, etiqueta "Raymi" arriba — Centered, ~40% del frame; al decir "le contás qué fiesta es" empieza a tipearse "Fiesta de cumpleaños".
Scene 2 (2.5–5.0s): se completa con ", 15 de noviembre" al nombrar la fecha — per-word reveal siguiendo la VO.
Scene 3 (5.0–7.0s): se agrega "presupuesto: $X" al decir "nada más"; el mensaje se envía (burbuja se desliza y fija) — hold breve, quieto.

## Frame 5 — Paso 2: Raymi sugiere

- scene: Tarjetas de proveedores (catering, DJ, decoración) aparecen dentro del chat
- duration: 8.341s
- transition_in: cut
- status: animated
- voiceover: "Raymi filtra el catálogo y te muestra proveedores que calzan — con precio y disponibilidad, ahí mismo."
- src: compositions/frames/05-paso2.html

Segundo paso: Raymi responde con opciones. Visual: 2-3 tarjetas invented de proveedor (nombre genérico, precio, disponible/no disponible).

- blueprint: grid-card-assemble (Reproduce)
- focal: las 3 tarjetas de proveedor (catering / DJ / decoración)
- roles: tarjetas = foreground subject · fondo crema con hilo de chat arriba = background · badges de precio/disponibilidad = supporting (acento naranja "disponible")
- sfx: tick (cada tarjeta), whoosh-soft (cascada de entrada)

Reproduce: cascada escalonada de tarjetas hacia una grilla — la firma tal cual.
Scene 1 (0.0–2.5s): al decir "Raymi filtra el catálogo" aparece la tarjeta de catering, entra desde abajo — stacked, top ~83%.
Scene 2 (2.5–5.5s): al decir "te muestra proveedores que calzan" se suman DJ y decoración en cascada, formando una grilla vertical de 3.
Scene 3 (5.5–8.0s): al decir "precio y disponibilidad, ahí mismo" cada tarjeta revela su badge de precio + "disponible" en naranja — hold final, las 3 se leen completas.

## Frame 6 — Paso 3: elegís y confirmás

- scene: El cliente toca una tarjeta, Raymi confirma el booking en el chat
- duration: 8.405s
- transition_in: crossfade
- status: animated
- voiceover: "Elegís el que te gusta, confirmás fecha y hora, y el proveedor queda reservado. Sin salir del chat."
- src: compositions/frames/06-paso3.html

Tercer paso: la confirmación. Visual: check verde / mensaje de confirmación dentro de la burbuja de chat.

- blueprint: cursor-ui-demo (Adapt)
- focal: la tarjeta elegida + el mensaje de confirmación de Raymi
- roles: tarjeta elegida = foreground subject · fondo crema con las otras tarjetas atenuadas = background (dim ~40%) · check + texto de confirmación = supporting (acento naranja)
- sfx: click, impact-soft (al confirmar)

Adapt: mantiene la firma de "cursor dispara un cambio de estado en la interfaz"; en vez de navegar varias pantallas, un solo click resuelve el booking.
Scene 1 (0.0–2.5s): un cursor invented toca la tarjeta elegida al decir "elegís el que te gusta" — las otras dos tarjetas se atenúan.
Scene 2 (2.5–5.5s): al decir "confirmás fecha y hora" la tarjeta se expande levemente y muestra fecha/hora escribiéndose dentro de ella.
Scene 3 (5.5–8.0s): al decir "el proveedor queda reservado" aparece un check naranja + "Reservado" — hold final, quieto.

## Frame 7 — Seguís sumando

- scene: El mismo chat suma más proveedores al mismo evento
- duration: 5.973s
- transition_in: cut
- status: animated
- voiceover: "¿Necesitás otro proveedor para el mismo evento? Seguís en el mismo chat."
- src: compositions/frames/07-mas.html

Refuerza que todo el evento vive en una sola conversación — no hay que repetir el proceso en otro lado.

- blueprint: fixed-anchor-cycle (Adapt)
- focal: el hilo de chat con Raymi (pinned)
- roles: hilo de chat = foreground subject, pinned al centro · fondo crema = background · íconos de proveedor (catering ya reservado, DJ, decoración) = supporting, ciclan debajo
- sfx: tick (cada ícono al ciclar)

Adapt: el ancla es el propio hilo de chat, que nunca se mueve; lo que cicla son íconos de categorías de proveedor debajo, no un texto de audiencia.
Scene 1 (0.0–2.5s): el hilo de chat con Raymi queda fijo centrado, con el catering ya con check — Centered, ~45%.
Scene 2 (2.5–4.5s): al decir "necesitás otro proveedor" un ícono de DJ aparece debajo del hilo, en el mismo chat.
Scene 3 (4.5–6.0s): al decir "seguís en el mismo chat" un ícono de decoración se suma junto al de DJ — hold final, el chat sigue siendo uno solo.

## Frame 8 — Cierre

- scene: Mensaje central + wordmark TodoEventos como cierre
- duration: 5.845s
- transition_in: crossfade
- status: animated
- voiceover: "Bookear un proveedor en TodoEventos es una charla con Raymi. No un trámite."
- src: compositions/frames/08-cierre.html

Cierre de marca. Repetir el mensaje central a máxima claridad, wordmark TodoEventos como firma final.

- blueprint: kinetic-type-beats (Reproduce)
- focal: la frase de cierre + wordmark TodoEventos
- roles: frase de cierre = foreground subject · fondo crema = background · wordmark = supporting (remata abajo, ya visto en Frame 3)
- sfx: spring-pop (al asentar el wordmark final)

Reproduce: beats de texto centrado que resuelven en el logo — la firma del blueprint tal cual, como Brand_Outro.
Scene 1 (0.0–3.0s): al decir "bookear un proveedor en TodoEventos" entra la frase en display ink, centrada, per-word reveal — Centered, ~50%.
Scene 2 (3.0–5.5s): al decir "es una charla con Raymi" se suma esa línea debajo en acento morado.
Scene 3 (5.5–8.0s): al decir "no un trámite" tacha visualmente la palabra "trámite" y debajo hace spring-pop el wordmark TodoEventos — hold final, quieto (beat de respiro y cierre).
