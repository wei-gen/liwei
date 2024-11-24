$(document).ready(function() {
    let currentPage = 1;
    const pageSize = 5;

    // 加载案例列表
    function loadCases(page) {
        $.ajax({
            url: CONFIG.API_BASE_URL + '/business/list',
            method: 'GET',
            data: {
                current: page,
                size: pageSize,
                type: 2
            },
            success: function(response) {
                if (response.code === 200) {
                    renderCases(response.data);
                    renderPagination(response.data);
                }
            },
            error: function(error) {
                console.error('获取案例列表失败:', error);
                $('#casesContainer').html(`
                    <div class="error-message">
                        <p>暂时无法加载案例列表，请稍后再试</p>
                    </div>
                `);
            }
        });
    }

    // 渲染案例列表
    function renderCases(data) {
        const container = $('#casesContainer');
        container.empty();

        data.records.forEach(function(item) {
            const caseHtml = `
                <div class="case-item">
                    <div class="case-image">
                        <img src="${item.image || 'images/case-default.jpg'}" alt="${item.title}">
                        <div class="case-date">${formatDate(item.createTime)}</div>
                    </div>
                    <div class="case-content">
                        <h3>${item.title}</h3>
                        <p class="case-excerpt">${item.description || '暂无描述'}</p>
                        <div class="case-meta">
                            <span class="views">浏览：${item.checkNum || 0}</span>
                            <a href="detail.html?id=${item.id}&type=2" class="read-more">查看详情</a>
                        </div>
                    </div>
                </div>
            `;
            container.append(caseHtml);
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
        loadCases(page);
        // 滚动到页面顶部
        $('html, body').animate({ scrollTop: $('.cases-list').offset().top - 120 }, 500);
    });

    // 初始加载
    loadCases(1);
}); 