import { defineClientConfig } from '@vuepress/client'
import {onMounted} from 'vue'

export default defineClientConfig({
    enhance({ app, router, siteData }) {},
    setup() {
        console.log('init')
        onMounted(()=>{
            console.log('run')
            const scripts = document.querySelectorAll('pre');
            scripts.forEach(script => {
                const el = script.getAttribute('el')
                if (!el){
                    return
                }
                const newScript = document.createElement(el);
                Array.from(script.attributes).forEach(attr => {
                    newScript.setAttribute(attr.name, attr.value);
                });
                newScript.innerHTML = script.innerHTML;
                if (script.parentNode){
                    script.parentNode.replaceChild(newScript, script);
                }
            });
        })
    },
  rootComponents: [],
})

