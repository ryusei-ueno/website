'use strict';

document.addEventListener('DOMContentLoaded', () => {
    loadNews();
    loadFeatured();
});

// --- 1. Latest Updates (ニュース) の読み込み ---
async function loadNews() {
    const newsContainer = document.getElementById('news-container');
    if (!newsContainer) return; 

    try {
        const response = await fetch('assets/data/news.json');
        if (!response.ok) throw new Error('Network response was not ok');
        
        const newsData = await response.json();
        newsContainer.innerHTML = '';

        // 日付の降順にソートし、最新3件を取得
        newsData.sort((a, b) => new Date(b.date) - new Date(a.date));
        const latestNews = newsData.slice(0, 3);

        latestNews.forEach(item => {
            const formattedDate = item.date.replace(/-/g, '.');
            const li = document.createElement('li');

            let contentHTML = item.content;
            if (item.url) {
                contentHTML = `<a href="${item.url}" target="_blank" rel="noopener noreferrer" style="color: inherit; text-decoration: underline; text-decoration-color: var(--line-color); text-underline-offset: 4px;">${item.content}</a>`;
            }

            // カテゴリが存在しない場合のフォールバックを用意しつつ、大文字に変換
            const categoryText = item.category ? item.category.toUpperCase() : 'INFO';

            li.innerHTML = `
                <div class="news-meta">
                    <span class="news-date">${formattedDate}</span>
                    <span class="news-tag">${categoryText}</span>
                </div>
                <span class="news-text">${contentHTML}</span>
            `;
            newsContainer.appendChild(li);
        });

    } catch (error) {
        console.error('Failed to load news:', error);
        newsContainer.innerHTML = `
            <li>
                <span class="news-text" style="color: rgba(255,255,255,0.5);">Failed to load latest updates.</span>
            </li>
        `;
    }
}

// --- 2. Featured Research (注目の業績) の読み込み ---
async function loadFeatured() {
    const featuredContainer = document.getElementById('featured-container');
    if (!featuredContainer) return;

    try {
        const response = await fetch('assets/data/research.json');
        if (!response.ok) throw new Error('Network response was not ok');
        
        const researchData = await response.json();
        featuredContainer.innerHTML = '';

        // "featured": true のデータを抽出し、最新2件のみを取得
        const featuredItems = researchData
            .filter(item => item.featured === true)
            .slice(0, 2);

        featuredItems.forEach(item => {
            const card = document.createElement('a');
            card.href = item.url ? item.url : 'research.html';
            card.className = 'featured-card glass-panel';

            const categoryText = item.category ? item.category.toUpperCase() : 'RESEARCH';

            card.innerHTML = `
                <div class="card-meta">
                    <span class="card-tag">${categoryText}</span>
                    <span class="card-year">${item.year}</span>
                </div>
                <h4 class="card-title">${item.title}</h4>
                <p class="card-desc">${item.description}</p>
                <span class="card-action">View Details <span>→</span></span>
            `;
            featuredContainer.appendChild(card);
        });

    } catch (error) {
        console.error('Failed to load featured research:', error);
        featuredContainer.innerHTML = '<p style="color: rgba(255,255,255,0.5);">Failed to load research data.</p>';
    }
}