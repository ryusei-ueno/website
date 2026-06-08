'use strict';

document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. ローディング画面の制御 ---
    const loader = document.getElementById('loading-screen');
    const line = document.getElementById('loader-line');

    if (line) {
        requestAnimationFrame(() => {
            line.style.width = '100%';
        });
    }

    setTimeout(() => {
        if (loader) {
            loader.style.opacity = '0'; // フェードアウト
            setTimeout(() => {
                loader.style.display = 'none'; // DOMから非表示
                document.body.classList.add('page-loaded'); 
            }, 500);
        }
    }, 600);


    // --- 2. ハンバーガーメニューの制御 ---
    const menuBtn = document.getElementById('menu-btn');
    const globalNav = document.getElementById('global-nav');

    if (menuBtn && globalNav) {
        // ボタンクリックでメニューを開閉
        menuBtn.addEventListener('click', () => {
            menuBtn.classList.toggle('is-active');
            globalNav.classList.toggle('is-open');
        });

        // リンクをクリックした際にメニューを閉じる
        const navLinks = globalNav.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                menuBtn.classList.remove('is-active');
                globalNav.classList.remove('is-open');
            });
        });
    }


    // --- 3. マウス追従の光 (Mouse Glow) ---
    const glow = document.getElementById('mouse-glow');
    if (glow) {
        window.addEventListener('mousemove', (e) => {
            if (!glow.classList.contains('is-active')) {
                glow.classList.add('is-active');
            }
            // CSS変数に現在のマウス座標をセット
            glow.style.setProperty('--mouse-x', `${e.clientX}px`);
            glow.style.setProperty('--mouse-y', `${e.clientY}px`);
        });
    }

});