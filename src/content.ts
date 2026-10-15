import type { Door } from './types';

/**
 * OBSAH KALENDÁŘE – všech 24 kostiček.
 * Kostička se odemyká o půlnoci českého času (Europe/Prague).
 *
 * Než kalendář pustíte ven:
 *  - kupony (code) založte v Shoptetu se stejným kódem a doplňte podmínky do codeNote,
 *  - u soutěží (type: 'contest') doplňte výhry a pravidla,
 *  - v src/config.ts přepněte CONTENT_MODE na 'live'.
 */
export const YEAR = 2026;

export const BASE = import.meta.env.BASE_URL;
const F = BASE + 'assets/foto/';
const SHOP = 'https://www.cokoladovnatroubelice.cz/';
const XMAS = SHOP + 'mikulas--vanoce/';

export const CONTEST_DAYS = [5, 12, 19];

export const doors: Door[] = [
  {
    day: 1, type: 'tip', title: 'Vítejte v čokoládovém adventu',
    text: 'Odlomte si první kostičku. Až do Štědrého dne vás tu každý den čeká malé čokoládové překvapení – recept, tip, příběh z naší čokoládovny nebo sleva.',
    image: F + 'kat_cokolady.webp',
    more: 'Vše, co odlomíte, se ukládá k vašemu účtu – recepty, tipy i slevové kódy najdete kdykoli v sekci „Moje dárky“. Další kostička se odemyká vždy o půlnoci.',
  },
  {
    day: 2, type: 'recipe', title: 'Poctivá horká čokoláda',
    text: 'Žádný prášek z pytlíku. Jen mléko, kousky pravé čokolády a chvilka trpělivosti.',
    image: F + 'x_tepla.webp', product: true,
    more: 'Na 2 hrnky: 400 ml plnotučného mléka, 80 g hořké čokolády (65–75 %), špetka skořice a soli.\n\nMléko zahřejte, ale nevařte. Stáhněte z plotny, přidejte nalámanou čokoládu a míchejte, dokud se úplně nerozpustí. Vraťte na mírný oheň a za stálého míchání nechte 2–3 minuty zhoustnout. Dochuťte skořicí a špetkou soli – zvýrazní chuť kakaa.',
  },
  {
    day: 3, type: 'gift', title: 'Vánoční čokoláda s tonkovými boby',
    text: 'Mléčná čokoláda s tonkovými boby voní vanilkou, mandlemi a trochou kouzla. Malý dárek, který se vejde do každé punčochy.',
    image: F + 'x_tonka.webp', product: true,
    url: XMAS, urlLabel: 'Vánoční čokolády v e-shopu',
  },
  {
    day: 4, type: 'tip', title: 'Čokoláda má ráda chlad, ne lednici',
    text: 'Ideální teplota pro čokoládu je 16–18 °C, v suchu a mimo pachy. V lednici na ní může vykvést bílý povlak.',
    image: F + 'kat_cokolady.webp',
    more: 'Bílý povlak (tzv. květ) není plíseň. Vzniká, když na povrch vystoupí kakaové máslo nebo cukr. Čokoláda je dál v pořádku – jen ztratí lesk. Nejlépe chutná, když ji necháte chvilku povolit při pokojové teplotě.',
  },
  {
    day: 5, type: 'contest', title: 'Mikulášská čokoládová nadílka',
    text: 'Jakou čokoládu byste letos dali do mikulášského balíčku? Napište nám – vylosujeme výherce čokoládové nadílky.',
    image: F + 'x_cert.webp', product: true,
  },
  {
    day: 6, type: 'recipe', title: 'Čokoládový salám od babičky',
    text: 'Nepečená klasika z dětství, která na vánočním talíři nesmí chybět.',
    image: F + 'kat_obaleno.webp',
    more: 'Rozpusťte 100 g másla se 100 g hořké čokolády. Vmíchejte 2 lžíce kakaa, 50 g moučkového cukru a 200 g nadrobno nalámaných sušenek. Přidejte hrst sekaných ořechů nebo sušeného ovoce.\n\nHmotu zabalte do potravinové fólie, vytvarujte váleček a nechte přes noc ztuhnout v lednici. Krájejte na kolečka a obalte v moučkovém cukru.',
  },
  {
    day: 7, type: 'discount', title: 'Sladší vánoční nákup',
    text: 'Dnes pro vás máme slevový kód do e-shopu. Ideální chvíle pořídit čokoládové dárky pro celou rodinu.',
    image: F + 'x_bedynka.webp',
    code: 'ADVENT7', codeNote: 'Výše slevy a platnost kódu budou doplněny.',
    url: SHOP + 'e-shop/', urlLabel: 'Nakoupit v e-shopu',
  },
  {
    day: 8, type: 'story', title: 'Kakao z Ekvádoru',
    text: 'Pro naši čokoládu jsme si vybrali ekvádorské kakaové boby – patří k nejkvalitnějším na světě pro své výjimečné aroma. Ekvádor je i naším druhým domovem.',
    image: F + 'kat_kakaove.webp',
    more: 'Táta tam žije téměř 40 let a boby vybírá přímo na plantážích. Kakao pochází z oblastí jako Esmeraldas, Manabí, Los Ríos nebo Guayas. Osobně dohlížíme na sklizeň, nákup, nakládku v Ekvádoru i vykládku v Česku.',
  },
  {
    day: 9, type: 'recipe', title: 'Perníčky v čokoládové polevě',
    text: 'Když se perníček potká s pravou čokoládou, nikdo neodolá.',
    image: F + 'x_krasnevanoce.webp', product: true,
    more: 'Upečte své oblíbené perníčky a nechte je úplně vychladnout. Nad vodní lázní rozpusťte 150 g hořké nebo mléčné čokolády s lžičkou kakaového másla (nebo kokosového tuku) pro hezký lesk.\n\nPerníčky do poloviny namáčejte, nechte okapat a položte na pečicí papír. Než poleva zaschne, můžete posypat drcenými ořechy, kokosem nebo sušeným ovocem.',
  },
  {
    day: 10, type: 'gift', title: 'Vánoční hořká s kořením',
    text: 'Hořká čokoláda 65 % s vánočním kořením. Dárek pro milovníky výrazných chutí.',
    image: F + 'x_koreni.webp', product: true,
    url: XMAS, urlLabel: 'Vánoční čokolády v e-shopu',
  },
  {
    day: 11, type: 'story', title: 'Sladíme panelou',
    text: 'Bílý cukr do naší čokolády nepatří. Sladíme ji panelou – ztuhlou šťávou z cukrové třtiny. Nápad sladit čokoládu panelou vznikl právě u nás v čokoládovně.',
    image: F + 'kat_cokolady.webp',
    more: 'K výrobě používáme jen kakaové boby, kakaové máslo a panelu. Do bílých a mléčných čokolád přidáváme sušené mléko. Žádné jiné rostlinné tuky, žádné přídavné látky, žádný lecitin.',
  },
  {
    day: 12, type: 'contest', title: 'Vaše nejmilejší vánoční tradice',
    text: 'Která rodinná vánoční tradice je pro vás ta nejmilejší? Podělte se s námi – nejhezčí odpovědi odměníme čokoládou.',
    image: F + 'x_var22.webp', product: true,
  },
  {
    day: 13, type: 'recipe', title: 'Kandovaná pomerančová kůra v čokoládě',
    text: 'Voňavá vánoční pochoutka i krásný domácí dárek.',
    image: F + 'kat_obaleno.webp',
    more: 'Kůru ze 3 pomerančů nakrájejte na proužky a 3× spařte vroucí vodou. Povařte ji 45 minut v sirupu z 200 g cukru a 200 ml vody, pak nechte přes noc oschnout na mřížce.\n\nProužky do poloviny namáčejte v rozpuštěné hořké čokoládě a nechte ztuhnout na pečicím papíře. Skladujte v chladu v uzavřené dóze.',
  },
  {
    day: 14, type: 'discount', title: 'Čokoládová radost pro vaše blízké',
    text: 'Druhý adventní slevový kód. Tabulky, dřevěné kazety i dárkové bedýnky – vyberte si.',
    image: F + 'x_degust.webp',
    code: 'ADVENT14', codeNote: 'Výše slevy a platnost kódu budou doplněny.',
    url: SHOP + 'e-shop/', urlLabel: 'Nakoupit v e-shopu',
  },
  {
    day: 15, type: 'tip', title: 'Jak ochutnávat čokoládu',
    text: 'Pomalu. Nechte kostičku chvíli rozpouštět na jazyku a sledujte, jak se chuť mění – od kakaa přes ovoce až po jemnou hořkost.',
    image: F + 'x_degust.webp',
    more: 'Začněte od nejsvětlejší čokolády k nejtmavší. Mezi vzorky se napijte vody. Že je čokoláda kvalitní, poznáte i podle zvuku: pravá tabulka se láme s čistým „cvaknutím“.',
  },
  {
    day: 16, type: 'gift', title: 'Dřevěná kazeta Krásné Vánoce',
    text: 'Čokoláda v dřevěné kazetě s vánočním motivem. Dárek, který potěší dvakrát – chutí i krabičkou, která zůstane.',
    image: F + 'x_kazeta.webp', product: true,
    url: SHOP + 'drevene-kazety-s-cokoladou/', urlLabel: 'Dřevěné kazety v e-shopu',
  },
  {
    day: 17, type: 'recipe', title: 'Čokoládové lanýže',
    text: 'Tři suroviny, pár minut práce a pocit jako z cukrárny.',
    image: F + 'x_slast.webp', product: true,
    more: '200 g hořké čokolády nalámejte do misky. Zahřejte 100 ml smetany ke šlehání do bodu varu a zalijte jí čokoládu. Nechte 2 minuty stát a pak hladce promíchejte. Vmíchejte lžíci másla.\n\nGanache nechte v lednici ztuhnout (asi 3 hodiny), lžičkou tvořte kuličky a obalte v kakau, kokosu nebo drcených oříšcích.',
  },
  {
    day: 18, type: 'story', title: 'Čokoládovna na statku',
    text: 'Naše výrobna sídlí v Troubelicích na Moravě, v areálu bývalého statku. Z hospodářské budovy je dnes výrobna čokolády, balírna a sklad.',
    image: F + 'rodina.webp',
    more: 'Při rekonstrukci jsme chtěli zachovat původní ráz celého statku v souladu s okolím. Myšlenka na vlastní čokoládu se zrodila už v roce 2002, první kakaové boby jsme dovezli v roce 2010 a první tabulka spatřila světlo světa v roce 2013.',
  },
  {
    day: 19, type: 'contest', title: 'Vánoce chutnají po…',
    text: 'Doplňte větu: „Naše Vánoce chutnají po…“ Nejkrásnější odpověď odměníme čokoládovým dárkem.',
    image: F + 'x_degust.webp',
  },
  {
    day: 20, type: 'recipe', title: 'Čokoládové fondue na Štěpána',
    text: 'Společný hrnec plný čokolády a kousky ovoce. Nejlepší recept na sváteční odpoledne.',
    image: F + 'x_banany.webp', product: true,
    more: 'V hrnci na mírném ohni rozpusťte 200 g mléčné nebo hořké čokolády se 150 ml smetany. Přelijte do fondue hrnce nebo misky nad čajovou svíčkou.\n\nNamáčejte kousky banánu, jahod, mandarinek, hrušek, sušeného ovoce nebo vánočky.',
  },
  {
    day: 21, type: 'discount', title: 'Poslední adventní překvapení',
    text: 'Třetí a poslední slevový kód. Pozor na termíny doručení před Vánoci – a když to nestihnete, zastavte se u nás v prodejně v Troubelicích.',
    image: F + 'x_bedynka.webp',
    code: 'ADVENT21', codeNote: 'Výše slevy, platnost a termíny doručení budou doplněny.',
    url: SHOP + 'e-shop/', urlLabel: 'Nakoupit v e-shopu',
  },
  {
    day: 22, type: 'gift', title: 'Bílá čokoláda Zlaté mléko',
    text: 'Vánoční bílá čokoláda inspirovaná „zlatým mlékem“. Hřejivá, krémová a trochu neobvyklá.',
    image: F + 'x_zlatemleko.webp', product: true,
    url: XMAS, urlLabel: 'Vánoční čokolády v e-shopu',
  },
  {
    day: 23, type: 'tip', title: 'Už nemusí být všechno hotové',
    text: 'Cukroví může být trochu křivé. Mašle nemusí být dokonalá. Nejdůležitější je, s kým Vánoce prožijete.',
    image: F + 'ig_tasky.webp',
    more: 'Dnes si dopřejte deset minut jen pro sebe. Uvařte si horkou čokoládu, zapalte svíčku a pusťte si oblíbenou koledu.',
  },
  {
    day: 24, type: 'gift', title: 'Krásné a sladké Vánoce',
    text: 'Děkujeme, že jste s námi strávili advent. Přejeme vám domov plný pohody, blízkých lidí a kostiček té nejlepší čokolády.',
    image: F + 'rodina.webp',
    more: 'Ať jsou ty nejhezčí chvíle sladké. Krásné Vánoce a šťastný nový rok přeje celá rodina z Čokoládovny Troubelice.',
  },
];

/** Den, který je dnes nejvýše dostupný (časové pásmo Europe/Prague). */
export function availableDay(now = new Date()): number {
  const parts = new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Prague', year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(now);
  const get = (n: string) => Number(parts.find((x) => x.type === n)?.value);
  const y = get('year'), m = get('month'), d = get('day');
  if (y < YEAR || (y === YEAR && m < 12)) return 0;
  if (y > YEAR) return 24;
  return Math.min(24, d);
}
