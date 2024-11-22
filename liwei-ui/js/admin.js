$(document).ready(function() {
    let currentPage = 1;
    const pageSize = 10;
    let currentType = '';
    let editor = null;

    // 初始化富文本编辑器
    const { createEditor, createToolbar } = window.wangEditor;
    editor = createEditor({
        selector: '#editor-container',
        html: '',
        config: {
            placeholder: '请输入内容...',
            MENU_CONF: {
                uploadImage: {
                    server: CONFIG.API_BASE_URL + '/business/upload',
                    fieldName: 'file',
                    maxFileSize: 10 * 1024 * 1024, // 10M
                    maxNumberOfFiles: 10,
                    allowedFileTypes: ['image/*'],
                    // 上传之前触发
                    onBeforeUpload(file) {
                        return file;
                    },
                    // 上传成功触发
                    onSuccess(file, res) {
                        console.log('上传图片成功', res);
                    },
                    // 上传失败触发
                    onFailed(file, res) {
                        console.log('上传图片失败', res);
                    },
                    // 上传错误触发
                    onError(file, err, res) {
                        console.error('上传图片错误', err, res);
                    },
                    // 自定义插入图片
                    customInsert(res, insertFn) {
                        if (res.code === 200) {
                            insertFn(CONFIG.API_BASE_URL + res.data);
                        } else {
                            console.error('插入图片失败', res);
                        }
                    }
                }
            }
        },
        mode: 'default'
    });

    const toolbar = createToolbar({
        editor,
        selector: '#editor-toolbar',
        config: {
            excludeKeys: []
        },
        mode: 'default'
    });

    // 加载数据列表
    function loadData(page) {
        $.ajax({
            url: CONFIG.API_BASE_URL + '/business/list',
            method: 'GET',
            data: {
                current: page,
                size: pageSize,
                type: currentType || null
            },
            success: function(response) {
                if (response.code === 200) {
                    renderData(response.data);
                    renderPagination(response.data);
                }
            },
            error: function(error) {
                console.error('获取数据失败:', error);
                $('#dataContainer').html(`
                    <div class="error-message">
                        <p>暂时无法加载数据，请稍后再试</p>
                    </div>
                `);
            }
        });
    }

    // 渲染数据列表
    function renderData(data) {
        const container = $('#dataContainer');
        container.empty();

        data.records.forEach(function(item) {
            const itemHtml = `
                <div class="data-item">
                    <div class="data-content">
                        <h3 class="data-title">${item.title}</h3>
                        <div class="data-info">
                            <span>类型：${getTypeName(item.type)}</span>
                            <span>时间：${formatDate(item.createTime)}</span>
                            <span>浏览：${item.checkNum || 0}</span>
                        </div>
                    </div>
                    <div class="data-actions">
                        <button class="edit-btn" onclick="editItem(${item.id})">编辑</button>
                        <button class="delete-btn" onclick="deleteItem(${item.id})">删除</button>
                    </div>
                </div>
            `;
            container.append(itemHtml);
        });
    }

    // 渲染分页
    function renderPagination(data) {
        const container = $('#paginationContainer');
        container.empty();

        const totalPages = data.pages;
        currentPage = data.current;

        if (currentPage > 1) {
            container.append(`<a href="#" data-page="${currentPage - 1}">< 上一页</a>`);
        }

        for (let i = 1; i <= totalPages; i++) {
            container.append(`
                <a href="#" data-page="${i}" ${i === currentPage ? 'class="active"' : ''}>
                    ${i}
                </a>
            `);
        }

        if (currentPage < totalPages) {
            container.append(`<a href="#" data-page="${currentPage + 1}">下一页 ></a>`);
        }
    }

    // 获取类型名称
    function getTypeName(type) {
        const types = {
            0: '新闻资讯',
            1: '项目公示',
            2: '案例展示'
        };
        return types[type] || '未知类型';
    }

    // 格式化日期
    function formatDate(dateString) {
        const date = new Date(dateString);
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    }

    // 显示添加模态框
    window.showAddModal = function() {
        $('#modalTitle').text('添加新内容');
        $('#editId').val('');
        $('#editForm')[0].reset();
        $('#editCreateTime').val(formatDateForInput(new Date()));
        editor.setHtml('');
        $('#editModal').show();
    }

    // 显示编辑模态框
    window.editItem = function(id) {
        $('#modalTitle').text('编辑内容');
        $.ajax({
            url: CONFIG.API_BASE_URL + `/business/${id}`,
            method: 'GET',
            success: function(response) {
                if (response.code === 200) {
                    const data = response.data;
                    $('#editId').val(data.id);
                    $('#editType').val(data.type);
                    $('#editTitle').val(data.title);
                    $('#editDescription').val(data.description);
                    $('#editAttachment').val(data.attachment || '');
                    if (data.createTime) {
                        const dateStr = data.createTime.replace(' ', 'T').substring(0, 16);
                        $('#editCreateTime').val(dateStr);
                    }
                    editor.setHtml(data.content || '');
                    $('#editModal').show();
                }
            }
        });
    }

    // 删除数据
    window.deleteItem = function(id) {
        if (confirm('确定要删除这条数据吗？')) {
            $.ajax({
                url: CONFIG.API_BASE_URL + `/business/${id}`,
                method: 'DELETE',
                success: function(response) {
                    if (response.code === 200) {
                        alert('删除成功');
                        loadData(currentPage);
                    } else {
                        alert('删除失败：' + response.message);
                    }
                }
            });
        }
    }

    // 表单提交
    $('#editForm').submit(function(e) {
        e.preventDefault();
        const id = $('#editId').val();
        const data = {
            type: parseInt($('#editType').val()),
            title: $('#editTitle').val(),
            description: $('#editDescription').val(),
            content: editor.getHtml(),
            attachment: $('#editAttachment').val(),
            createTime: $('#editCreateTime').val().replace('T', ' ') + ':00'
        };

        if (id) {
            data.id = parseInt(id);
        }

        // 处理图片上传
        const imageFile = $('#editImage')[0].files[0];
        if (imageFile) {
            const formData = new FormData();
            formData.append('file', imageFile);
            formData.append('type', 'image');

            $.ajax({
                url: CONFIG.API_BASE_URL + '/business/upload',
                method: 'POST',
                data: formData,
                processData: false,
                contentType: false,
                success: function(response) {
                    if (response.code === 200) {
                        data.image = response.data;
                        saveData(data);
                    } else {
                        alert('图片上传失败：' + response.message);
                    }
                }
            });
        } else {
            saveData(data);
        }
    });

    // 保存数据
    function saveData(data) {
        $.ajax({
            url: CONFIG.API_BASE_URL + '/business/' + (data.id ? 'update' : 'add'),
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(data),
            success: function(response) {
                if (response.code === 200) {
                    alert(data.id ? '更新成功' : '添加成功');
                    closeModal();
                    loadData(currentPage);
                } else {
                    alert((data.id ? '更新' : '添加') + '失败：' + response.message);
                }
            }
        });
    }

    // 类型筛选
    $('#typeFilter').change(function() {
        currentType = $(this).val();
        currentPage = 1;
        loadData(1);
    });

    // 分页点击事件
    $('#paginationContainer').on('click', 'a', function(e) {
        e.preventDefault();
        const page = $(this).data('page');
        loadData(page);
    });

    // 关闭模态框
    window.closeModal = function() {
        $('#editModal').hide();
    }

    // 初始加载
    loadData(1);
});

// 添加格式化时间函数
function formatDateForInput(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
} 