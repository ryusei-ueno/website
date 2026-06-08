'use strict';

document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. タブ切り替えロジック ---
    const toggleBtns = document.querySelectorAll('.toggle-btn[data-target]');
    const viewSections = document.querySelectorAll('.view-section');

    toggleBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // ボタンのアクティブ状態を切り替え
            toggleBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // 対象のビューを表示
            const targetId = btn.getAttribute('data-target');
            viewSections.forEach(section => {
                section.classList.remove('active');
                if (section.id === targetId) {
                    section.classList.add('active');
                }
            });
        });
    });

    // --- 2. 戻るボタンの処理 (Blog記事表示からリストへ戻る) ---
    const backBtn = document.getElementById('back-to-notes');
    if (backBtn) {
        backBtn.addEventListener('click', () => {
            document.getElementById('fieldnotes-single').style.display = 'none';
            document.getElementById('fieldnotes-list').style.display = 'block';
        });
    }

    // --- 3. データの初期読み込み実行 ---
    loadAcademicOutput();
    loadFieldNotes();
});

// --- Academic Output (業績リスト) の処理 ---
async function loadAcademicOutput() {
    const contentDiv = document.getElementById('academic-content');
    if (!contentDiv) return;

    try {
        const response = await fetch('assets/data/research.json');
        if (!response.ok) throw new Error('Network response was not ok');
        
        const data = await response.json();
        const categorizedData = { publication: [], presentation: [], project: [] };

        // データをカテゴリ別に分類
        data.forEach(item => {
            if (categorizedData[item.category]) {
                categorizedData[item.category].push(item);
            } else {
                categorizedData[item.category] = [item];
            }
        });

        let htmlContent = '';
        const categoryOrder = ['publication', 'presentation', 'project'];

        categoryOrder.forEach(cat => {
            if (categorizedData[cat] && categorizedData[cat].length > 0) {
                // 's' で終わらないカテゴリ名に 's' をつける (例: publication -> publications)
                const displayTitle = cat + (cat.endsWith('s') ? '' : 's');
                
                htmlContent += `
                    <div class="category-block">
                        <h3 class="category-title">${displayTitle}</h3>
                `;
                
                categorizedData[cat].forEach(item => {
                    htmlContent += `
                        <div class="research-item">
                            <span class="item-year">${item.year}</span>
                            <h4 class="item-title">${item.title}</h4>
                            <p class="item-desc">${item.description}</p>
                        </div>
                    `;
                });
                
                htmlContent += `</div>`;
            }
        });
        
        contentDiv.innerHTML = htmlContent;

    } catch (error) {
        console.error('Error loading research data:', error);
        contentDiv.innerHTML = '<p style="color: rgba(255,255,255,0.5);">Failed to load academic output.</p>';
    }
}

// --- Field Notes (Blog) の処理 ---
async function loadFieldNotes() {
    const listDiv = document.getElementById('fieldnotes-list');
    if (!listDiv) return;
    
    try {
        const response = await fetch('assets/data/blog.json');
        if (!response.ok) throw new Error('Network response was not ok');
        
        const posts = await response.json();

        let listHtml = '<div class="category-block">';
        posts.forEach(post => {
            listHtml += `
                <div class="note-item" onclick="openPost('${post.file}')">
                    <span class="note-date">${post.date}</span>
                    <h4 class="note-title">${post.title}</h4>
                    <p class="item-desc">${post.excerpt}</p>
                </div>
            `;
        });
        listHtml += '</div>';
        
        listDiv.innerHTML = listHtml;

    } catch (error) {
        console.error('Error loading blog data:', error);
        listDiv.innerHTML = '<p style="color: rgba(255,255,255,0.5);">Failed to load field notes.</p>';
    }
}

// --- 個別記事（Markdown）を開く処理 ---
// onclick 属性から呼び出されるためグローバルに配置
async function openPost(fileUrl) {
    const listDiv = document.getElementById('fieldnotes-list');
    const singleDiv = document.getElementById('fieldnotes-single');
    const contentDiv = document.getElementById('markdown-content');

    try {
        // Markdownファイルを取得
        const response = await fetch(fileUrl);
        if (!response.ok) throw new Error('Network response was not ok');
        const markdownText = await response.text();

        // marked.js を使って HTML に変換
        contentDiv.innerHTML = marked.parse(markdownText);

        // リストを隠して、個別記事を表示（上部へスクロール）
        listDiv.style.display = 'none';
        singleDiv.style.display = 'block';
        window.scrollTo({ top: 0, behavior: 'smooth' });

    } catch (error) {
        console.error('Error fetching markdown file:', error);
        contentDiv.innerHTML = '<p style="color:red;">Failed to load the post.</p>';
    }
}