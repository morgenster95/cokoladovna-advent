/**
 * NASTAVENÍ WEBU
 *
 * 1) Firebase – zkopírujte z Firebase Console → Project settings → Your apps → Web app.
 *    Tyto hodnoty nejsou tajné (jsou vidět v každém webu, který Firebase používá).
 *    Dokud je apiKey prázdný, web běží v UKÁZKOVÉM režimu (přihlášení jen e-mailem, data jen v prohlížeči).
 */
export const FIREBASE = {
  apiKey: 'AIzaSyAwgmsw8dVK-D8y3W7Uck9Dc64FkAQEbN4',
  authDomain: 'cokoladovna-aaba2.firebaseapp.com',
  projectId: 'cokoladovna-aaba2',
  storageBucket: 'cokoladovna-aaba2.firebasestorage.app',
  messagingSenderId: '618667089264',
  appId: '1:618667089264:web:745d90740617b6af4203b5',
};

/** 'draft' = u kupónů a soutěží se ukazuje upozornění „ukázkový obsah“. Před spuštěním přepněte na 'live'. */
export const CONTENT_MODE: 'draft' | 'live' = 'draft';

/**
 * Klíč pro náhled všech okének před 1. prosincem: otevřete web s ?nahled=KLÍČ
 * (vypnutí: ?nahled=off). Kalendář je statický, takže nejde o zabezpečení – jen o pohodlné testování.
 */
export const PREVIEW_KEY = 'cokoladovyadvent';

export const firebaseEnabled = () => !!FIREBASE.apiKey && !!FIREBASE.projectId;
