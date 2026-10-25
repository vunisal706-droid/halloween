/* ===========================================================
   ESCAPE ROOM DE HALLOWEEN · CEIP Capitulaciones (Santa Fe)
   Retos originales inspirados en la colección de escape rooms
   de Halloween de Actividades de Infantil y Primaria /
   Orientación Andújar (CC BY-NC-SA). Licencia: CC BY-NC-SA 4.0
   -----------------------------------------------------------
   Cada escape room tiene 50 PARTIDAS distintas (semilla 1-50):
   cambian números, palabras, textos y el código del candado.
   Tipos de pregunta: num (numérica, admite coma) · opc (opciones)
   El "secreto" de cada reto es siempre una cifra del 1 al 9.
   =========================================================== */
const PARTIDAS = 50;

/* ---------- Azar con semilla ---------- */
function mkRng(seed, id) {
  let h = 2166136261; for (const c of id) h = Math.imul(h ^ c.charCodeAt(0), 16777619);
  let a = (seed * 2654435761 ^ h) >>> 0;
  const r = () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
  for (let i = 0; i < 5; i++) r();
  const R = {
    f: r,
    i: (a, b) => a + Math.floor(r() * (b - a + 1)),
    pick: arr => arr[Math.floor(r() * arr.length)],
    shuffle: arr => { const x = arr.slice(); for (let i = x.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [x[i], x[j]] = [x[j], x[i]]; } return x; },
    sample: (arr, n) => R.shuffle(arr).slice(0, n)
  };
  return R;
}
const NUM = ['cero', 'uno', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete', 'ocho', 'nueve', 'diez', 'once', 'doce'];
const HORA = h => (h === 1 ? 'La una' : 'Las ' + NUM[h]);
const dec = n => String(n).replace('.', ',');
/* pregunta de opciones con las opciones barajadas */
const O = (R, q, a, otras, extra = {}) => Object.assign({ q, tipo: 'opc', a, op: R.shuffle([a, ...otras]) }, extra);
const N = (q, a, extra = {}) => Object.assign({ q, tipo: 'num', a }, extra);
/* n números distintos */
function distintos(R, n, gen) { const s = new Set(), out = []; let g = 0; while (out.length < n && g++ < 500) { const v = gen(); const k = JSON.stringify(v); if (!s.has(k)) { s.add(k); out.push(v); } } return out; }

/* ===========================================================
   BANCOS DE PALABRAS (Lengua)
   =========================================================== */
const SILABAS = { sol: 1, pan: 1, mar: 1, luz: 1, flor: 1, bruja: 2, gato: 2, luna: 2, vela: 2, mago: 2, noche: 2, momia: 2, búho: 2, dulce: 2, capa: 2, sapo: 2,
  escoba: 3, fantasma: 3, araña: 3, sombrero: 3, castillo: 3, caldero: 3, vampiro: 3, pócima: 3, linterna: 3,
  calavera: 4, caramelo: 4, calabaza: 4, murciélago: 4, esqueleto: 4, telaraña: 4, mariposa: 4 };
const LETRAS = ['sol', 'luna', 'gato', 'bruja', 'vela', 'búho', 'mago', 'escoba', 'araña', 'momia', 'noche', 'dulce', 'capa', 'sapo', 'rata', 'miedo', 'hueso', 'tumba', 'vampiro', 'varita', 'sombra', 'hechizo', 'fantasma', 'calabaza', 'castillo', 'gigante', 'lechuza', 'cripta', 'garra'];
const LETRA_PERDIDA = [['ga_o', 't', ['d', 'p']], ['bru_a', 'j', ['ch', 'll']], ['esco_a', 'b', ['d', 'p']], ['_antasma', 'f', ['p', 'm']], ['lu_a', 'n', ['m', 'ñ']],
  ['ara_a', 'ñ', ['n', 'll']], ['ca_amelo', 'r', ['l', 'n']], ['mo_ia', 'm', ['n', 'p']], ['esque_eto', 'l', ['r', 'n']], ['cala_aza', 'b', ['d', 'p']],
  ['_ela', 'v', ['t', 'p']], ['so_brero', 'm', ['n', 'l']], ['cas_illo', 't', ['d', 'p']], ['ca_dero', 'l', ['r', 'n']]];
const FRASES = ['El gato es negro.', 'La bruja vuela alto.', 'Mi calabaza es grande.', 'El fantasma da miedo.', 'La luna brilla mucho.', 'El búho canta de noche.', 'La araña teje su tela.', 'Mi disfraz es de momia.', 'El sapo salta mucho.', 'La vela está encendida.'];
const NOMBRES = ['Tizón', 'Rosaura', 'Petra', 'Lola', 'Bruno', 'Sara'];
const ACCIONES = ['duerme', 'vuela', 'canta', 'salta', 'come', 'baila'];
const FRASES_CONTAR = ['El gato maúlla.', 'La bruja ríe.', 'El búho mira la luna.', 'Mi gato negro duerme.', 'La araña sube.', 'El fantasma vuela por la casa.', 'Tizón come.', 'La luna brilla.', 'Petra tiene una escoba vieja.'];
const PLURALES = [['calabaza', 'calabazas'], ['bruja', 'brujas'], ['gato', 'gatos'], ['fantasma', 'fantasmas'], ['vela', 'velas'], ['escoba', 'escobas'], ['araña', 'arañas'], ['caramelo', 'caramelos']];
const GENERO = [['bruja', 'brujo'], ['gata', 'gato'], ['niña', 'niño'], ['maga', 'mago'], ['vampira', 'vampiro'], ['abuela', 'abuelo']];
const CONTRARIOS = [['grande', 'pequeño', ['alto', 'gordo']], ['alto', 'bajo', ['grande', 'largo']], ['día', 'noche', ['tarde', 'sol']], ['frío', 'caliente', ['hielo', 'nieve']], ['abrir', 'cerrar', ['entrar', 'salir']], ['feo', 'bonito', ['malo', 'raro']], ['rápido', 'lento', ['corto', 'fuerte']], ['blanco', 'negro', ['gris', 'claro']]];

const CLASES = { sustantivo: ['calabaza', 'fantasma', 'escoba', 'castillo', 'vela', 'murciélago', 'caldero', 'linterna'], adjetivo: ['oscuro', 'terrorífico', 'negro', 'viejo', 'misterioso', 'peludo', 'brillante', 'travieso'], verbo: ['volar', 'asustar', 'correr', 'brillar', 'gritar', 'saltar', 'temblar', 'esconder'] };
const VERBOS3 = ['vuela', 'canta', 'ríe', 'baila', 'salta', 'grita', 'corre', 'come', 'juega'];
const SUJ3 = ['La bruja', 'El fantasma', 'La momia', 'El vampiro', 'El gato negro', 'Doña Tinta'];
const ORTO_34 = [['escoba', 'escova'], ['brujería', 'brugería'], ['vampiro', 'bampiro'], ['gigante', 'jigante'], ['calavera', 'calabera'], ['varita', 'barita'], ['viejo', 'biejo'], ['hoguera', 'oguera'], ['jaula', 'gaula'], ['búho', 'búo'], ['general', 'jeneral'], ['bosque', 'vosque']];
const SINONIMOS = [['miedo', 'temor', ['alegría', 'valor']], ['rápido', 'veloz', ['lento', 'quieto']], ['bonito', 'precioso', ['feo', 'raro']], ['contento', 'alegre', ['triste', 'serio']], ['hablar', 'conversar', ['callar', 'dormir']], ['empezar', 'comenzar', ['terminar', 'parar']], ['enfadado', 'furioso', ['tranquilo', 'feliz']]];
const ANTONIMOS = [['oscuro', 'claro', ['negro', 'triste']], ['grande', 'pequeño', ['enorme', 'alto']], ['abrir', 'cerrar', ['entrar', 'mirar']], ['frío', 'caliente', ['helado', 'fresco']], ['viejo', 'nuevo', ['antiguo', 'roto']], ['valiente', 'miedoso', ['fuerte', 'atrevido']], ['subir', 'bajar', ['saltar', 'trepar']]];
const SIL_34 = ['sol', 'mar', 'luz', 'bruja', 'luna', 'noche', 'escoba', 'vampiro', 'fantasma', 'esqueleto', 'calabaza', 'telaraña', 'murciélago'];
const TILDES = [['murciélago', 'murcielago'], ['árbol', 'arbol'], ['lápiz', 'lapiz'], ['música', 'musica'], ['pájaro', 'pajaro'], ['mágico', 'magico'], ['pócima', 'pocima'], ['sábado', 'sabado'], ['fantástico', 'fantastico'], ['búho', 'buho']];
const AGUDAS = ['sofá', 'café', 'ratón', 'jamón', 'canción', 'compás', 'calcetín'];
const LLANAS = ['mesa', 'casa', 'gato', 'luna', 'vela', 'bruja', 'escoba'];
const TONICA = [['mur-cié-la-go', 2], ['pá-ja-ro', 1], ['ra-tón', 2], ['má-gi-co', 1], ['can-ción', 2], ['fan-tás-ti-co', 2], ['ca-la-ba-za', 3], ['es-que-le-to', 3], ['bru-ji-lla', 2], ['pó-ci-ma', 1], ['ca-ra-me-lo', 3], ['te-la-ra-ña', 3]];

const SUJ56 = [['La momia', 2, 's'], ['Las momias antiguas', 3, 'p'], ['El vampiro de Transilvania', 4, 's'], ['Tres murciélagos negros', 3, 'p'], ['La bruja', 2, 's'], ['El esqueleto', 2, 's'], ['Los fantasmas del castillo', 4, 'p'], ['Las brujas', 2, 'p']];
const VERB56 = { s: ['despierta', 'vuela', 'baila', 'grita'], p: ['despiertan', 'vuelan', 'bailan', 'gritan'] };
const COMPL56 = ['en Halloween', 'por la noche', 'en la pirámide', 'bajo la luna llena', 'en el cementerio'];
const TIEMPOS = [['despertarán', 'futuro'], ['despertaron', 'pasado'], ['despiertan', 'presente'], ['volaba', 'pasado'], ['volará', 'futuro'], ['vuela', 'presente'], ['asustaremos', 'futuro'], ['bailó', 'pasado'], ['escriben', 'presente']];
const ORTO_56 = [['hechizo', 'echizo'], ['huesos', 'güesos'], ['calavera', 'calabera'], ['lluvia', 'yuvia'], ['hueco', 'güeco'], ['hielo', 'yelo'], ['llave', 'yave'], ['huella', 'güeya'], ['ahora', 'aora'], ['hueso', 'ueso'], ['vasija', 'basija'], ['halloween', 'jalouín']];
const METAFORAS = ['La luna es un queso de plata', 'Tus ojos son dos luceros', 'La noche es un manto negro', 'Las estrellas son diamantes del cielo'];
const COMPARACIONES = ['Sus ojos brillaban como brasas', 'Era blanco como la nieve', 'Corría como el viento', 'Estaba oscuro como la boca del lobo'];
const PERSONIF = ['El viento susurraba secretos', 'La luna sonreía desde el cielo', 'Las hojas bailaban en el suelo', 'La puerta gritó al abrirse'];
const POEMAS = [
  'Bajo la luna de plata\nla momia sale a pasear;\nsus vendas son de hojalata.',
  'Entre vendas y misterio\nduerme la momia en su altar;\nsi escribes sin una falta,\nla puerta te dejará pasar.',
  'Cruje la puerta del templo,\nsopla el viento del desierto,\nla momia abre un ojo,\nnadie se ha quedado quieto,\n¡y el tesoro sigue abierto!',
  'Una vela, una pluma,\nun papiro y una cruz,\nla momia escribe en la bruma\ncon un poquito de luz;\nsi aciertas cada palabra,\nya puedes salir… ¡y a ver la luz!'
];
const PREFIJOS = [['invisible', 'in-', 'no', ['muy', 'otra vez']], ['releer', 're-', 'otra vez', ['no', 'antes']], ['prehistoria', 'pre-', 'antes', ['después', 'debajo']], ['subterráneo', 'sub-', 'debajo', ['encima', 'antes']], ['deshacer', 'des-', 'lo contrario', ['otra vez', 'muy']]];
const DERIVADAS = [['fantasma', 'fantasmal', ['fantástico', 'farol']], ['miedo', 'miedoso', ['medio', 'mido']], ['terror', 'terrorífico', ['tierra', 'terraza']], ['bruja', 'brujería', ['brújula', 'brusco']], ['noche', 'nocturno', ['nota', 'nueve']], ['luna', 'lunar', ['lunes', 'lugar']]];

/* ===========================================================
   ESCAPE ROOMS
   =========================================================== */
const ESCAPES = [
/* ---------------------------------------------------------- */
{
  id: 'm12', ciclo: '1-2', area: 'mates', personaje: 'witch', color: '#16a34a',
  titulo: 'Los caramelos de la bruja Petra',
  historia: 'La bruja Petra ha entrado por la chimenea del cole y se ha llevado TODOS los caramelos de Halloween. Los ha guardado en un baúl con un candado mágico de 5 cifras. Cada reto que superéis os dará una cifra del código. ¡Recuperad los caramelos antes de que se los coma!',
  final: '¡CLAC! El baúl se abre y salen cientos de caramelos de colores. La bruja Petra, avergonzada, os pide perdón y promete repartir los dulces con toda la clase. ¡Sois unos magos de las matemáticas!',
  build(R) { return [
    { titulo: 'Las calabazas sumadoras', icono: 'pumpkin', instr: 'Cada calabaza esconde una suma. Escribe el resultado.', pista: 'Puedes contar con los dedos o dibujar palitos en un papel.',
      preguntas: [...distintos(R, 2, () => [R.i(2, 9), R.i(2, 9)]).map(([a, b]) => N(`${a} + ${b} =`, a + b)),
        (() => { const b = R.i(2, 9); return N(`10 + ${b} =`, 10 + b); })(), (() => { const t = R.pick([20, 30, 40]), b = R.i(1, 9); return N(`${t} + ${b} =`, t + b); })()],
      secreto: (() => { const n = R.i(3, 9); return N('¿Cuántas calabazas hay en el huerto de Petra?', n, { visual: { icon: 'pumpkin', n } }); })() },
    { titulo: 'El caldero de las restas', icono: 'cauldron', instr: 'Petra quita ingredientes de su caldero. Resuelve las restas.', pista: 'En una resta empiezas por el número grande y vas quitando.',
      preguntas: [...distintos(R, 2, () => { const a = R.i(5, 10); return [a, R.i(1, a - 1)]; }).map(([a, b]) => N(`${a} − ${b} =`, a - b)),
        (() => { const a = R.i(12, 19), b = R.i(1, a - 10); return N(`${a} − ${b} =`, a - b); })(), (() => { const a = R.pick([30, 40, 50, 60]), b = R.pick([10, 20]); return N(`${a} − ${b} =`, a - b); })()],
      secreto: (() => { const s = R.i(1, 3), d = R.i(1, 2); return N(`Sigue la serie mágica: ${s}, ${s + d}, ${s + 2 * d}, ¿?`, s + 3 * d); })() },
    { titulo: 'Los murciélagos ordenados', icono: 'bat', instr: 'Los murciélagos se han desordenado. Ayúdales con los números.', pista: 'Las decenas son la cifra de la izquierda y las unidades la de la derecha.',
      preguntas: (() => { const d = R.i(1, 8), u = R.i(d + 1, 9), a = 10 * d + u, b = 10 * u + d; const n1 = R.pick([19, 29, 39, 49, 59, 69]), n2 = R.pick([20, 30, 40, 50, 60, 70, 80]), n3 = R.i(21, 98);
        return [O(R, '¿Qué número es MAYOR?', String(b), [String(a)]), N(`¿Qué número va justo DESPUÉS del ${n1}?`, n1 + 1), N(`¿Qué número va justo ANTES del ${n2}?`, n2 - 1), N(`¿Cuántas DECENAS tiene el ${n3}?`, Math.floor(n3 / 10))]; })(),
      secreto: (() => { const u = R.i(1, 9), d = R.i(1, 9); return N(`¿Cuántas UNIDADES tiene el número ${10 * d + u}?`, u); })() },
    { titulo: 'Los problemas del fantasma', icono: 'ghost', instr: 'Lee despacio cada problema y piensa: ¿sumo o resto?', pista: 'Si te dan más, sumas. Si se van o se gastan, restas.',
      preguntas: (() => { const a = R.i(4, 10), b = R.i(2, 9), c = R.i(6, 12), d = R.i(2, c - 2), e = R.i(7, 12), f = R.i(2, e - 2);
        return [N(`Petra tiene ${a} caramelos y le regalan ${b} más. ¿Cuántos tiene ahora?`, a + b), N(`En la escoba van ${c} gatos y se bajan ${d}. ¿Cuántos gatos quedan?`, c - d), N(`Un fantasma tiene ${e} sábanas y lava ${f}. ¿Cuántas le quedan SIN lavar?`, e - f)]; })(),
      secreto: (() => { const a = R.i(1, 5), b = R.i(1, 4); return N(`Petra se come ${a} caramelo${a > 1 ? 's' : ''} por la mañana y ${b} por la tarde. ¿Cuántos se come en total?`, a + b); })() },
    { titulo: 'Las formas embrujadas', icono: 'moon', instr: 'La luna llena ilumina las figuras del bosque. ¿Las conoces?', pista: 'Cuenta los lados con el dedo, uno a uno.',
      preguntas: R.sample([N('¿Cuántos lados tiene un TRIÁNGULO?', 3), N('¿Cuántas esquinas tiene un CUADRADO?', 4), O(R, 'La luna llena tiene forma de…', 'círculo', ['cuadrado', 'triángulo']),
        O(R, 'Una ventana suele tener forma de…', 'rectángulo', ['círculo', 'triángulo']), N('¿Cuántos lados tiene un RECTÁNGULO?', 4), O(R, 'El sombrero de la bruja parece un…', 'triángulo', ['círculo', 'cuadrado'])], 3),
      secreto: (() => { const n = R.i(2, 9), k = R.pick([['bat', 'murciélagos vuelan sobre la luna'], ['ghost', 'fantasmas juegan al escondite'], ['candy', 'caramelos ha dejado Petra']]); return N(`¿Cuántos ${k[1]}?`, n, { visual: { icon: k[0], n } }); })() }
  ]; }
},
/* ---------------------------------------------------------- */
{
  id: 'm34', ciclo: '3-4', area: 'mates', personaje: 'vampire', color: '#b91c1c',
  titulo: 'La mansión del conde Calcúlez',
  historia: 'Habéis entrado en la vieja mansión del conde Calcúlez… ¡y la puerta se ha cerrado de golpe! El conde, un vampiro al que le encantan los números, solo os dejará salir si resolvéis sus 5 enigmas. Cada enigma os da una cifra de la llave mágica.',
  final: '¡La gran puerta de la mansión cruje y se abre! El conde Calcúlez aplaude con sus largas uñas: «Nunca nadie había resuelto mis enigmas tan rápido». Os regala un saco de calabazas de chocolate. ¡Sois libres!',
  build(R) { return [
    { titulo: 'Las multiplicaciones del conde', icono: 'vampire', instr: 'El conde solo abre su biblioteca a quien sabe las tablas.', pista: 'Multiplicar es sumar varias veces el mismo número: 6 × 4 = 6 + 6 + 6 + 6.',
      preguntas: distintos(R, 4, () => [R.i(2, 9), R.i(2, 9)]).map(([a, b]) => N(`${a} × ${b} =`, a * b)),
      secreto: (() => { const [a, b] = R.pick([[2, 2], [2, 3], [3, 3], [2, 4], [1, 7], [1, 8], [1, 9], [1, 5], [3, 2], [4, 2], [1, 6]]); return N(`El conde tiene ${a} cofre${a > 1 ? 's' : ''} con ${b} monedas en cada uno. ¿Cuántas monedas tiene?`, a * b); })() },
    { titulo: 'El pasillo de las sumas', icono: 'candle', instr: 'Las velas del pasillo se encienden con cada resultado correcto.', pista: 'Empieza siempre por las unidades, después las decenas y al final las centenas.',
      preguntas: (() => { const suma = () => { const a = [R.i(1, 6), R.i(0, 6), R.i(0, 6)], b = [R.i(1, 9 - a[0] > 3 ? 3 : 9 - a[0]), R.i(0, 9 - a[1]), R.i(0, 9 - a[2])]; return [a[0] * 100 + a[1] * 10 + a[2], b[0] * 100 + b[1] * 10 + b[2]]; };
        const resta = () => { const a = [R.i(4, 9), R.i(0, 9), R.i(0, 9)], b = [R.i(1, a[0] - 1), R.i(0, a[1]), R.i(0, a[2])]; return [a[0] * 100 + a[1] * 10 + a[2], b[0] * 100 + b[1] * 10 + b[2]]; };
        const [s1, s2, r1, r2] = [suma(), suma(), resta(), resta()];
        return [N(`${s1[0]} + ${s1[1]} =`, s1[0] + s1[1]), N(`${r1[0]} − ${r1[1]} =`, r1[0] - r1[1]), N(`${s2[0]} + ${s2[1]} =`, s2[0] + s2[1]), N(`${r2[0]} − ${r2[1]} =`, r2[0] - r2[1])]; })(),
      secreto: (() => { const c = R.i(1, 9); return N(`¿Qué cifra está en las CENTENAS del número ${c}${R.i(0, 9)}${R.i(0, 9)}?`, c); })() },
    { titulo: 'El reloj del abuelo', icono: 'clock', instr: 'El viejo reloj del salón da las horas a su manera. ¿Qué hora marca?', pista: 'La aguja corta marca la hora; la larga, los minutos. Si la larga apunta abajo (al 6), es «y media».',
      preguntas: (() => { const h1 = R.i(1, 12), h2 = R.i(1, 12);
        return [O(R, '¿Qué hora marca este reloj?', `${HORA(h1)} en punto`, [`${HORA(h1 % 12 + 1)} en punto`, `${HORA(h1)} y media`], { visual: { clock: [h1, 0] } }),
          O(R, '¿Y este otro?', `${HORA(h2)} y media`, [`${HORA(h2)} en punto`, `${HORA(h2 % 12 + 1)} y media`], { visual: { clock: [h2, 30] } }),
          R.pick([N('¿Cuántos minutos tiene una hora?', 60), N('¿Cuántos minutos tiene media hora?', 30), N('¿Cuántos minutos tiene un cuarto de hora?', 15)])]; })(),
      secreto: (() => { const h = R.i(1, 6), d = R.i(1, 9 - h); return N(`Son ${h === 1 ? 'la una' : 'las ' + NUM[h]} en punto y el conde duerme ${d} hora${d > 1 ? 's' : ''}. ¿A qué hora se despierta? (escribe solo el número)`, h + d); })() },
    { titulo: 'Las calaveras repartidas', icono: 'skull', instr: 'En la cripta hay que repartir las calaveras en partes iguales.', pista: 'Dividir es repartir. 12 : 3 → ¿qué número por 3 da 12?',
      preguntas: distintos(R, 4, () => [R.i(2, 9), R.i(2, 9)]).map(([b, q]) => N(`${b * q} : ${b} =`, q)),
      secreto: (() => { const c = R.pick([2, 3]), q = R.i(2, 9); return N(`Reparte ${c * q} calaveras en ${c} cofres iguales. ¿Cuántas van en cada cofre?`, q); })() },
    { titulo: 'Los problemas del sótano', icono: 'bat', instr: 'Último enigma. Lee bien cada problema antes de calcular.', pista: '«Cada una» o «cada uno» suele significar que hay que multiplicar.',
      preguntas: (() => { const c = R.i(3, 6), v = R.i(4, 9), a = R.i(40, 90), b = R.i(11, 29), p = R.i(2, 5), n = R.i(3, 6);
        return [N(`El conde tiene ${c} cajas con ${v} velas cada una. ¿Cuántas velas tiene?`, c * v), N(`En el sótano había ${a} murciélagos y se van volando ${b}. ¿Cuántos quedan?`, a - b), N(`La entrada a la mansión cuesta ${p} €. ¿Cuánto pagan ${n} niños?`, p * n)]; })(),
      secreto: (() => { const k = R.i(2, 9); return N(`Hay ${2 * k} murciélagos y la MITAD se esconden. ¿Cuántos se esconden?`, k); })() }
  ]; }
},
/* ---------------------------------------------------------- */
{
  id: 'm56', ciclo: '5-6', area: 'mates', personaje: 'skeleton', color: '#0891b2',
  titulo: 'El laboratorio del doctor Esqueletón',
  historia: 'El doctor Esqueletón ha preparado una poción que convierte a todo el mundo en esqueleto… ¡y la ha dejado hirviendo! El antídoto está en una caja fuerte con código de 5 cifras. Solo los mejores matemáticos podrán abrirla antes de que la poción se derrame.',
  final: '¡Bip, bip, CLIC! La caja fuerte se abre y el frasco de antídoto brilla en verde. Lo echáis en el caldero y la poción se apaga con un «¡puf!» morado. El doctor Esqueletón hace sonar sus huesos de alegría: ¡habéis salvado al colegio!',
  build(R) { return [
    { titulo: 'Las pociones decimales', icono: 'potion', instr: 'Mezcla las pociones con cuidado: ¡son números decimales! (puedes usar la coma)', pista: 'Coloca la coma debajo de la coma y opera como siempre.',
      preguntas: (() => { const a = R.i(1, 6), b = R.i(1, 3), c = R.i(1, 5), d = R.i(1, 4), e = R.i(6, 12), f = R.i(1, 4), k = R.i(2, 8);
        return [N(`${a},5 + ${b},5 =`, a + b + 1), N(`${c},25 + ${d},75 =`, c + d + 1), N(`${e} − ${f},5 =`, e - f - 0.5), N(`0,5 × ${2 * k} =`, k)]; })(),
      secreto: (() => { const d = R.i(1, 9); return N(`¿Qué cifra ocupa las DÉCIMAS en el número ${R.i(1, 9)},${d}?`, d); })() },
    { titulo: 'Los frascos fraccionados', icono: 'flask', instr: 'Cada frasco está lleno solo en parte. Piensa en fracciones.', pista: 'Para calcular 1/4 de 20, divide 20 entre 4.',
      preguntas: (() => { const [nom, fr, ot] = R.pick([['MITAD', '1/2', ['1/3', '2/1']], ['TERCERA parte', '1/3', ['1/2', '3/1']], ['CUARTA parte', '1/4', ['4/1', '1/2']]]);
        const k = R.pick([3, 4, 5]), m = R.i(2, 6), m2 = R.i(1, 4), den = R.pick([5, 6, 7, 8]), x = R.i(1, den - 2), y = R.i(x + 1, den - 1);
        return [O(R, `¿Qué fracción es la ${nom}?`, fr, ot), N(`1/${k} de ${k * m} =`, m), N(`3/4 de ${4 * m2} =`, 3 * m2), O(R, '¿Qué fracción es MAYOR?', `${y}/${den}`, [`${x}/${den}`])]; })(),
      secreto: (() => { const m = R.i(1, 9); return N(`La TERCERA parte de ${3 * m} frascos son…`, m); })() },
    { titulo: 'La máquina de huesos', icono: 'skull', instr: 'La máquina del doctor multiplica y calcula porcentajes.', pista: 'El 50 % es la mitad. El 10 % es dividir entre 10.',
      preguntas: (() => { const a = R.pick([25, 50]), b = R.i(2, 6), c = R.pick([110, 120, 130, 210, 320]), d = R.i(2, 3), e = R.i(3, 9) * 20, f = R.i(2, 9) * 10;
        return [N(`${a} × ${b} =`, a * b), N(`${c} × ${d} =`, c * d), N(`50 % de ${e} =`, e / 2), N(`10 % de ${f} =`, f / 10)]; })(),
      secreto: R.pick([N('¿Cuántos ceros tiene un millón (1 000 000)?', 6), N('¿Cuántos ceros tiene cien mil (100 000)?', 5), N('¿Cuántos ceros tiene diez mil (10 000)?', 4), N('¿Cuántos ceros tiene mil (1 000)?', 3), N('¿Cuántos ceros tiene cien (100)?', 2), N('¿Cuántas cifras tiene un millón (1 000 000)?', 7), N('¿Cuántas cifras tiene diez millones (10 000 000)?', 8), N('¿Cuántas cifras tiene cien millones (100 000 000)?', 9)]) },
    { titulo: 'Las figuras del laboratorio', icono: 'flask', instr: 'Las mesas del laboratorio tienen formas geométricas.', pista: 'Perímetro = suma de todos los lados. Área del rectángulo = largo × ancho.',
      preguntas: (() => { const l = R.i(3, 12), a = R.i(3, 9), b = R.i(2, 6);
        return [N(`Perímetro de un cuadrado de ${l} cm de lado (en cm):`, 4 * l), N(`Área de un rectángulo de ${a} cm × ${b} cm (en cm²):`, a * b), R.pick([N('¿Cuántos grados mide un ángulo RECTO?', 90), N('¿Cuántos grados mide un ángulo LLANO?', 180), N('¿Cuántos grados mide una vuelta completa?', 360)])]; })(),
      secreto: R.pick([N('¿Cuántos lados tiene un PENTÁGONO?', 5), N('¿Cuántos lados tiene un HEXÁGONO?', 6), N('¿Cuántos lados tiene un OCTÓGONO?', 8), N('¿Cuántos lados tiene un TRIÁNGULO?', 3), N('¿Cuántos vértices tiene un CUADRADO?', 4), N('¿Cuántos lados tiene un HEPTÁGONO?', 7), N('¿Cuántos lados tiene un ENEÁGONO?', 9)]) },
    { titulo: 'Los problemas del doctor', icono: 'skeleton', instr: 'Último paso para conseguir el antídoto. ¡Concentración!', pista: 'Para la media: suma todos los números y divide entre cuántos hay.',
      preguntas: (() => { const n = R.i(2, 4), p = R.i(1, 3), q = R.i(3, 6), h = R.i(10, 40), m = R.i(4, 9), d = R.i(1, 3);
        return [N(`El doctor compra ${n} frascos a ${p},50 € cada uno. ¿Cuánto paga (en €)?`, n * (p + 0.5)), N(`Tiene ${q * h} huesos y los guarda en ${q} cajas iguales. ¿Cuántos huesos en cada caja?`, h), N(`¿Cuál es la media de ${m - d}, ${m} y ${m + d}?`, m)]; })(),
      secreto: (() => { const u = R.i(1, 9), up = R.f() < .5; const x = up ? `${u - 1},${R.i(5, 9)}` : `${u},${R.i(1, 4)}`; return N(`Redondea ${x} a las unidades:`, u); })() }
  ]; }
},
/* ---------------------------------------------------------- */
{
  id: 'l12', ciclo: '1-2', area: 'lengua', personaje: 'cat', color: '#7c3aed',
  titulo: 'El gato Tizón y el libro de hechizos',
  historia: 'Tizón, el gato negro de la bruja Rosaura, ha tirado el libro de hechizos al suelo… ¡y todas las letras se han escapado! Ahora el libro está cerrado con un candado de 5 cifras. Ayudad a Tizón a resolver los retos de las letras para abrirlo antes de que vuelva Rosaura.',
  final: '¡El libro de hechizos se abre y las letras vuelven volando a sus páginas! Tizón ronronea de felicidad y, cuando llega la bruja Rosaura, todo está en su sitio. Como premio, os enseña un hechizo secreto: «¡Abracadabra, lectura mágica!»',
  build(R) { const W = R.shuffle(Object.keys(SILABAS)); const L = R.shuffle(LETRAS); return [
    { titulo: 'Las sílabas mágicas', icono: 'hat', instr: 'Da palmadas para contar las sílabas de cada palabra.', pista: 'Una palmada por cada golpe de voz: bru-ja → 2 palmadas.',
      preguntas: W.slice(0, 4).map(w => N(`¿Cuántas sílabas tiene ${w.toUpperCase()}?`, SILABAS[w])),
      secreto: N(`¿Cuántas sílabas tiene la palabra ${W[4].toUpperCase()}?`, SILABAS[W[4]]) },
    { titulo: 'Las letras perdidas', icono: 'cat', instr: 'A estas palabras les falta una letra. ¿Cuál es?', pista: 'Lee la palabra en voz alta con cada letra y escucha cuál suena bien.',
      preguntas: R.sample(LETRA_PERDIDA, 4).map(([w, a, o]) => O(R, w.toUpperCase().replace('_', ' _ '), a, o)),
      secreto: N(`¿Cuántas letras tiene la palabra ${L[0].toUpperCase()}?`, L[0].length) },
    { titulo: 'Las frases del caldero', icono: 'cauldron', instr: 'El caldero ha mezclado las palabras. Elige la frase bien escrita.', pista: 'Las frases empiezan con mayúscula y terminan con punto.',
      preguntas: (() => { const f = R.pick(FRASES), ws = f.slice(0, -1).split(' '); const mez = () => { let x; let g = 0; do { x = R.shuffle(ws).join(' '); } while (x === ws.join(' ') && g++ < 20); return x[0].toUpperCase() + x.slice(1).toLowerCase() + '.'; };
        const malas = distintos(R, 2, mez).filter(x => x !== f); while (malas.length < 2) malas.push(ws.slice().reverse().join(' ') + '.');
        const nom = R.pick(NOMBRES), ac = R.pick(ACCIONES);
        return [O(R, '¿Qué frase está bien ordenada?', f, malas.slice(0, 2)), O(R, '¿Cuál está bien escrita?', `${nom} ${ac}.`, [`${nom.toLowerCase()} ${ac}.`, `${nom} ${ac}`]),
          R.pick([O(R, 'Los nombres propios empiezan por…', 'mayúscula', ['minúscula']), O(R, 'Al final de una frase ponemos…', 'un punto', ['una coma', 'una letra']), O(R, 'La primera letra de una frase va en…', 'mayúscula', ['minúscula'])])]; })(),
      secreto: (() => { const f = R.pick(FRASES_CONTAR); return N(`¿Cuántas palabras tiene esta frase?  «${f}»`, f.split(' ').length); })() },
    (() => { const ojos = R.pick(['amarillos', 'verdes', 'azules']), dor = R.pick(['en el sombrero', 'en la escoba', 'en el caldero']), mira = R.pick(['la luna', 'las estrellas', 'las calabazas']), n = R.i(2, 9);
      const dorTxt = { 'en el sombrero': 'dentro del sombrero de la bruja', 'en la escoba': 'encima de la escoba de la bruja', 'en el caldero': 'dentro del caldero vacío' }[dor];
      return { titulo: 'El cuento de Tizón', icono: 'book', instr: 'Lee el cuento con atención y contesta.',
        texto: `Tizón es un gato negro con los ojos ${ojos}. Vive en una casa vieja con la bruja Rosaura. Le encanta dormir ${dorTxt}. Por la noche sale al tejado a mirar ${mira}. Tizón tiene ${NUM[n]} amigos fantasmas que juegan con él al escondite.`,
        pista: 'Vuelve a leer el cuento. Las respuestas están escritas en él.',
        preguntas: [O(R, '¿De qué color son los ojos de Tizón?', ojos, ['amarillos', 'verdes', 'azules'].filter(x => x !== ojos)), O(R, '¿Dónde le encanta dormir?', dor, ['en el sombrero', 'en la escoba', 'en el caldero'].filter(x => x !== dor)), O(R, '¿Qué mira por la noche?', mira, ['la luna', 'las estrellas', 'las calabazas'].filter(x => x !== mira))],
        secreto: N('¿Cuántos amigos fantasmas tiene Tizón?', n) }; })(),
    { titulo: 'Las palabras de la luna', icono: 'moon', instr: 'Último reto. ¡Piensa como un mago de las palabras!', pista: 'Plural es cuando hay MÁS de uno.',
      preguntas: (() => { const [s, p] = R.pick(PLURALES), [f, m] = R.pick(GENERO), [w, c, o] = R.pick(CONTRARIOS);
        return [O(R, '¿Qué palabra está en PLURAL?', p, [s]), O(R, `Si «${f}» es chica, el chico es…`, m, [f, f + 's']), O(R, `Lo contrario de ${w.toUpperCase()} es…`, c, o)]; })(),
      secreto: N(`¿Cuántas letras tiene la palabra ${L[1].toUpperCase()}?`, L[1].length) }
  ]; }
},
/* ---------------------------------------------------------- */
{
  id: 'l34', ciclo: '3-4', area: 'lengua', personaje: 'ghost', color: '#db2777',
  titulo: 'La biblioteca encantada de Doña Tinta',
  historia: 'En el último piso de la biblioteca vive Doña Tinta, un fantasma que cuida los libros. Esta noche de Halloween los libros se han abierto solos y las palabras se han escapado volando. Doña Tinta ha cerrado la biblioteca con un candado de 5 cifras y solo lo abrirá para quien la ayude a ordenar el lenguaje.',
  final: '¡El candado se abre y las palabras regresan a sus libros como una lluvia de letras! Doña Tinta sonríe y os nombra «Guardianes de la Biblioteca». Desde hoy, podréis llevaros el libro que queráis… ¡aunque alguno todavía susurra por las noches!',
  build(R) { const LL = R.shuffle(LETRAS.filter(w => w.length <= 9)); return [
    { titulo: 'Las palabras con nombre', icono: 'book', instr: 'Cada palabra pertenece a una familia: sustantivo, adjetivo o verbo.', pista: 'Sustantivo = cosa, persona o animal. Adjetivo = cómo es. Verbo = acción.',
      preguntas: R.shuffle(['sustantivo', 'adjetivo', 'verbo']).map(c => O(R, `«${R.pick(CLASES[c])}» es un…`, c, ['sustantivo', 'adjetivo', 'verbo'].filter(x => x !== c))),
      secreto: (() => { const n = R.i(1, 4), v = R.sample(VERBOS3, n), s = R.pick(SUJ3); const t = n === 1 ? v[0] : v.slice(0, -1).join(', ') + ' y ' + v[n - 1]; return N(`¿Cuántos verbos hay en esta frase?  «${s} ${t}.»`, n); })() },
    { titulo: 'El estante de la ortografía', icono: 'bat', instr: 'Algunas palabras tienen faltas. Elige la palabra BIEN escrita.', pista: 'Fíjate bien en la b/v, la g/j y la h.',
      preguntas: R.sample(ORTO_34, 4).map(([ok, ko]) => O(R, 'Elige la correcta:', ok, [ko])),
      secreto: N(`¿Cuántas letras tiene la palabra ${LL[0].toUpperCase()}?`, LL[0].length) },
    { titulo: 'Los gemelos y los opuestos', icono: 'ghost', instr: 'Sinónimos significan lo mismo. Antónimos, lo contrario.', pista: 'Pregúntate: ¿significa lo mismo o lo contrario?',
      preguntas: (() => { const nS = R.i(1, 2); return R.shuffle([...R.sample(SINONIMOS, nS).map(([w, a, o]) => O(R, `Un SINÓNIMO de «${w}» es…`, a, o)), ...R.sample(ANTONIMOS, 3 - nS).map(([w, a, o]) => O(R, `Un ANTÓNIMO de «${w}» es…`, a, o))]); })(),
      secreto: (() => { const w = R.pick(SIL_34); return N(`¿Cuántas sílabas tiene la palabra ${w.toUpperCase()}?`, SILABAS[w]); })() },
    (() => { const hora = R.pick(['diez', 'once']), como = R.pick(['mariposas', 'luciérnagas', 'pájaros']), n = R.i(2, 9);
      return { titulo: 'El libro que susurra', icono: 'book', instr: 'Este libro cuenta una historia. Léela y responde.',
        texto: `Cada noche de Halloween, a las ${hora} en punto, los libros de la biblioteca se abrían solos y las letras salían volando como ${como}. Doña Tinta, el fantasma bibliotecario, tenía que atraparlas una a una antes de las doce, porque si no, los cuentos se quedaban en blanco para siempre. Aquella noche, ${NUM[n]} niños valientes subieron las escaleras con sus linternas para ayudarla.`,
        pista: 'Busca en el texto las palabras de la pregunta.',
        preguntas: [O(R, '¿Quién es Doña Tinta?', 'un fantasma bibliotecario', ['una bruja', 'una maestra']), O(R, '¿Cómo salían volando las letras?', `como ${como}`, ['mariposas', 'luciérnagas', 'pájaros', 'murciélagos'].filter(x => x !== como).slice(0, 2).map(x => 'como ' + x)),
          O(R, '¿A qué hora se abrían los libros?', `a las ${hora}`, ['a las doce', hora === 'diez' ? 'a las once' : 'a las diez'])],
        secreto: N('¿Cuántos niños valientes subieron las escaleras?', n) }; })(),
    { titulo: 'Las tildes escondidas', icono: 'candle', instr: 'Doña Tinta ha borrado algunas tildes. ¡Encuéntralas!', pista: 'Las palabras con tilde se pronuncian más fuerte en la sílaba que la lleva.',
      preguntas: [...R.sample(TILDES, 2).map(([ok, ko]) => O(R, 'Elige la palabra bien escrita:', ok, [ko])), O(R, '¿En qué palabra suena más fuerte la ÚLTIMA sílaba?', R.pick(AGUDAS), R.sample(LLANAS, 2))],
      secreto: (() => { const [w, n] = R.pick(TONICA); return N(`En «${w}», ¿en qué sílaba suena más fuerte? (cuenta desde el principio: 1, 2, 3…)`, n); })() }
  ]; }
},
/* ---------------------------------------------------------- */
{
  id: 'l56', ciclo: '5-6', area: 'lengua', personaje: 'mummy', color: '#ca8a04',
  titulo: 'La pirámide de la momia Ortografina',
  historia: 'Habéis descubierto una pirámide escondida bajo el patio del colegio. Dentro duerme la momia Ortografina, que lleva siglos vigilando un tesoro de palabras. La salida está sellada con un candado de 5 cifras y la momia solo deja salir a quien demuestra que domina la lengua.',
  final: '¡La losa de piedra se desliza y entra la luz del patio! La momia Ortografina se desenrolla una venda para saludaros: «Hacía siglos que nadie escribía tan bien». Os entrega el tesoro de la pirámide. ¡Misión cumplida!',
  build(R) { const LL = R.shuffle(LETRAS.filter(w => w.length <= 9)); const [suj, nw, num] = R.pick(SUJ56), verb = R.pick(VERB56[num]), comp = R.pick(COMPL56); const adj = suj.split(' ').slice(1).find(x => x.length > 3 && x !== 'de' && x !== 'del') || suj.split(' ')[1]; const [tv, tt] = R.pick(TIEMPOS); return [
    { titulo: 'La sala del sujeto', icono: 'mummy', instr: `Analiza la oración:  «${suj} ${verb} ${comp}.»`, pista: 'El sujeto es quien realiza la acción. Pregunta al verbo: ¿quién…?',
      preguntas: [O(R, '¿Cuál es el SUJETO?', suj, [`${verb} ${comp}`, comp]), O(R, '¿Cuál es el VERBO?', verb, [adj, comp.split(' ').pop()]), O(R, `«${tv}» está en tiempo…`, tt, ['pasado', 'presente', 'futuro'].filter(x => x !== tt))],
      secreto: N(`¿Cuántas palabras tiene el sujeto «${suj}»?`, nw) },
    { titulo: 'Los jeroglíficos de la h', icono: 'skull', instr: 'Los jeroglíficos de la pared tienen trampas ortográficas.', pista: 'Hueso, hechizo, hueco… muchas palabras empiezan por h aunque no suene.',
      preguntas: R.sample(ORTO_56, 4).map(([ok, ko]) => O(R, 'Elige la correcta:', ok, [ko])),
      secreto: N(`¿Cuántas letras tiene la palabra ${LL[0].toUpperCase()}?`, LL[0].length) },
    (() => { const poema = R.pick(POEMAS); return { titulo: 'El muro de los poetas', icono: 'moon', instr: 'En la pared hay frases poéticas. ¿Qué recurso usan?', texto: poema,
      pista: 'Comparación usa «como». Metáfora dice que algo ES otra cosa. Personificación da acciones humanas a cosas.',
      preguntas: R.shuffle([['metáfora', METAFORAS], ['comparación', COMPARACIONES], ['personificación', PERSONIF]]).map(([t, b]) => O(R, `«${R.pick(b)}» es una…`, t, ['metáfora', 'comparación', 'personificación'].filter(x => x !== t))),
      secreto: N('¿Cuántos versos tiene la estrofa del muro?', poema.split('\n').length) }; })(),
    (() => { const n = R.i(2, 9), tes = R.pick(['un diccionario dorado', 'una pluma de oro', 'un tintero mágico']), ofi = R.pick(['escriba', 'copista']);
      return { titulo: 'El papiro de la momia', icono: 'book', instr: 'Lee el papiro y responde a las preguntas.',
        texto: `La momia Ortografina fue, hace ${NUM[n]} siglos, la ${ofi} más famosa del reino. Copiaba los libros a mano sin cometer ni una sola falta. Cuando murió, pidió que la enterraran junto a su tesoro: ${tes}. Dicen que, cada 31 de octubre, despierta para comprobar si los niños y niñas siguen escribiendo bien. Si encuentra una falta, se vuelve a dormir muy enfadada; si no la encuentra, deja salir a los visitantes con una sonrisa.`,
        pista: 'Las respuestas están en el papiro. Léelo despacio, frase a frase.',
        preguntas: [O(R, '¿A qué se dedicaba Ortografina?', `Era ${ofi}`, ['Era reina', 'Era cocinera']), O(R, '¿Cuál era su tesoro?', tes, ['un diccionario dorado', 'una pluma de oro', 'un tintero mágico', 'un cofre de monedas'].filter(x => x !== tes).slice(0, 2)),
          O(R, '¿Qué hace si NO encuentra faltas?', 'Deja salir a los visitantes', ['Se enfada', 'Se vuelve a dormir'])],
        secreto: N('¿Cuántos siglos hace que vivió Ortografina?', n) }; })(),
    { titulo: 'La cámara de las palabras', icono: 'candle', instr: 'Última cámara: palabras que nacen de otras palabras.', pista: 'Un prefijo va delante de la palabra (in-, re-, des-) y un sufijo va detrás (-oso, -al).',
      preguntas: (() => { const [p, pre, sig, ot] = R.pick(PREFIJOS), ds = R.sample(DERIVADAS, 2);
        return [O(R, `En «${p}», el prefijo «${pre}» significa…`, sig, ot), ...ds.map(([b, d, o]) => O(R, `¿Qué palabra deriva de «${b}»?`, d, o))]; })(),
      secreto: (() => { const n = R.i(1, 9), l = 'ABCDEFGHI'[n - 1]; return N(`¿Qué lugar ocupa la letra ${l} en el abecedario? (A=1, B=2…)`, n); })() }
  ]; }
}
];

/* Genera los 5 retos de una partida (1-50) */
/* ===========================================================
   INFANTIL (3, 4 y 5 años): sin leer — todo con dibujos y voz
   =========================================================== */
const COLORES = { naranja: '#f97316', morado: '#7c3aed', verde: '#22c55e', negro: '#1f1235', amarillo: '#facc15', rojo: '#ef4444', azul: '#3b82f6', blanco: '#ffffff' };
const sw = c => `<span class="sw" style="background:${COLORES[c]}"></span>`;
const FORMAS = {
  círculo: '<svg viewBox="0 0 60 60" class="shp"><circle cx="30" cy="30" r="24" fill="#f97316" stroke="#2b1747" stroke-width="4"/></svg>',
  cuadrado: '<svg viewBox="0 0 60 60" class="shp"><rect x="7" y="7" width="46" height="46" rx="4" fill="#7c3aed" stroke="#2b1747" stroke-width="4"/></svg>',
  triángulo: '<svg viewBox="0 0 60 60" class="shp"><path d="M30 5 L56 53 H4z" fill="#22c55e" stroke="#2b1747" stroke-width="4" stroke-linejoin="round"/></svg>',
  rectángulo: '<svg viewBox="0 0 60 60" class="shp"><rect x="3" y="16" width="54" height="28" rx="4" fill="#facc15" stroke="#2b1747" stroke-width="4"/></svg>'
};
const PIC = k => `<span class="pic">${ART[k]}</span>`;
const SER_ICONS = ['pumpkin', 'ghost', 'bat', 'candy', 'skull', 'cat'];
const RAROS = [['🍦', 'el helado'], ['⚽', 'la pelota'], ['🏖️', 'la playa'], ['🌻', 'el girasol'], ['🚗', 'el coche']];
const ANIMALES = [['cat', 'el GATO', 'miau'], ['bat', 'el MURCIÉLAGO', ''], ['spider', 'la ARAÑA', '']];
const VOCAL_PIC = [['A', '🕷️', 'ARAÑA'], ['E', '🧹', 'ESCOBA'], ['O', '👁️', 'OJO'], ['U', '🍇', 'UVAS'], ['I', '🏝️', 'ISLA']];
const CONTAR_ICONS = [['pumpkin', 'calabazas', 1], ['ghost', 'fantasmas'], ['bat', 'murciélagos'], ['candy', 'caramelos'], ['cat', 'gatos'], ['skull', 'calaveras', 1]];

function infantil(edad) {
  const max = { 3: 3, 4: 5, 5: 9 }[edad], nOp = { 3: 3, 4: 3, 5: 4 }[edad];
  /* pregunta de contar con botones de números */
  const contar = R => { const [ic, nom, fem] = R.pick(CONTAR_ICONS), n = R.i(1, max), cu = fem ? 'Cuántas' : 'Cuántos', lo = fem ? 'Cuéntalas' : 'Cuéntalos';
    let ops = Array.from({ length: max }, (_, k) => k + 1); if (ops.length > nOp) { ops = R.shuffle(ops.filter(x => x !== n)).slice(0, nOp - 1).concat(n).sort((a, b) => a - b); }
    return { q: `¿${cu} ${nom} hay? ¡${lo}!`, tipo: 'opc', a: String(n), op: ops.map(String), lab: Object.fromEntries(ops.map(o => [String(o), `<b class="numop">${o}</b>`])), visual: { icon: ic, n }, voz: `¿${cu} ${nom} hay? ${lo} con el dedo.` }; };
  const sec = R => contar(R);
  const pics = (R, q, a, otras, lab, voz) => ({ q, tipo: 'opc', a, op: R.shuffle([a, ...otras]), lab, voz: voz || q });
  return {
    id: 'i' + edad, ciclo: 'inf', edad, area: 'infantil', personaje: 'ghost', color: { 3: '#f97316', 4: '#22c55e', 5: '#3b82f6' }[edad], voz: true,
    titulo: { 3: 'Bu, el fantasma dormilón', 4: 'Bu y las calabazas perdidas', 5: 'Bu y el castillo de los caramelos' }[edad],
    historia: { 3: 'Bu es un fantasma pequeñito que se ha quedado dormido dentro de una calabaza. ¡Y la calabaza tiene un candado! Vamos a jugar a 5 juegos para despertarlo. Cada juego nos da un número mágico.',
      4: 'Bu, el fantasma más simpático del cole, ha perdido sus calabazas mágicas. Están guardadas en un baúl con candado. Si superamos los 5 juegos, conseguiremos los números para abrirlo.',
      5: 'Bu quiere entrar en el castillo de los caramelos, pero la puerta tiene un candado de 5 números. ¡Ayudémosle! En cada juego encontraremos un número mágico.' }[edad],
    final: '¡Lo habéis conseguido! Bu da volteretas de alegría y os da las gracias con un abrazo fantasmal muy suave. ¡Sois unos campeones de Halloween!',
    build(R) {
      const cols = { 3: ['naranja', 'morado', 'verde', 'amarillo'], 4: ['naranja', 'morado', 'verde', 'negro', 'amarillo', 'rojo'], 5: Object.keys(COLORES) }[edad];
      const fs = { 3: ['círculo', 'cuadrado'], 4: ['círculo', 'cuadrado', 'triángulo'], 5: ['círculo', 'cuadrado', 'triángulo', 'rectángulo'] }[edad];
      const colQ = () => { const c = R.sample(cols, 3); return pics(R, `Toca el color ${c[0].toUpperCase()}`, c[0], c.slice(1), Object.fromEntries(c.map(x => [x, sw(x)]))); };
      const formQ = () => { const f = R.sample(fs, Math.min(3, fs.length)); return pics(R, `Toca el ${f[0].toUpperCase()}`, f[0], f.slice(1), Object.fromEntries(f.map(x => [x, FORMAS[x]]))); };
      const sizeQ = () => { const big = R.f() < .5, ic = R.pick(['pumpkin', 'ghost', 'candy']); const L = { grande: `<span class="pic" style="width:90px">${ART[ic]}</span>`, pequeño: `<span class="pic" style="width:42px">${ART[ic]}</span>` };
        return pics(R, `Toca el dibujo ${big ? 'GRANDE' : 'PEQUEÑO'}`, big ? 'grande' : 'pequeño', [big ? 'pequeño' : 'grande'], L); };
      const serieQ = () => { const [a, b, c] = R.sample(SER_ICONS, 3); const pat = edad === 5 ? [a, b, c, a, b] : [a, b, a, b, a]; const ans = edad === 5 ? c : b; const ops = edad === 5 ? [c, a, b] : [b, a, c];
        return Object.assign(pics(R, '¿Qué dibujo va después?', ans, ops.filter(x => x !== ans), Object.fromEntries(ops.map(x => [x, PIC(x)])), '¿Qué dibujo va después? Mira la fila.'),
          { html: `<div class="serie">${pat.map(x => PIC(x)).join('')}<span class="pic qm">?</span></div>` }); };
      const raroQ = () => { const [em, nom] = R.pick(RAROS), [h1, h2] = R.sample(['pumpkin', 'ghost', 'bat', 'skull', 'cat', 'hat'], 2);
        return pics(R, '¿Qué dibujo NO es de Halloween?', 'raro', [h1, h2], { raro: `<span class="emo">${em}</span>`, [h1]: PIC(h1), [h2]: PIC(h2) }); };
      const animalQ = () => { const [k, nom] = R.pick(ANIMALES); const otros = ANIMALES.filter(x => x[0] !== k).map(x => x[0]);
        return pics(R, `¿Dónde está ${nom}?`, k, otros, Object.fromEntries([k, ...otros].map(x => [x, PIC(x)]))); };
      const vocalQ = () => { const vs = edad === 4 ? ['A', 'E', 'I', 'O', 'U'] : null;
        if (edad === 4) { const v = R.sample(vs, 3); return pics(R, `Toca la letra ${v[0]}`, v[0], v.slice(1), Object.fromEntries(v.map(x => [x, `<b class="numop">${x}</b>`])), `Toca la letra ${v[0]}`); }
        const [v, em, w] = R.pick(VOCAL_PIC), ot = R.sample(['A', 'E', 'I', 'O', 'U'].filter(x => x !== v), 2);
        return Object.assign(pics(R, `¿Con qué letra empieza ${w}?`, v, ot, Object.fromEntries([v, ...ot].map(x => [x, `<b class="numop">${x}</b>`])), `¿Con qué letra empieza ${w.toLowerCase()}?`), { html: `<div class="serie"><span class="emo big">${em}</span></div>` }); };
      const caraQ = () => pics(R, '¿Qué fantasma está CONTENTO?', 'feliz', ['triste'], { feliz: '<span class="emo">😄</span>', triste: '<span class="emo">😢</span>' });
      const p3 = { 3: [animalQ, caraQ], 4: [vocalQ, animalQ], 5: [vocalQ, vocalQ] }[edad];
      return [
        { titulo: 'Las calabazas contadoras', icono: 'pumpkin', instr: 'Cuenta los dibujos y toca el número.', pista: 'Toca cada dibujo con el dedo mientras cuentas: uno, dos, tres…', preguntas: [contar(R)], secreto: sec(R) },
        { titulo: 'Los colores del caldero', icono: 'cauldron', instr: 'Escucha y toca el color.', pista: 'Pídele ayuda a tu compañero o a tu profe.', preguntas: (() => { const qs = []; let g = 0; while (qs.length < (edad > 3 ? 2 : 1) && g++ < 30) { const q = colQ(); if (!qs.some(x => x.a === q.a)) qs.push(q); } return qs; })(), secreto: sec(R) },
        { titulo: 'Las formas del fantasma', icono: 'ghost', instr: 'Escucha y toca la forma o el tamaño.', pista: 'El círculo es redondo como la luna llena.', preguntas: [formQ(), sizeQ()], secreto: sec(R) },
        { titulo: 'El bosque de las series', icono: 'bat', instr: 'Mira los dibujos con atención.', pista: 'Di los dibujos en voz alta: calabaza, fantasma, calabaza…', preguntas: [serieQ(), raroQ()], secreto: sec(R) },
        { titulo: 'La luna parlanchina', icono: 'moon', instr: 'Escucha y toca la respuesta.', pista: 'Escucha otra vez pulsando el altavoz 🔊.', preguntas: p3.map(f => f()).filter((q, k, a) => k === 0 || q.q !== a[0].q), secreto: sec(R) }
      ];
    }
  };
}
ESCAPES.push(infantil(3), infantil(4), infantil(5));

/* Cada partida 1-50 tiene un código DISTINTO (si dos coinciden, se busca otra variante) */
const _semillas = {};
function semillaReal(E, seed) {
  if (!_semillas[E.id]) {
    const usados = new Set(), map = [];
    for (let s = 1; s <= PARTIDAS; s++) {
      let k = s, c;
      do { c = E.build(mkRng(k, E.id)).map(r => r.secreto.a).join(''); if (k > 50000) break; if (usados.has(c)) k += 1000; else break; } while (true);
      usados.add(c); map[s] = k;
    }
    _semillas[E.id] = map;
  }
  return _semillas[E.id][seed] || seed;
}
function buildRetos(E, seed) { return E.build(mkRng(semillaReal(E, seed), E.id)); }
function codigo(E, seed) { return buildRetos(E, seed).map(r => r.secreto.a).join(''); }
const cicloTxt = e => e.ciclo === 'inf' ? `Infantil ${e.edad} años` : e.ciclo.replace('-', '.º y ') + '.º';
