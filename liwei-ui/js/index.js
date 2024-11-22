$(document).ready(function() {
    // 加载最新的两条新闻
    function loadLatestNews() {
        $.ajax({
            url: CONFIG.API_BASE_URL + '/business/list',
            method: 'GET',
            data: {
                current: 1,
                size: 2,  // 只获取2条数据
                type: 0   // 新闻资讯
            },
            success: function(response) {
                if (response.code === 200) {
                    renderLatestNews(response.data.records);
                }
            },
            error: function(error) {
                console.error('获取新闻列表失败:', error);
                $('.news-grid').html(`
                    <div class="error-message">
                        <p>暂时无法加载新闻，请稍后再试</p>
                    </div>
                `);
            }
        });
    }

    // 渲染最新新闻
    function renderLatestNews(news) {
        const container = $('.news-grid');
        container.empty();

        news.forEach(function(item) {
            const newsHtml = `
                <div class="news-item">
                    <div class="news-image">
                        <img src="${item.image || 'images/news-default.jpg'}" alt="${item.title}">
                    </div>
                    <div class="news-content">
                        <h3 class="news-title" title="${item.title}">${item.title}</h3>
                        <p class="news-excerpt">${item.description || '暂无描述'}</p>
                        <a href="detail.html?id=${item.id}&type=0" class="read-more">查看详情</a>
                    </div>
                </div>
            `;
            container.append(newsHtml);
        });
    }

    // 格式化日期
    function formatDate(dateString) {
        const date = new Date(dateString);
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    }

    // 初始加载
    loadLatestNews();
}); 