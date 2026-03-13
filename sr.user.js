// ==UserScript==
// @name         SR
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  SR
// @match        www.geo-fs.com/geofs.php*
// @run-at       document-start
// @grant        GM_xmlhttpRequest
// @author       末尘歌
// ==/UserScript==

(function() {
    'use strict';
    const originalOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function(method, url) {
        if (url.includes('.php') || url.includes('.js')) {
            this.addEventListener('load', function() {
                let modifiedResponse = this.responseText;
                modifiedResponse = modifiedResponse.replace(
                    /url\s*:\s*'https:\/\/data\.geo-fs\.com\/superres\/\{z\}\/\{x\}\/\{y\}\.webp'/g,
                    "url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'"
                );
                modifiedResponse = modifiedResponse.replace(
                    /maximumLevel:\s*15/g,
                    "maximumLevel: 19"
                );
                Object.defineProperty(this, 'responseText', {
                    value: modifiedResponse,
                    writable: false
                });
            });
        }
        originalOpen.apply(this, arguments);
    };
    const observer = new MutationObserver(() => {
        const scripts = document.querySelectorAll('script');
        scripts.forEach(script => {
            if (script.textContent) {
                let modifiedContent = script.textContent;
                if (modifiedContent.includes('data.geo-fs.com/superres')) {
                    modifiedContent = modifiedContent.replace(
                        /url\s*:\s*'https:\/\/data\.geo-fs\.com\/superres\/\{z\}\/\{x\}\/\{y\}\.webp'/g,
                        "url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'"
                    );
                }
                if (modifiedContent.includes('maximumLevel')) {
                    modifiedContent = modifiedContent.replace(
                        /maximumLevel:\s*15/g,
                        "maximumLevel: 19"
                    );
                }

                if (modifiedContent !== script.textContent) {
                    script.textContent = modifiedContent;
                }
            }
        });
    });
    observer.observe(document, { childList: true, subtree: true });
})();
