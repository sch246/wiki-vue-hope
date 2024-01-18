import{T as e,e as t,a as r}from"./core-H_WvvWSA.js";import{notify as n}from"./error-cfVDE4Yr.js";const o=[...e.keys()].map((e=>`pre[type="${e}"][terminal],script[type="${e}"][terminal],${e}-script[terminal]`)).join(","),i=e=>{throw n(e),new Error(e)},s=async()=>{const e=document.querySelectorAll(o);if(!e.length)return;a.disconnect(),e.length>1&&i("You can use at most 1 terminal.");const[n]=e;n.matches('pre[type="mpy"],script[type="mpy"],mpy-script')&&i("Unsupported terminal."),document.head.append(Object.assign(document.createElement("link"),{rel:"stylesheet",href:new URL("./xterm.css",import.meta.url)}));const[{Terminal:s},{Readline:d},{FitAddon:l}]=await Promise.all([import("./xterm-f2QfYNGL.js"),import("./xterm-readline-ONk85xtH.js"),import("./xterm_addon-fit-E4yMPZTX.js")]),c=new d,m=e=>{let t=n;const o=n.getAttribute("target");if(o){if(t=document.getElementById(o)||document.querySelector(o),!t)throw new Error(`Unknown target ${o}`)}else t=document.createElement("py-terminal"),t.style.display="block",n.after(t);const i=new s({theme:{background:"#191A19",foreground:"#F5F2E7"},...e}),a=new l;i.loadAddon(a),i.loadAddon(c),i.open(t),a.fit(),i.focus(),r(n,"terminal",{value:i})};if(n.hasAttribute("worker")){const e=({interpreter:e,io:t},{sync:r})=>{r.pyterminal_drop_hooks();const n=new TextDecoder;let o="";const i={isatty:!0,write:e=>(o=n.decode(e),r.pyterminal_write(o),e.length)};e.setStdout(i),e.setStderr(i),e.setStdin({isatty:!0,stdin:()=>r.pyterminal_read(o)}),t.stderr=e=>{r.pyterminal_write(`${e.message||e}\n`)}};t.main.onWorker.add((function r(n,o){t.main.onWorker.delete(r),m({disableStdin:!1,cursorBlink:!0,cursorStyle:"block"}),o.sync.pyterminal_read=c.read.bind(c),o.sync.pyterminal_write=c.write.bind(c),o.sync.pyterminal_drop_hooks=()=>{t.worker.onReady.delete(e)}})),t.worker.onReady.add(e)}else t.main.onReady.add((function e({interpreter:r,io:n}){console.warn("py-terminal is read only on main thread"),t.main.onReady.delete(e),m({disableStdin:!0,cursorBlink:!1,cursorStyle:"underline"});const o=new TextDecoder;let i="";const s={isatty:!0,write:e=>(i=o.decode(e),c.write(i),e.length)};r.setStdout(s),r.setStderr(s),r.setStdin({isatty:!0,stdin:()=>c.read(i)}),n.stderr=e=>{c.write(`${e.message||e}\n`)}}))},a=new MutationObserver(s);a.observe(document,{childList:!0,subtree:!0});var d=s();export{d as default};
//# sourceMappingURL=py-terminal-OcpnQOxH.js.map
