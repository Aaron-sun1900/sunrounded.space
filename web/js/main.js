/**
 * AI工具集网站主要JavaScript功能
 */

document.addEventListener('DOMContentLoaded', function() {
    // 初始化Bootstrap工具提示
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    if (tooltipTriggerList.length > 0) {
        var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
            return new bootstrap.Tooltip(tooltipTriggerEl);
        });
    }

    // 搜索功能
    const searchForm = document.querySelector('form[role="search"]');
    if (searchForm) {
        searchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const searchInput = this.querySelector('input[type="search"]');
            const searchValue = searchInput.value.trim();
            const searchType = this.querySelector('.dropdown-toggle').textContent.trim();
            
            if (searchValue.length > 0) {
                performSearch(searchValue, searchType);
            }
        });
    }

    // 设置搜索类型下拉菜单
    const searchTypeDropdown = document.querySelectorAll('.input-group .dropdown-item');
    if (searchTypeDropdown.length > 0) {
        searchTypeDropdown.forEach(item => {
            item.addEventListener('click', function(e) {
                e.preventDefault();
                const selectedType = this.textContent;
                const dropdownButton = document.querySelector('.input-group .dropdown-toggle');
                dropdownButton.textContent = selectedType;
            });
        });
    }

    // 切换深色/浅色模式
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            document.body.classList.toggle('dark-mode');
            const isDarkMode = document.body.classList.contains('dark-mode');
            localStorage.setItem('darkMode', isDarkMode);
            
            // 更新图标和文本
            const themeIcon = this.querySelector('i');
            const themeText = this.querySelector('small');
            
            if (isDarkMode) {
                themeIcon.classList.replace('bi-moon', 'bi-sun');
                if (themeText) themeText.textContent = '切换浅色模式';
            } else {
                themeIcon.classList.replace('bi-sun', 'bi-moon');
                if (themeText) themeText.textContent = '切换深色模式';
            }
        });
    }

    // 根据用户之前的设置应用深色/浅色模式
    const savedTheme = localStorage.getItem('darkMode');
    if (savedTheme === 'true') {
        document.body.classList.add('dark-mode');
        if (themeToggle) {
            const themeIcon = themeToggle.querySelector('i');
            const themeText = themeToggle.querySelector('small');
            
            if (themeIcon) themeIcon.classList.replace('bi-moon', 'bi-sun');
            if (themeText) themeText.textContent = '切换浅色模式';
        }
    }

    // 检测系统偏好设置
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    if (prefersDarkScheme.matches && savedTheme === null) {
        document.body.classList.add('dark-mode');
        localStorage.setItem('darkMode', 'true');
        
        if (themeToggle) {
            const themeIcon = themeToggle.querySelector('i');
            const themeText = themeToggle.querySelector('small');
            
            if (themeIcon) themeIcon.classList.replace('bi-moon', 'bi-sun');
            if (themeText) themeText.textContent = '切换浅色模式';
        }
    }

    // 懒加载图片
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    if ('IntersectionObserver' in window && lazyImages.length > 0) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const image = entry.target;
                    image.src = image.dataset.src;
                    image.classList.remove('lazy');
                    imageObserver.unobserve(image);
                }
            });
        });

        lazyImages.forEach(img => imageObserver.observe(img));
    } else if (lazyImages.length > 0) {
        // 回退方案
        lazyImages.forEach(img => {
            img.src = img.dataset.src;
        });
    }

    // 工具卡片点击跳转
    const toolCards = document.querySelectorAll('.tool-card');
    toolCards.forEach(card => {
        card.addEventListener('click', function(e) {
            // 如果点击的是卡片内的按钮，不执行跳转
            if (e.target.tagName === 'A' || e.target.tagName === 'BUTTON' || e.target.closest('a') || e.target.closest('button')) {
                return;
            }
            
            const toolLink = this.querySelector('a.btn');
            if (toolLink) {
                window.open(toolLink.href, '_blank');
            }
        });
    });

    // 新闻卡片点击跳转
    const newsCards = document.querySelectorAll('.news-card');
    newsCards.forEach(card => {
        card.addEventListener('click', function(e) {
            // 如果点击的是卡片内的按钮，不执行跳转
            if (e.target.tagName === 'A' || e.target.tagName === 'BUTTON' || e.target.closest('a') || e.target.closest('button')) {
                return;
            }
            
            const newsLink = this.querySelector('a.btn');
            if (newsLink) {
                window.location.href = newsLink.href;
            }
        });
    });

    // 分类卡片点击动画
    const categoryCards = document.querySelectorAll('.category-card');
    categoryCards.forEach(card => {
        card.addEventListener('mousedown', function() {
            this.style.transform = 'translateY(2px)';
        });
        
        card.addEventListener('mouseup', function() {
            this.style.transform = '';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = '';
        });
    });

    // 过滤功能
    setupFilterControls();
    
    // 返回顶部按钮
    setupBackToTop();
    
    // 初始化工具提示和弹出框
    initializeTooltipsAndPopovers();
    
    // 加载更多功能
    setupLoadMore();
    
    // 复制提示词功能
    setupCopyFunctionality();
});

/**
 * 执行搜索功能
 * @param {string} query - 搜索关键词
 * @param {string} type - 搜索类型（站内、Bing等）
 */
function performSearch(query, type) {
    // 根据搜索类型处理搜索请求
    switch(type) {
        case '站内':
            window.location.href = `/search?q=${encodeURIComponent(query)}`;
            break;
        case 'Bing':
            window.open(`https://www.bing.com/search?q=${encodeURIComponent(query)}`, '_blank');
            break;
        case '百度':
            window.open(`https://www.baidu.com/s?wd=${encodeURIComponent(query)}`, '_blank');
            break;
        case 'Google':
            window.open(`https://www.google.com/search?q=${encodeURIComponent(query)}`, '_blank');
            break;
        case 'Perplexity':
            window.open(`https://www.perplexity.ai/search?q=${encodeURIComponent(query)}`, '_blank');
            break;
        case 'YOU':
            window.open(`https://you.com/search?q=${encodeURIComponent(query)}`, '_blank');
            break;
        default:
            window.location.href = `/search?q=${encodeURIComponent(query)}`;
    }
}

/**
 * 设置工具过滤控件
 */
function setupFilterControls() {
    const filterControls = document.querySelectorAll('.filter-control');
    if (filterControls.length > 0) {
        filterControls.forEach(control => {
            control.addEventListener('change', function() {
                applyFilters();
            });
        });
    }
    
    // 标签点击过滤
    const filterTags = document.querySelectorAll('.filter-tag');
    if (filterTags.length > 0) {
        filterTags.forEach(tag => {
            tag.addEventListener('click', function(e) {
                e.preventDefault();
                const tagValue = this.dataset.tag;
                
                // 如果存在标签过滤器，则设置其值
                const tagFilter = document.querySelector('#tag-filter');
                if (tagFilter) {
                    tagFilter.value = tagValue;
                    applyFilters();
                } else {
                    // 否则直接跳转到带有标签参数的页面
                    window.location.href = `/tools?tag=${encodeURIComponent(tagValue)}`;
                }
            });
        });
    }
}

/**
 * 应用过滤条件
 */
function applyFilters() {
    const categoryFilter = document.querySelector('#category-filter')?.value || 'all';
    const priceFilter = document.querySelector('#price-filter')?.value || 'all';
    const tagFilter = document.querySelector('#tag-filter')?.value || 'all';
    const sortOrder = document.querySelector('#sort-order')?.value || 'popular';
    
    // 获取所有工具卡片
    const toolItems = document.querySelectorAll('.tool-item');
    
    toolItems.forEach(item => {
        const category = item.dataset.category;
        const pricing = item.dataset.pricing;
        const tags = item.dataset.tags ? item.dataset.tags.split(',') : [];
        let showItem = true;
        
        // 应用类别过滤
        if (categoryFilter !== 'all' && category !== categoryFilter) {
            showItem = false;
        }
        
        // 应用价格过滤
        if (priceFilter !== 'all') {
            if (priceFilter === 'free' && pricing !== 'free') {
                showItem = false;
            } else if (priceFilter === 'paid' && pricing !== 'paid') {
                showItem = false;
            }
        }
        
        // 应用标签过滤
        if (tagFilter !== 'all' && !tags.includes(tagFilter)) {
            showItem = false;
        }
        
        // 显示或隐藏项目
        item.style.display = showItem ? '' : 'none';
    });
    
    // 应用排序
    applySorting(sortOrder);
    
    // 更新URL以反映当前过滤器状态（可选）
    updateFilterUrl(categoryFilter, priceFilter, tagFilter, sortOrder);
}

/**
 * 更新URL以反映过滤器状态
 */
function updateFilterUrl(category, price, tag, sort) {
    const url = new URL(window.location.href);
    
    if (category && category !== 'all') url.searchParams.set('category', category);
    else url.searchParams.delete('category');
    
    if (price && price !== 'all') url.searchParams.set('price', price);
    else url.searchParams.delete('price');
    
    if (tag && tag !== 'all') url.searchParams.set('tag', tag);
    else url.searchParams.delete('tag');
    
    if (sort && sort !== 'popular') url.searchParams.set('sort', sort);
    else url.searchParams.delete('sort');
    
    window.history.replaceState({}, '', url);
}

/**
 * 应用排序
 * @param {string} sortOrder - 排序方式
 */
function applySorting(sortOrder) {
    const toolContainer = document.querySelector('.tool-container');
    if (!toolContainer) return;
    
    const toolItems = Array.from(document.querySelectorAll('.tool-item'));
    const visibleItems = toolItems.filter(item => item.style.display !== 'none');
    
    visibleItems.sort((a, b) => {
        switch(sortOrder) {
            case 'popular':
                return parseInt(b.dataset.views || 0) - parseInt(a.dataset.views || 0);
            case 'newest':
                return new Date(b.dataset.date || 0) - new Date(a.dataset.date || 0);
            case 'rating':
                return parseFloat(b.dataset.rating || 0) - parseFloat(a.dataset.rating || 0);
            case 'name-asc':
                return (a.dataset.name || '').localeCompare(b.dataset.name || '');
            case 'name-desc':
                return (b.dataset.name || '').localeCompare(a.dataset.name || '');
            default:
                return 0;
        }
    });
    
    // 重新添加排序后的项目
    visibleItems.forEach(item => toolContainer.appendChild(item));
}

/**
 * 设置返回顶部按钮
 */
function setupBackToTop() {
    // 创建按钮
    const backToTop = document.createElement('button');
    backToTop.classList.add('back-to-top', 'btn', 'btn-primary');
    backToTop.innerHTML = '<i class="bi bi-arrow-up"></i>';
    backToTop.setAttribute('title', '返回顶部');
    backToTop.style.position = 'fixed';
    backToTop.style.bottom = '20px';
    backToTop.style.right = '20px';
    backToTop.style.display = 'none';
    backToTop.style.zIndex = '1000';
    document.body.appendChild(backToTop);
    
    // 点击事件
    backToTop.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // 滚动监听
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            backToTop.style.display = 'block';
        } else {
            backToTop.style.display = 'none';
        }
    });
}

/**
 * 初始化Bootstrap工具提示和弹出框
 */
function initializeTooltipsAndPopovers() {
    // 工具提示
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    if (tooltipTriggerList.length > 0) {
        tooltipTriggerList.map(function (tooltipTriggerEl) {
            return new bootstrap.Tooltip(tooltipTriggerEl);
        });
    }
    
    // 弹出框
    var popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
    if (popoverTriggerList.length > 0) {
        popoverTriggerList.map(function (popoverTriggerEl) {
            return new bootstrap.Popover(popoverTriggerEl);
        });
    }
}

/**
 * 设置加载更多功能
 */
function setupLoadMore() {
    const loadMoreBtn = document.querySelector('.load-more-btn');
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', function() {
            // 获取当前页码和总页数
            const currentPage = parseInt(this.dataset.page) || 1;
            const totalPages = parseInt(this.dataset.totalPages) || 1;
            const loadType = this.dataset.loadType || 'tools';
            
            // 如果还有更多页面
            if (currentPage < totalPages) {
                // 显示加载中状态
                this.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>加载中...';
                this.disabled = true;
                
                // 发送AJAX请求获取更多数据
                fetch(`/api/${loadType}?page=${currentPage + 1}`)
                    .then(response => response.json())
                    .then(data => {
                        // 获取容器并添加新内容
                        const container = document.querySelector(`.${loadType}-container`);
                        
                        if (container && data.items && data.items.length > 0) {
                            // 根据类型添加不同的HTML内容
                            data.items.forEach(item => {
                                let html = '';
                                
                                if (loadType === 'tools') {
                                    // 工具卡片HTML
                                    html = createToolCardHtml(item);
                                } else if (loadType === 'news') {
                                    // 新闻卡片HTML
                                    html = createNewsCardHtml(item);
                                }
                                
                                const div = document.createElement('div');
                                div.className = 'col';
                                div.innerHTML = html;
                                container.appendChild(div);
                            });
                            
                            // 更新按钮状态
                            this.dataset.page = currentPage + 1;
                            this.innerHTML = '加载更多';
                            this.disabled = false;
                            
                            // 如果到达最后一页，隐藏按钮
                            if (currentPage + 1 >= totalPages) {
                                this.style.display = 'none';
                            }
                            
                            // 重新初始化工具提示
                            initializeTooltipsAndPopovers();
                        } else {
                            // 如果没有更多数据，隐藏按钮
                            this.style.display = 'none';
                        }
                    })
                    .catch(error => {
                        console.error('Error loading more items:', error);
                        this.innerHTML = '加载更多';
                        this.disabled = false;
                    });
            }
        });
    }
}

/**
 * 创建工具卡片HTML
 */
function createToolCardHtml(tool) {
    return `
    <div class="card h-100 tool-card">
        <div class="card-body">
            <div class="d-flex align-items-center mb-3">
                <img src="${tool.logo || 'img/default-tool.png'}" alt="${tool.name}" class="tool-logo me-3" width="48" height="48">
                <div>
                    <h5 class="card-title mb-0">${tool.name}</h5>
                    <span class="badge bg-primary">${tool.category}</span>
                </div>
            </div>
            <p class="card-text">${tool.description}</p>
            <div class="d-flex justify-content-between mt-3">
                <a href="${tool.website}" target="_blank" class="btn btn-outline-primary btn-sm">访问官网</a>
                <div class="tool-meta">
                    <span class="text-muted"><i class="bi bi-eye"></i> ${tool.views || 0}</span>
                    <span class="text-muted ms-2"><i class="bi bi-star"></i> ${tool.rating || '0.0'}</span>
                    ${tool.isNew ? '<span class="badge bg-danger ms-2">New</span>' : ''}
                </div>
            </div>
        </div>
    </div>
    `;
}

/**
 * 创建新闻卡片HTML
 */
function createNewsCardHtml(news) {
    return `
    <div class="card h-100 news-card">
        <img src="${news.image || 'img/default-news.jpg'}" class="card-img-top" alt="${news.title}">
        <div class="card-body">
            <h5 class="card-title">${news.title}</h5>
            <p class="card-text">${news.summary}</p>
            <div class="d-flex justify-content-between align-items-center mt-3">
                <small class="text-muted">${news.date}</small>
                <a href="${news.url}" class="btn btn-outline-secondary btn-sm">阅读更多</a>
            </div>
        </div>
    </div>
    `;
}

/**
 * 设置复制功能
 */
function setupCopyFunctionality() {
    const copyButtons = document.querySelectorAll('.copy-btn');
    if (copyButtons.length > 0) {
        copyButtons.forEach(button => {
            button.addEventListener('click', function() {
                const textToCopy = this.dataset.copyText || this.previousElementSibling?.textContent || '';
                
                if (textToCopy) {
                    navigator.clipboard.writeText(textToCopy).then(() => {
                        // 成功复制后改变按钮文本和样式
                        const originalText = this.innerHTML;
                        this.innerHTML = '<i class="bi bi-check"></i> 已复制';
                        this.classList.add('btn-success');
                        this.classList.remove('btn-outline-secondary');
                        
                        // 2秒后恢复原始状态
                        setTimeout(() => {
                            this.innerHTML = originalText;
                            this.classList.remove('btn-success');
                            this.classList.add('btn-outline-secondary');
                        }, 2000);
                    }).catch(err => {
                        console.error('复制失败:', err);
                    });
                }
            });
        });
    }
} 