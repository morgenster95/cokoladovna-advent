import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ArrowRight, ArrowUpRight, Eye, Gift, Music, Share2, Sparkles, Volume2, VolumeX, LogIn, Heart, Leaf, Store, HandHeart } from 'lucide-react';
import { availableDay, BASE, CONTEST_DAYS, doors as ALL_DOORS } from './content';
import { CONTENT_MODE, PREVIEW_KEY } from './config';
import { backend } from './backend';
import type { Door, Progress, User } from './types';
import { ChocolateBar } from './components/ChocolateBar';
import { DoorModal } from './components/DoorModal';
import { LoginDialog } from './components/LoginDialog';
import { GiftsDrawer } from './components/GiftsDrawer';
import { Celebrate, ChocoDrip, CocoaBean, Garland, Pine, Snow } from './components/Decor';

const F = BASE + 'assets/foto/';
const SHOP = 'https://www.cokoladovnatroubelice.cz/';
const EVE = Date.parse('2026-12-24T00:00:00+01:00');
const draft = CONTENT_MODE !== 'live';
const SS = 'ctrb-';

function readPreview(): boolean {
  try {
    const url = new URL(location.href);
    const q = url.searchParams.get('nahled');
    if (q !== null) {
      if (q === PREVIEW_KEY) sessionStorage.setItem(SS + 'nahled', '1');
      else sessionStorage.removeItem(SS + 'nahled');
      url.searchParams.delete('nahled');
      history.replaceState(null, '', url);
    }
    return sessionStorage.getItem(SS + 'nahled') === '1';
  } catch { return false; }
}

function useCountdown() {
  const calc = () => {
    const s = Math.max(0, Math.floor((EVE - Date.now()) / 1000));
    return [Math.floor(s / 86400), Math.floor(s / 3600) % 24, Math.floor(s / 60) % 60, s % 60];
  };
  const [v, setV] = useState(calc);
  useEffect(() => { const id = setInterval(() => setV(calc()), 1000); return () => clearInterval(id); }, []);
  return v;
}

const plural = (n: number, one: string, few: string, many: string) => (n === 1 ? one : n >= 2 && n <= 4 ? few : many);

export default function App() {
  const [preview, setPreview] = useState(readPreview);
  const [today, setToday] = useState(() => availableDay());
  const max = preview ? 24 : today;
  const [user, setUser] = useState<User | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [progress, setProgress] = useState<Progress>({ opened: {}, entries: [], newsletter: false });
  const [modalDay, setModalDay] = useState<number | null>(null);
  const [opening, setOpening] = useState<number | null>(null);
  const [login, setLogin] = useState<{ open: boolean; reason?: string; pendingDay?: number }>({ open: false });
  const [drawer, setDrawer] = useState(false);
  const [toast, setToast] = useState('');
  const [burst, setBurst] = useState(0);
  const [sound, setSound] = useState(false);
  const [gate, setGate] = useState(() => { try { return sessionStorage.getItem(SS + 'gate') !== '1'; } catch { return true; } });
  const audio = useRef<HTMLAudioElement | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout>>();
  const trigger = useRef<HTMLElement | null>(null);
  const countdown = useCountdown();

  const notify = useCallback((s: string) => {
    setToast(s);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(''), 4200);
  }, []);

  useEffect(() => {
    let off: (() => void) | undefined;
    backend.completeEmailLink().then((ok) => ok && notify('Jste přihlášeni. Sladký advent!')).catch((e) => notify((e as Error).message));
    backend.watch((u) => { setUser(u); setAuthReady(true); }).then((f) => { off = f; });
    return () => off?.();
  }, [notify]);

  useEffect(() => {
    if (!user) { setProgress({ opened: {}, entries: [], newsletter: false }); return; }
    backend.load(user, preview).then(setProgress).catch(() => notify('Nepodařilo se načíst vaše kostičky. Zkuste obnovit stránku.'));
  }, [user, preview, notify]);

  useEffect(() => { const id = setInterval(() => setToday(availableDay()), 30000); return () => clearInterval(id); }, []);

  const openedMap = useMemo(() => {
    const m = new Map<number, Door['type']>();
    for (const d of Object.keys(progress.opened).map(Number)) if (d <= max) m.set(d, ALL_DOORS[d - 1]?.type);
    return m;
  }, [progress.opened, max]);
  const openedDoors = useMemo(() => ALL_DOORS.filter((d) => openedMap.has(d.day)), [openedMap]);

  async function music(on: boolean) {
    if (!audio.current) {
      audio.current = new Audio(BASE + 'audio/vanoce.mp3');
      audio.current.loop = true;
      audio.current.volume = 0.38;
    }
    if (on) {
      try { await audio.current.play(); setSound(true); } catch { setSound(false); }
    } else { audio.current.pause(); setSound(false); }
  }
  useEffect(() => {
    const vis = () => { if (!audio.current) return; if (document.hidden) audio.current.pause(); else if (sound) audio.current.play().catch(() => {}); };
    document.addEventListener('visibilitychange', vis);
    return () => document.removeEventListener('visibilitychange', vis);
  }, [sound]);

  function enter(withMusic: boolean) {
    setGate(false);
    try { sessionStorage.setItem(SS + 'gate', '1'); } catch { /* */ }
    if (withMusic) void music(true);
  }

  const openDoor = useCallback(async (day: number, el?: HTMLElement) => {
    if (el) trigger.current = el;
    if (day > max) {
      notify(`Kostička ${day} se odemkne ${day}. prosince. Dobrá čokoláda se nespěchá.`);
      return;
    }
    if (!user) { setLogin({ open: true, reason: 'Přihlaste se a odlomte kostičku', pendingDay: day }); return; }
    const already = !!progress.opened[day];
    if (!already) {
      setOpening(day);
      await new Promise((r) => setTimeout(r, matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 800));
      setOpening(null);
      setProgress((p) => ({ ...p, opened: { ...p.opened, [day]: new Date().toISOString() } }));
      backend.markOpened(user, day, preview).catch(() => notify('Kostičku se nepodařilo uložit k účtu. Zkuste to prosím znovu.'));
      setBurst((b) => b + 1);
    }
    setModalDay(day);
    const url = new URL(location.href); url.searchParams.set('den', String(day)); history.replaceState(null, '', url);
  }, [max, user, progress.opened, preview, notify]);

  useEffect(() => {
    if (user && login.pendingDay && !login.open) { const d = login.pendingDay; setLogin({ open: false }); void openDoor(d); }
  }, [user, login, openDoor]);

  const deepLinked = useRef(false);
  useEffect(() => {
    if (deepLinked.current || !authReady || gate) return;
    const n = Number(new URLSearchParams(location.search).get('den'));
    if (n >= 1 && n <= 24) { deepLinked.current = true; void openDoor(n); }
  }, [authReady, gate, openDoor]);

  function closeModal() {
    setModalDay(null);
    const url = new URL(location.href); url.searchParams.delete('den'); history.replaceState(null, '', url);
    trigger.current?.focus();
  }

  async function share() {
    const url = new URL(location.origin + BASE);
    if (modalDay) url.searchParams.set('den', String(modalDay));
    try {
      if (navigator.share) { await navigator.share({ title: 'Čokoládový advent z Troubelic', text: '24 kostiček čokoládových překvapení až do Štědrého dne 🍫', url: url.href }); return; }
      await navigator.clipboard.writeText(url.href);
      notify('Odkaz je zkopírovaný. Podělte se o kousek čokolády.');
    } catch (e) { if ((e as Error).name !== 'AbortError') notify('Sdílení se nepodařilo. Odkaz zkopírujte z adresního řádku.'); }
  }
  async function copy(code: string) {
    try { await navigator.clipboard.writeText(code); notify(`Kód ${code} je zkopírovaný.`); }
    catch { notify('Kód prosím označte a zkopírujte ručně.'); }
  }
  async function logout() {
    await backend.signOut(); setDrawer(false); notify('Byli jste odhlášeni. Zítra na vás čeká další kostička!');
  }

  useEffect(() => { document.body.style.overflow = gate ? 'hidden' : ''; }, [gate]);

  const door = modalDay ? ALL_DOORS[modalDay - 1] : null;
  const openedCount = openedMap.size;
  const status = preview ? 'Režim náhledu – všechny kostičky jsou odemčené'
    : max === 0 ? 'První kostičku odlomíme 1. prosince o půlnoci'
    : max >= 24 ? 'Celá tabulka je odemčená. Veselé Vánoce!'
    : openedMap.has(max) ? `Dnešní kostičku máte odlomenou. Zítra čeká ${max + 1}.`
    : `Dnes na vás čeká kostička číslo ${max}`;

  return (
    <>
      {preview && (
        <div className="preview-bar">
          <Eye size={15} /> Náhled: všechny kostičky odemčené{draft ? ' · obsah je ukázkový' : ''}
          <button onClick={() => { try { sessionStorage.removeItem(SS + 'nahled'); } catch { /* */ } setPreview(false); }}>Ukončit</button>
        </div>
      )}

      {/* ------------------------------------------------------------- HERO */}
      <div className="night">
        <Snow />
        <Garland />
        <img className="pods" src={F + 'stred.webp'} alt="" aria-hidden="true" />
        <header className="topbar wrap">
          <a href={SHOP} className="brand" target="_blank" rel="noreferrer" aria-label="Čokoládovna Troubelice – e-shop">
            <img src={F + 'logo.webp'} alt="Čokoládovna Troubelice" />
          </a>
          <nav aria-label="Ovládání">
            <button className="chip" onClick={() => music(!sound)} aria-pressed={sound} aria-label={sound ? 'Vypnout hudbu' : 'Zapnout hudbu'}>
              {sound ? <Volume2 size={17} /> : <VolumeX size={17} />}<span className="hide-sm">{sound ? 'Hudba hraje' : 'Hudba'}</span>
            </button>
            <button className="chip hide-xs" onClick={share} aria-label="Sdílet kalendář"><Share2 size={16} /></button>
            {user ? (
              <button className="chip gold" onClick={() => setDrawer(true)}>
                <Gift size={16} /><span>Moje dárky</span>{openedCount > 0 && <b className="badge">{openedCount}</b>}
              </button>
            ) : (
              <button className="chip gold" onClick={() => setLogin({ open: true })}><LogIn size={16} /><span>Přihlásit</span></button>
            )}
          </nav>
        </header>

        <section className="hero wrap">
          <div className="hero-copy">
            <div className="eyebrow light"><span className="line" /> Adventní kalendář 2026</div>
            <h1>Advent, který<br /><em className="script">chutná po čokoládě</em></h1>
            <p>24 dní, 24 kostiček z naší rodinné čokoládovny v Troubelicích. Každý den o půlnoci se odemkne jedna – a za ní recept, tip na dárek, příběh z Ekvádoru nebo sleva do e-shopu.</p>
            <div className="hero-cta">
              <a href="#kalendar" className="btn primary big">{user ? 'Ke kalendáři' : 'Vstoupit do kalendáře'} <ArrowRight size={18} /></a>
              {!user && <button className="btn ghost" onClick={() => setLogin({ open: true })}><LogIn size={17} /> Přihlásit se</button>}
            </div>
            <div className="hero-note"><Heart size={14} /> Poctivě, ručně a s láskou z Troubelic</div>
          </div>
          <div className="hero-art" aria-hidden="true">
            <div className="frame"><img src={F + 'kat_kakaove.webp'} alt="" /></div>
            <div className="polaroid p1"><img src={F + 'rodina.webp'} alt="" /><span>naše rodina</span></div>
            <div className="polaroid p2"><img src={F + 'ig_tasky.webp'} alt="" /><span>s láskou balíme</span></div>
            <img className="bar-img" src={F + 'x_koreni.webp'} alt="" />
            <div className="seal"><span>sladké čekání</span><strong>24</strong><span>kostiček</span></div>
            <CocoaBean className="float b1" />
            <CocoaBean className="float b2" />
            <CocoaBean className="float b3" />
          </div>
        </section>

        <section className="countdown wrap" aria-label="Odpočet do Štědrého dne">
          <div className="cd-label">Do Štědrého večera<br /><b className="script">zbývá</b></div>
          <div className="cd-time">
            {countdown.map((v, i) => (
              <div key={i}><strong>{String(v).padStart(2, '0')}</strong><span>{[plural(v, 'den', 'dny', 'dní'), plural(v, 'hodina', 'hodiny', 'hodin'), plural(v, 'minuta', 'minuty', 'minut'), plural(v, 'sekunda', 'sekundy', 'sekund')][i]}</span></div>
            ))}
          </div>
          <div className="cd-note"><Sparkles size={18} /> Nejlepší kostička je ta, na kterou se těšíte.</div>
        </section>
      </div>
      <ChocoDrip />

      {/* --------------------------------------------------------- CALENDAR */}
      <main>
        <section id="kalendar" className="calendar wrap">
          <div className="cal-head">
            <div>
              <div className="eyebrow">Každý den jedna kostička</div>
              <h2>Adventní tabulka <em className="script">plná překvapení</em></h2>
            </div>
            <p>Hořká, mléčná, bílá, s ořechy i ovocem – za každou kostičkou se skrývá recept, tip na dárek, příběh z čokoládovny nebo sleva. Vše, co odlomíte, si pamatujeme u vašeho účtu.</p>
          </div>
          <div className="cal-bar">
            <div className="progress">
              <span>{user ? <><b>{openedCount}</b> z 24 kostiček odlomeno</> : 'Přihlaste se a začněte odlamovat'}</span>
              <div className="track"><i style={{ width: `${(openedCount / 24) * 100}%` }} /></div>
            </div>
            <span className="status">{status}</span>
          </div>

          <ChocolateBar max={max} opened={openedMap} opening={opening} onOpen={openDoor} />

          <div className="cal-foot">
            {user ? (
              <span>Přihlášeni jako <b>{user.email}</b> · <button className="link" onClick={() => setDrawer(true)}>Moje dárky</button></span>
            ) : (
              <button className="btn primary" onClick={() => setLogin({ open: true })}><LogIn size={17} /> Přihlásit se a začít</button>
            )}
          </div>
        </section>

        {/* ----------------------------------------------------- STORY */}
        <section className="story wrap">
          <div className="story-photos" aria-hidden="true">
            <img className="sp1" src={F + 'rodina.webp'} alt="" loading="lazy" />
            <img className="sp2" src={F + 'kat_cokolady.webp'} alt="" loading="lazy" />
            <img className="sp3" src={F + 'kat_obaleno.webp'} alt="" loading="lazy" />
          </div>
          <div className="story-copy">
            <div className="eyebrow">Malá rodinná čokoládovna z Moravy</div>
            <h2>Od kakaového bobu <em className="script">až pod stromeček</em></h2>
            <p>Kakaové boby si vozíme z Ekvádoru, kde je táta vybírá přímo na plantážích. Na bývalém statku v Troubelicích z nich ručně vyrábíme čokoládu – jen z kakaa, kakaového másla a panely, bez bílého cukru, lecitinu a přídavných látek. První tabulka spatřila svět v roce 2013.</p>
            <ul className="perks">
              <li><HandHeart size={18} /> Ruční výroba</li>
              <li><Heart size={18} /> Rodinná firma</li>
              <li><Leaf size={18} /> Bez lepku</li>
              <li><Store size={18} /> Kamenná prodejna</li>
            </ul>
            <a className="text-link" href={SHOP + 'o-nas/'} target="_blank" rel="noreferrer">Náš čokoládový příběh <ArrowUpRight size={16} /></a>
          </div>
        </section>

        {/* ------------------------------------------------------ GIFTS */}
        <section className="gifts">
          <div className="wrap">
            <div className="gifts-head">
              <div>
                <div className="eyebrow">Pod stromeček od srdce</div>
                <h2>Darujte kousek <em className="script">poctivé čokolády</em></h2>
              </div>
              <a className="text-link" href={SHOP + 'mikulas--vanoce/'} target="_blank" rel="noreferrer">Vánoční čokolády <ArrowUpRight size={16} /></a>
            </div>
            <div className="products">
              {[
                { img: F + 'x_tonka.webp', tag: 'Mléčná 51 % · 45 g', name: 'Vánoční čokoláda s tonkovými boby', url: SHOP + 'mikulas--vanoce/' },
                { img: F + 'x_zlatemleko.webp', tag: 'Bílá 40 % · 45 g', name: 'Vánoční čokoláda Zlaté mléko', url: SHOP + 'mikulas--vanoce/' },
                { img: F + 'x_kazeta.webp', tag: 'Dřevěná kazeta', name: 'Kazeta Krásné Vánoce', url: SHOP + 'drevene-kazety-s-cokoladou/' },
                { img: F + 'x_tepla.webp', tag: 'Na zimní večery', name: 'Vánoční teplá čokoláda', url: SHOP + 'tepla-cokolada/' },
              ].map((p) => (
                <a className="product" href={p.url} target="_blank" rel="noreferrer" key={p.name}>
                  <div className="product-img"><img src={p.img} alt={p.name} loading="lazy" /></div>
                  <span>{p.tag}</span>
                  <h3>{p.name} <ArrowUpRight size={16} /></h3>
                </a>
              ))}
            </div>
          </div>
        </section>

        <section className="closing">
          <img className="closing-pods" src={F + 'stred.webp'} alt="" aria-hidden="true" />
          <h2>Ať jsou ty nejhezčí chvíle <em className="script">sladké.</em></h2>
          <p>Krásný advent přeje rodina z Čokoládovny Troubelice.</p>
          <img className="portraits" src={F + 'portrety.webp'} alt="Tým Čokoládovny Troubelice" loading="lazy" />
        </section>
      </main>

      <footer className="footer">
        <div className="wrap">
          <img src={F + 'logo_white.webp'} alt="Čokoládovna Troubelice" />
          <div className="footer-links">
            <a href={SHOP} target="_blank" rel="noreferrer">E-shop ↗</a>
            <a href={SHOP + 'kamenne-prodejny/'} target="_blank" rel="noreferrer">Kde koupit ↗</a>
            <a href="https://www.instagram.com/cokoladovnatroubelice/" target="_blank" rel="noreferrer">Instagram ↗</a>
            <a href="https://www.facebook.com/cokoladovnatroubelice/" target="_blank" rel="noreferrer">Facebook ↗</a>
          </div>
          <div id="soukromi" className="privacy">
            <h3>Soukromí</h3>
            <p>Pro přihlášení používáme službu Firebase (Google). Ukládáme váš e-mail, případně jméno z účtu Google, které kostičky jste odlomili, soutěžní odpovědi a to, zda chcete dostávat novinky. Údaje slouží jen k provozu adventního kalendáře, vyhodnocení soutěží a – pokud jste o to požádali – k zasílání novinek. Podrobnosti najdete v <a href={SHOP + 'podminky-ochrany-osobnich-udaju/'} target="_blank" rel="noreferrer">podmínkách ochrany osobních údajů</a>.</p>
          </div>
          <small>© 2026 Čokoládovna Troubelice · Kostičky se odemykají o půlnoci (Europe/Prague) · Hudba: vlastní aranžmá tradičních koled</small>
        </div>
      </footer>

      {gate && (
        <div className="gate" role="dialog" aria-modal="true" aria-labelledby="gate-title">
          <Snow count={90} />
          <div className="gate-card">
            <img className="gate-logo" src={F + 'logo.webp'} alt="Čokoládovna Troubelice" />
            <div className="gate-bar" aria-hidden="true">{Array.from({ length: 6 }, (_, i) => <i key={i} />)}</div>
            <div className="eyebrow light center">Jedna kostička. Každý den.</div>
            <h2 id="gate-title">Vítejte v našem<br /><em className="script">čokoládovém adventu</em></h2>
            <p>Uvařte si horkou čokoládu a nechte se hýčkat.</p>
            <button className="btn primary big" onClick={() => enter(true)} autoFocus><Music size={18} /> Vstoupit s vánoční hudbou</button>
            <button className="btn link light" onClick={() => enter(false)}>Vstoupit bez hudby</button>
          </div>
        </div>
      )}

      <DoorModal
        door={door}
        draft={draft}
        entered={!!door && progress.entries.includes(door.day)}
        canPrev={!!door && door.day > 1}
        canNext={!!door && door.day < max}
        onPrev={() => door && openDoor(door.day - 1)}
        onNext={() => door && openDoor(door.day + 1)}
        onClose={closeModal}
        onShare={share}
        onCopy={copy}
        onEnter={async (day, answer) => {
          if (!user) throw new Error('Nejste přihlášeni.');
          if (!CONTEST_DAYS.includes(day)) throw new Error('Soutěž v této kostičce neprobíhá.');
          const a = answer.trim();
          if (a.length < 3) throw new Error('Odpověď prosím napište alespoň třemi znaky.');
          await backend.submitEntry(user, day, a, preview);
          setProgress((p) => ({ ...p, entries: [...p.entries, day] }));
          setBurst((b) => b + 1);
        }}
      />
      <LoginDialog
        open={login.open}
        reason={login.reason}
        onClose={() => setLogin({ open: false })}
        onSignedIn={() => { setLogin((l) => ({ ...l, open: false })); notify('Jste přihlášeni. Sladký advent!'); }}
      />
      <GiftsDrawer
        open={drawer}
        user={user}
        newsletter={progress.newsletter}
        doors={openedDoors}
        onClose={() => setDrawer(false)}
        onPick={(d) => { setDrawer(false); void openDoor(d); }}
        onCopy={copy}
        onLogout={logout}
        onNewsletter={(v) => { if (!user) return; setProgress((p) => ({ ...p, newsletter: v })); backend.setNewsletter(user, v).catch(() => notify('Nastavení se nepodařilo uložit.')); }}
      />
      <Celebrate burst={burst} />
      {toast && <div className="toast" role="status">{toast}</div>}
    </>
  );
}
