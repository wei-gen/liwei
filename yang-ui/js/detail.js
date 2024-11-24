$(document).ready(function() {
    // 获取URL参数
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    const type = urlParams.get('type') || '';

    // 设置页面标题和面包屑
    function setPageInfo(data) {
        const typeNames = {
            '0': '新闻资讯',
            '1': '项目公示',
            '2': '案例展示'
        };
        const typeName = typeNames[data.type] || '详情';
        
        document.title = `${data.title} - 深圳市涟漪环保科技有限公司`;
        $('#pageTitle').text(typeName);
        $('#breadcrumb').html(`
            <a href="index.html">首页</a> > 
            <a href="${getTypeUrl(data.type)}">${typeName}</a> > 
            <span>详情</span>
        `);
    }

    // 获取类型对应的页面URL
    function getTypeUrl(type) {
        const urls = {
            '0': 'news.html',
            '1': 'projects.html',
            '2': 'cases.html'
        };
        return urls[type] || 'index.html';
    }

    // 加载详情数据
    function loadDetail() {
        if (!id) {
            showError('未找到相关内容');
            return;
        }

        $.ajax({
            url: CONFIG.API_BASE_URL + `/business/${id}`,
            method: 'GET',
            success: function(response) {
                if (response.code === 200) {
                    renderDetail(response.data);
                } else {
                    showError('加载失败：' + response.message);
                }
            },
            error: function(error) {
                console.error('获取详情失败:', error);
                showError('加载失败，请稍后再试');
            }
        });
    }

    // 渲染详情内容
    function renderDetail(data) {
        setPageInfo(data);
        
        $('#articleTitle').text(data.title);
        $('#articleDate').text(formatDate(data.createTime));
        $('#articleViews').text(data.checkNum || 0);
        $('#articleContent').html(data.content || '');

        // 处理附件下载按钮
        if (data.attachment) {
            const $downloadBtn = $('#downloadBtn');
            $downloadBtn.show().find('a').attr('href', data.attachment);
        }
    }

    // 显示错误信息
    function showError(message) {
        $('.detail-article').html(`
            <div class="error-message">
                <p>${message}</p>
                <p><a href="javascript:history.back()">返回上一页</a></p>
            </div>
        `);
    }

    // 格式化日期
    function formatDate(dateString) {
        const date = new Date(dateString);
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    }

    // 初始加载
    loadDetail();
}); 