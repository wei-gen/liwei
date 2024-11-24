$(document).ready(function() {
    let currentPage = 1;
    const pageSize = 5;

    // 加载新闻列表
    function loadNews(page) {
        $.ajax({
            url: CONFIG.API_BASE_URL + '/business/list',
            method: 'GET',
            data: {
                current: page,
                size: pageSize,
                type: 0
            },
            success: function(response) {
                if (response.code === 200) {
                    renderNews(response.data);
                    renderPagination(response.data);
                }
            },
            error: function(error) {
                console.error('获取新闻列表失败:', error);
                $('#newsContainer').html(`
                    <div class="error-message">
                        <p>暂时无法加载新闻列表，请稍后再试</p>
                    </div>
                `);
            }
        });
    }

    // 渲染新闻列表
    function renderNews(data) {
        const container = $('#newsContainer');
        container.empty();

        data.records.forEach(function(news) {
            const newsHtml = `
                <div class="news-item">
                    <div class="news-content">
                        <h3>${news.title}</h3>
                        <p class="news-excerpt">${news.description || '暂无描述'}</p>
                        <div class="news-meta">
                            <div class="news-date">${formatDate(news.createTime)}</div>
                            <a href="detail.html?id=${news.id}&type=0" class="read-more">查看详情</a>
                        </div>
                    </div>
                </div>
            `;
            container.append(newsHtml);
        });
    }

    // 渲染分页
    function renderPagination(data) {
        const container = $('#paginationContainer');
        container.empty();

        const totalPages = data.pages;
        currentPage = data.current;

        // 上一页
        if (currentPage > 1) {
            container.append(`<a href="#" data-page="${currentPage - 1}">< 上一页</a>`);
        }

        // 页码
        for (let i = 1; i <= totalPages; i++) {
            container.append(`
                <a href="#" data-page="${i}" ${i === currentPage ? 'class="active"' : ''}>
                    ${i}
                </a>
            `);
        }

        // 下一页
        if (currentPage < totalPages) {
            container.append(`<a href="#" data-page="${currentPage + 1}">下一页 ></a>`);
        }
    }

    // 格式化日期
    function formatDate(dateString) {
        const date = new Date(dateString);
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    }

    // 绑定分页点击事件
    $('#paginationContainer').on('click', 'a', function(e) {
        e.preventDefault();
        const page = $(this).data('page');
        loadNews(page);
        // 滚动到页面顶部
        $('html, body').animate({ scrollTop: $('.news-list').offset().top - 120 }, 500);
    });

    // 初始加载
    loadNews(1);
}); 