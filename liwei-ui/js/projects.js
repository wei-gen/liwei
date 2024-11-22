$(document).ready(function() {
    let currentPage = 1;
    const pageSize = 5;

    // 加载项目列表
    function loadProjects(page) {
        $.ajax({
            url: CONFIG.API_BASE_URL + '/business/list',
            method: 'GET',
            data: {
                current: page,
                size: pageSize,
                type: 1
            },
            success: function(response) {
                if (response.code === 200) {
                    renderProjects(response.data);
                    renderPagination(response.data);
                }
            },
            error: function(error) {
                console.error('获取项目列表失败:', error);
                $('#projectsContainer').html(`
                    <div class="error-message">
                        <p>暂时无法加载项目列表，请稍后再试</p>
                    </div>
                `);
            }
        });
    }

    // 渲染项目列表
    function renderProjects(data) {
        const container = $('#projectsContainer');
        container.empty();

        data.records.forEach(function(item) {
            const projectHtml = `
                <div class="project-item">
                    <div class="project-content">
                        <h3>${item.title}</h3>
                        <p class="project-excerpt">${item.description || '暂无描述'}</p>
                        <div class="project-meta">
                            <div class="project-date">${formatDate(item.createTime)}</div>
                            <a href="detail.html?id=${item.id}&type=1" class="read-more">查看详情</a>
                        </div>
                    </div>
                </div>
            `;
            container.append(projectHtml);
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
        loadProjects(page);
        // 滚动到页面顶部
        $('html, body').animate({ scrollTop: $('.project-list').offset().top - 120 }, 500);
    });

    // 初始加载
    loadProjects(1);
}); 