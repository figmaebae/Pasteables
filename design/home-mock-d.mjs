// Visual mock D: a full marketing-style website homepage for Pasteables. Not wired into the app.
// run: node design/home-mock-d.mjs
import fs from "node:fs";
import { plain } from "../scripts/mushroom/mushroom.mjs";
const hero = JSON.parse(fs.readFileSync("data/hero.json", "utf8"));
const H = Object.fromEntries(hero.map((h) => [h.id, h]));
const strip = (svg) => svg.replace(/ width="\d+" height="\d+"/, "");
const art = (id) => strip(H[id].svg);
const total = hero.reduce((a, h) => a + +h.count.replace("#", ""), 0);
const mush = JSON.parse(fs.readFileSync("data/gallery-mushroom.json", "utf8")).sections.flatMap((s) => s.tiles);
const tile = (name) => strip(plain(mush.find((t) => t.name === name).svg));
const arrow = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
const pack = (h) => `<a class="pack" href="#${h.id}" style="--c:${h.color}"><div class="pv"><div class="pa">${strip(h.svg)}</div></div><div class="pm"><div><b>${h.name}</b><span>${h.count.replace("#", "")} stickers</span></div><i>${arrow}</i></div></a>`;
const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Pasteables — website homepage design</title>
<link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@600;700;800&family=DM+Sans:wght@400;500;700&display=swap" rel="stylesheet">
<style>
:root{--bg:#FFFAF3;--ink:#2B2430;--mut:#6F6678;--line:#EEE3D4;--acc:#E8683A;--r:28px}
*{box-sizing:border-box}html{scroll-behavior:smooth}
body{margin:0;background:var(--bg);color:var(--ink);font-family:'DM Sans',system-ui,sans-serif;-webkit-font-smoothing:antialiased;line-height:1.5}
a{color:inherit;text-decoration:none}.wrap{max-width:1180px;margin:0 auto;padding:0 28px}
h1,h2,h3{font-family:'Bricolage Grotesque',sans-serif;letter-spacing:-.03em;margin:0}
.bar{background:var(--ink);color:#fff;text-align:center;font-size:.9rem;padding:9px 16px}.bar a{color:#FFB08F;font-weight:700;margin-left:8px}
header{position:sticky;top:0;z-index:20;background:rgba(255,250,243,.9);backdrop-filter:blur(12px);border-bottom:1px solid var(--line)}
.nav{display:flex;align-items:center;height:72px;gap:32px}
.logo{display:flex;align-items:center;gap:10px;font:800 1.25rem 'Bricolage Grotesque';letter-spacing:-.01em}
.logo i{width:32px;height:32px;border-radius:10px;background:#E8F7D6;display:grid;place-items:center}.logo i:after{content:"";width:14px;height:16px;border-radius:7px 7px 3px 7px;background:#4B2745}
.links{display:flex;gap:28px;font-weight:500;color:var(--mut)}.links a:hover{color:var(--ink)}
.sp{flex:1}.signin{font-weight:700}
.btn{display:inline-flex;align-items:center;gap:8px;border-radius:999px;font-weight:700;padding:13px 22px;font-size:1rem;transition:transform .15s,box-shadow .15s}
.btn:hover{transform:translateY(-2px)}.btn.dark{background:var(--ink);color:#fff}.btn.light{background:#fff;border:1.5px solid var(--ink);color:var(--ink)}.btn.acc{background:var(--acc);color:#fff}.btn.sm{padding:10px 18px;font-size:.92rem}
/* hero */
.hero{display:grid;grid-template-columns:1.02fr 1fr;gap:30px;align-items:center;padding:56px 28px 40px}
.pill{display:inline-flex;gap:8px;align-items:center;background:#fff;border:1px solid var(--line);border-radius:999px;padding:6px 14px 6px 8px;font-size:.88rem;font-weight:500;color:var(--mut)}.pill b{background:var(--acc);color:#fff;border-radius:999px;padding:2px 10px;font-size:.76rem}
.hero h1{font-size:clamp(2.7rem,5.6vw,4.7rem);line-height:.98;font-weight:800;margin:18px 0 18px}.hero h1 span{color:var(--acc)}
.hero p{font-size:1.18rem;color:var(--mut);max-width:34em;margin:0 0 28px}
.cta{display:flex;gap:12px;flex-wrap:wrap}
.proof{display:flex;gap:26px;margin-top:34px;color:var(--mut);font-size:.92rem}.proof b{display:block;font:800 1.5rem 'Bricolage Grotesque';color:var(--ink)}
.collage{position:relative;aspect-ratio:1/.96;border-radius:44px;background:linear-gradient(160deg,#FFE3D0,#FBD3DA 55%,#E5DDFB)}
.collage .c{position:absolute}.collage svg{display:block;width:100%;height:auto}
.c1{width:44%;left:28%;bottom:4%;z-index:3}.c2{width:24%;left:5%;top:10%;transform:rotate(-8deg)}.c3{width:26%;right:6%;top:6%;transform:rotate(6deg)}.c4{width:24%;left:6%;bottom:6%;z-index:2}.c5{width:30%;right:3%;bottom:8%;z-index:2}
.chip{position:absolute;background:#fff;border-radius:16px;padding:9px 14px;font-weight:700;font-size:.84rem;box-shadow:0 10px 30px rgba(43,36,48,.12);display:flex;gap:8px;align-items:center;z-index:5}
.chip i{width:20px;height:20px;border-radius:50%;background:#7BD389;display:grid;place-items:center;color:#fff;font-style:normal;font-size:.7rem}
/* sections */
section{padding:72px 0}.eyebrow{font:800 .78rem 'DM Sans';letter-spacing:.14em;text-transform:uppercase;color:var(--acc)}
.sh{max-width:640px;margin-bottom:34px}.sh h2{font-size:clamp(2rem,4vw,3rem);line-height:1.02;margin:10px 0 12px;font-weight:800}.sh p{color:var(--mut);font-size:1.08rem;margin:0}
.packs{display:flex;gap:18px;overflow-x:auto;scroll-snap-type:x mandatory;padding-bottom:10px;margin:0 -28px;padding:0 28px 10px;scroll-padding-left:28px}
.pack{flex:0 0 268px;scroll-snap-align:start;background:#fff;border:1px solid var(--line);border-radius:var(--r);overflow:hidden;transition:transform .2s,box-shadow .2s}
.pack:hover{transform:translateY(-5px);box-shadow:0 18px 40px rgba(43,36,48,.12)}
.pv{height:230px;background:color-mix(in srgb,var(--c) 30%,#fff);position:relative;overflow:hidden}.pa{position:absolute;left:50%;bottom:0;width:62%;transform:translateX(-50%)}
.pm{display:flex;justify-content:space-between;align-items:center;padding:16px 20px}.pm b{display:block;font:800 1.2rem 'Bricolage Grotesque'}.pm span{color:var(--mut);font-size:.9rem}.pm i{width:38px;height:38px;border-radius:50%;background:var(--ink);color:#fff;display:grid;place-items:center}
.split{display:grid;grid-template-columns:1fr 1fr;gap:56px;align-items:center}.split.rev>:first-child{order:2}
.feat h2{font-size:clamp(1.9rem,3.6vw,2.7rem);line-height:1.04;font-weight:800;margin:10px 0 14px}.feat p{color:var(--mut);font-size:1.08rem;margin:0 0 18px}
.ticks{list-style:none;padding:0;margin:0;display:grid;gap:10px}.ticks li{display:flex;gap:10px;font-weight:500}.ticks li:before{content:"✓";display:grid;place-items:center;width:22px;height:22px;border-radius:50%;background:#E3F5DE;color:#2E8B3E;font-size:.8rem;font-weight:800;flex:none}
.studio{background:#fff;border:1px solid var(--line);border-radius:36px;padding:22px;box-shadow:0 24px 60px rgba(43,36,48,.10)}
.studio .stage{background:#FFF1E4;border-radius:24px;aspect-ratio:1.5;display:grid;place-items:center;padding:14px}.studio .stage svg{height:100%;width:auto}
.ctl{display:grid;gap:14px;margin-top:18px}.row{display:grid;grid-template-columns:70px 1fr 44px;gap:12px;align-items:center;font-size:.86rem;font-weight:700;color:var(--mut)}
.trk{height:6px;border-radius:99px;background:#EADFCF;position:relative}.trk i{position:absolute;left:0;top:0;bottom:0;border-radius:99px;background:var(--acc)}.trk b{position:absolute;top:50%;width:18px;height:18px;border-radius:50%;background:#fff;border:2px solid var(--ink);transform:translate(-50%,-50%)}
.dots{display:flex;gap:8px}.dots i{width:22px;height:22px;border-radius:50%;border:2px solid #fff;box-shadow:0 0 0 1.5px var(--line)}
.code{background:var(--ink);color:#EFE8F6;border-radius:30px;padding:8px;box-shadow:0 24px 60px rgba(43,36,48,.18)}
.tabs{display:flex;gap:6px;padding:10px}.tabs b{padding:6px 14px;border-radius:999px;font-size:.82rem;color:#A89EB5}.tabs b.on{background:rgba(255,255,255,.12);color:#fff}
.code pre{margin:0;padding:6px 22px 24px;font:500 .84rem/1.7 ui-monospace,Menlo,monospace;color:#CFC4DE;overflow:auto}.code pre em{color:#FFB08F;font-style:normal}.code pre u{color:#9AE3B5;text-decoration:none}
.soon{background:var(--ink);color:#fff;border-radius:44px;padding:56px;display:grid;grid-template-columns:1fr 1fr;gap:40px;align-items:center}
.soon h2{font-size:clamp(2rem,4vw,3rem);line-height:1.02;font-weight:800;margin:10px 0 12px}.soon p{color:#CFC6DA;font-size:1.08rem;margin:0 0 22px}
.wait{display:flex;gap:8px;background:rgba(255,255,255,.1);border-radius:999px;padding:6px}.wait span{flex:1;padding:10px 16px;color:#A89EB5}.wait .btn{padding:11px 20px}
.ig{display:grid;grid-template-columns:repeat(4,1fr);gap:10px}.ig span{aspect-ratio:1;border-radius:20px;background:rgba(255,255,255,.08);display:grid;place-items:center}.ig svg{width:42%;height:42%;color:#fff;stroke:currentColor;fill:none;stroke-width:1.7;stroke-linecap:round;stroke-linejoin:round}
.faq{max-width:760px;margin:0 auto}.faq details{border-bottom:1px solid var(--line);padding:20px 4px}.faq summary{cursor:pointer;font:700 1.15rem 'Bricolage Grotesque';list-style:none;display:flex;justify-content:space-between}.faq summary:after{content:"+";font-size:1.4rem;color:var(--acc)}.faq details[open] summary:after{content:"–"}.faq p{color:var(--mut);margin:10px 0 0}
.final{position:relative;background:var(--acc);color:#fff;border-radius:48px;padding:70px 56px 0;overflow:hidden;text-align:center;min-height:360px}
.final h2{font-size:clamp(2.2rem,4.6vw,3.6rem);line-height:1;font-weight:800;max-width:15ch;margin:0 auto 14px}.final p{margin:0 auto 26px;opacity:.92;max-width:36ch;font-size:1.1rem}
.final .row2{display:flex;justify-content:center;align-items:flex-end;gap:2%;margin-top:40px}.final .row2 div{width:15%;min-width:80px}.final .row2 svg{display:block;width:100%;height:auto}
footer{margin-top:80px;border-top:1px solid var(--line);padding:56px 0 30px}.fg{display:grid;grid-template-columns:1.6fr 1fr 1fr 1fr;gap:30px}.fg h4{margin:0 0 12px;font:800 .78rem 'DM Sans';letter-spacing:.14em;text-transform:uppercase;color:var(--mut)}.fg a{display:block;padding:4px 0;color:var(--ink)}.fg p{color:var(--mut);max-width:30ch}
.fb{display:flex;justify-content:space-between;margin-top:40px;color:var(--mut);font-size:.9rem;flex-wrap:wrap;gap:10px}

dialog{border:0;padding:0;border-radius:32px;max-width:420px;width:calc(100% - 32px);background:#fff;box-shadow:0 40px 100px rgba(43,36,48,.35);color:var(--ink)}
dialog::backdrop{background:rgba(43,36,48,.5);backdrop-filter:blur(4px)}
.dlg{padding:34px 32px 28px;text-align:center;position:relative}
.dlg .x{position:absolute;right:16px;top:16px;width:34px;height:34px;border-radius:50%;border:0;background:#F4EBDD;font-size:1.1rem;cursor:pointer;color:var(--ink)}
.dlg .mark{width:58px;height:58px;border-radius:18px;background:#E8F7D6;display:grid;place-items:center;margin:0 auto 16px}.dlg .mark:after{content:"";width:25px;height:29px;border-radius:13px 13px 6px 13px;background:#4B2745}
.dlg h3{font-size:1.7rem;font-weight:800;margin:0 0 6px}.dlg p{color:var(--mut);margin:0 0 22px}
.sso{display:flex;align-items:center;justify-content:center;gap:12px;width:100%;padding:14px 18px;border-radius:999px;font:700 1rem 'DM Sans';cursor:pointer;margin-bottom:10px;border:1.5px solid var(--line);background:#fff;color:var(--ink);transition:transform .15s,box-shadow .15s}
.sso:hover{transform:translateY(-2px);box-shadow:0 10px 24px rgba(43,36,48,.12)}.sso svg{width:20px;height:20px}.sso.xx{background:#000;border-color:#000;color:#fff}
.or{display:flex;align-items:center;gap:12px;color:#A79EAF;font-size:.8rem;margin:14px 0}.or:before,.or:after{content:"";flex:1;height:1px;background:var(--line)}
.fine{font-size:.8rem;color:var(--mut);margin:16px 0 0}.fine a{text-decoration:underline}
.me{display:none;align-items:center;gap:10px;font-weight:700}.me i{width:36px;height:36px;border-radius:50%;background:#E8683A;color:#fff;display:grid;place-items:center;font-style:normal}.me u{text-decoration:none;color:var(--mut);font-weight:500;font-size:.88rem;cursor:pointer}
body.in .signin,body.in .gs{display:none}body.in .me{display:flex}
@media(max-width:900px){.hero,.split,.soon,.fg{grid-template-columns:1fr}.split.rev>:first-child{order:0}.links,.signin{display:none}.soon{padding:32px}.final{padding:48px 24px 0}.collage{aspect-ratio:1}}
</style></head><body>
<div class="bar">New: the Mushroom Buddy pack is here, 27 stickers.<a href="#packs">Take a look →</a></div>
<header><div class="wrap nav"><a class="logo" href="#"><i></i>Pasteables</a><nav class="links"><a href="#packs">Stickers</a><a href="#icons">Icons</a><a href="#features">Features</a><a href="#faq">FAQ</a></nav><span class="sp"></span><a class="signin" href="#" onclick="openAuth(event,'in')">Log in</a><a class="btn dark sm gs" href="#" onclick="openAuth(event,'up')">Get started</a><div class="me"><i>S</i><span>Signed in</span><u onclick="signOut()">Sign out</u></div></div></header>
<main>
<div class="wrap hero"><div><span class="pill"><b>Free</b>Copy-ready vectors</span><h1>Cute vectors for <span>every</span> project.</h1><p>Sticker characters and icon sets you can tweak and paste straight into your app, as SVG, React or Flutter. No sign-up, no fuss.</p>
<div class="cta"><a class="btn dark" href="#packs">Browse stickers ${arrow}</a><a class="btn light" href="#icons">Explore icons</a></div>
<div class="proof"><div><b>${total}</b>stickers</div><div><b>${hero.length}</b>packs</div><div><b>3</b>formats</div></div></div>
<div class="collage"><div class="chip" style="left:30%;top:4%"><i>✓</i>Copied as SVG</div>
<div class="c c2">${art("ghost")}</div><div class="c c3">${art("clouds")}</div><div class="c c4">${art("mascot")}</div><div class="c c5">${art("emoticons")}</div><div class="c c1">${art("mushroom")}</div></div></div>
<section id="packs"><div class="wrap"><div class="sh"><span class="eyebrow">Sticker packs</span><h2>A face for every mood.</h2><p>Five characters, hundreds of poses. Open a pack to browse, tweak and copy.</p></div><div class="packs">${hero.map(pack).join("")}</div></div></section>
<section id="features"><div class="wrap split feat"><div><span class="eyebrow">Make it yours</span><h2>Tweak it before you copy it.</h2><p>Change color, stroke, ink and eye size live, then copy exactly what you see.</p><ul class="ticks"><li>Recolor any character in one click</li><li>Thicker or thinner outlines</li><li>Bigger or smaller eyes</li></ul></div>
<div class="studio"><div class="stage">${tile("Super happy")}</div><div class="ctl"><div class="row">Stroke<div class="trk"><i style="width:30%"></i><b style="left:30%"></b></div>0.5x</div><div class="row">Eyes<div class="trk"><i style="width:45%"></i><b style="left:45%"></b></div>1x</div><div class="row">Ink<div class="dots"><i style="background:#2B2430"></i><i style="background:#1F3A8A"></i><i style="background:#6B2D5C"></i><i style="background:#5A3A2A"></i><i style="background:#1E5B45"></i></div><span></span></div></div></div></div></section>
<section><div class="wrap split rev feat"><div><span class="eyebrow">Built for developers</span><h2>Paste it where it belongs.</h2><p>Every sticker copies as plain SVG, a typed React component or a Flutter widget.</p><ul class="ticks"><li>One click, straight to your clipboard</li><li>Clean markup with no extra wrappers</li><li>Works in Figma, the web and mobile</li></ul></div>
<div class="code"><div class="tabs"><b>SVG</b><b class="on">React</b><b>Flutter</b></div><pre><em>export default function</em> <u>MushroomBuddy</u>(props) {
  <em>return</em> (
    &lt;svg viewBox="55 50 890 890" {...props}&gt;
      &lt;path d="M135 505C120 380…" /&gt;
      …
    &lt;/svg&gt;
  );
}</pre></div></div></section>
<section id="icons"><div class="wrap"><div class="soon"><div><span class="eyebrow" style="color:#FFB08F">Coming soon</span><h2>Icon packs are on the way.</h2><p>Clean, consistent line icons in the same soft style. Be the first to know when they land.</p><div class="wait"><span>you@email.com</span><a class="btn acc" href="#">Notify me</a></div></div>
<div class="ig">${["M3 11l9-8 9 8M5 10v10h14V10", "M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14zM20 20l-4-4", "M6 8a6 6 0 0 1 12 0c0 7 3 8 3 8H3s3-1 3-8M10 20a2 2 0 0 0 4 0", "M3 7h18v12H3zM3 9l9 6 9-6", "M12 21s-8-5-8-11a4.5 4.5 0 0 1 8-2.5A4.5 4.5 0 0 1 20 10c0 6-8 11-8 11z", "M12 4a4 4 0 1 0 0 8 4 4 0 0 0 0-8zM4 21a8 8 0 0 1 16 0", "M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6zM12 2v3M12 19v3M2 12h3M19 12h3", "M5 20h14M7 20c0-6 2-10 5-10s5 4 5 10"].map((d) => `<span><svg viewBox="0 0 24 24"><path d="${d}"/></svg></span>`).join("")}</div></div></div></section>
<section id="faq"><div class="wrap"><div class="sh" style="text-align:center;margin-inline:auto"><span class="eyebrow">FAQ</span><h2>Good to know.</h2></div><div class="faq">
<details open><summary>Is Pasteables free to use?</summary><p>Yes. Browse, tweak and copy any sticker without an account.</p></details>
<details><summary>What formats can I copy?</summary><p>SVG, a React component or a Flutter widget, from the toolbar of every pack.</p></details>
<details><summary>Can I change the colors?</summary><p>Yes. Recolor characters, change the outline color and adjust stroke and eye size before you copy.</p></details>
<details><summary>When do icon packs launch?</summary><p>Soon. Join the list above and you'll hear first.</p></details></div></div></section>
<section style="padding:20px 0 40px"><div class="wrap"><div class="final"><h2>Ready to paste something cute?</h2><p>Pick a pack and copy your first sticker in a click.</p><a class="btn dark" href="#packs">Browse stickers ${arrow}</a>
<div class="row2"><div>${art("ghost")}</div><div>${art("mascot")}</div><div style="width:20%">${art("mushroom")}</div><div>${art("clouds")}</div><div>${art("emoticons")}</div></div></div></div></section>
</main>
<dialog id="auth"><div class="dlg"><button class="x" onclick="auth.close()" aria-label="Close">×</button><div class="mark"></div><h3 id="at">Welcome to Pasteables</h3><p id="as">Sign in to get started. It takes a few seconds.</p>
<button class="sso" onclick="signIn('Google')"><svg viewBox="0 0 24 24"><path fill="#EA4335" d="M12 5.04c1.5 0 2.84.52 3.9 1.53l2.9-2.9C17.05 1.99 14.76 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.4 2.64C6.4 7.24 9 5.04 12 5.04z"/><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32l3.4 2.64c2-1.85 3.44-4.57 3.44-7.97z"/><path fill="#FBBC05" d="M5.58 14.29a7.2 7.2 0 0 1 0-4.58l-3.4-2.64a11.97 11.97 0 0 0 0 9.86l3.4-2.64z"/><path fill="#34A853" d="M12 23c3.24 0 5.95-1.08 7.93-2.91l-3.4-2.64c-1.1.74-2.5 1.18-4.53 1.18-3 0-5.6-2.2-6.42-5.07l-3.4 2.64C3.99 20.53 7.7 23 12 23z"/></svg>Continue with Google</button><button class="sso xx" onclick="signIn('X')"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>Continue with X</button>
<p class="fine">By continuing you agree to the <a href="#">Terms</a> and <a href="#">Privacy Policy</a>.</p></div></dialog>
<script>
const auth=document.getElementById('auth');
function openAuth(e,mode){e.preventDefault();document.getElementById('at').textContent=mode==='in'?'Welcome back':'Welcome to Pasteables';document.getElementById('as').textContent=mode==='in'?'Log in to pick up where you left off.':'Sign in to get started. It takes a few seconds.';auth.showModal()}
function signIn(p){auth.close();document.body.classList.add('in')}
function signOut(){document.body.classList.remove('in')}
document.querySelectorAll('.cta .btn.dark,.final .btn.dark').forEach(b=>b.addEventListener('click',e=>{if(!document.body.classList.contains('in'))openAuth(e,'up')}));
</script>

</body></html>`;
fs.writeFileSync("design/home-mock-d.html", html);
const dir = (process.env.TMPDIR || "/tmp") + "/sheet";
fs.mkdirSync(dir, { recursive: true });
fs.writeFileSync(dir + "/home-mock-d.html", html);
console.log("ok", html.length);
