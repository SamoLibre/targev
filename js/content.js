// TARGEV Content Manager
// Bu dosya JSON verilerini fetch edip sayfalara render eder

const ContentManager = {
    // Data cache
    cache: {
        slides: null,
        news: null,
        projects: null
    },

    // Fetch data from JSON files
    async fetchData(type) {
        if (this.cache[type]) return this.cache[type];
        
        try {
            const response = await fetch(`/data/${type}.json?t=${Date.now()}`);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const data = await response.json();
            this.cache[type] = data[type];
            return data[type];
        } catch (error) {
            console.error(`Error fetching ${type}:`, error);
            return [];
        }
    },

    // Format date
    formatDate(dateStr) {
        if (!dateStr) return '';
        const date = new Date(dateStr);
        const options = { day: 'numeric', month: 'long', year: 'numeric' };
        return date.toLocaleDateString('tr-TR', options);
    },

    // ========================================
    // SLIDER RENDERER
    // ========================================
    async renderSlider(containerId) {
        const slides = await this.fetchData('slides');
        const container = document.getElementById(containerId);
        if (!container || !slides.length) return;

        let slidesHTML = '';
        let dotsHTML = '';

        slides.forEach((slide, index) => {
            const isActive = index === 0 ? 'active' : '';
            
            // Visual content based on imageType
            let visualHTML = '';
            if (slide.imageType === 'single') {
                visualHTML = `
                    <div class="slide-icon">
                        <img src="${slide.image}" alt="${slide.title}">
                    </div>`;
            } else if (slide.imageType === 'grid' && slide.images) {
                visualHTML = `
                    <div class="slide-collage">
                        <div class="main-image">
                            <img src="${slide.images[0]}" alt="${slide.title}">
                        </div>
                        ${slide.images.slice(1, 4).map(img => `
                            <div class="side-image">
                                <img src="${img}" alt="${slide.title}">
                            </div>
                        `).join('')}
                    </div>`;
            } else if (slide.imageType === 'video' && slide.video) {
                visualHTML = `
                    <div class="slide-video-container">
                        <video autoplay muted loop playsinline>
                            <source src="${slide.video}" type="video/mp4">
                        </video>
                    </div>`;
            }

            slidesHTML += `
                <div class="slide slide-${index + 1} ${isActive}">
                    <div class="slide-bg"></div>
                    <div class="slide-overlay"></div>
                    <div class="slide-content">
                        <div class="slide-text">
                            <h2>${slide.title}</h2>
                            <p>${slide.description}</p>
                            <div class="slide-meta">
                                <span>📅 ${slide.date}</span>
                                <span>🏷️ ${slide.category}</span>
                            </div>
                            <a href="${slide.link}" class="btn btn-primary">Detayları Gör</a>
                        </div>
                        <div class="slide-visual">
                            ${visualHTML}
                        </div>
                    </div>
                </div>`;

            dotsHTML += `<div class="slider-dot ${isActive}" data-slide="${index}"></div>`;
        });

        container.innerHTML = slidesHTML;
        
        // Update dots
        const dotsContainer = document.getElementById('slider-nav-v1');
        if (dotsContainer) {
            dotsContainer.innerHTML = dotsHTML;
        }

        // Initialize slider after render
        this.initSlider();
    },

    // Initialize slider functionality
    initSlider() {
        const slides = document.querySelectorAll('#slider-v1 .slide');
        const dots = document.querySelectorAll('#slider-nav-v1 .slider-dot');
        const prevBtn = document.querySelector('#prev-v1');
        const nextBtn = document.querySelector('#next-v1');
        
        if (!slides.length) return;
        
        let currentSlide = 0;

        function goToSlide(index) {
            slides.forEach(slide => slide.classList.remove('active'));
            dots.forEach(dot => dot.classList.remove('active'));
            
            slides[index].classList.add('active');
            if (dots[index]) dots[index].classList.add('active');
            
            currentSlide = index;
        }

        function nextSlide() {
            const next = (currentSlide + 1) % slides.length;
            goToSlide(next);
        }

        function prevSlide() {
            const prev = (currentSlide - 1 + slides.length) % slides.length;
            goToSlide(prev);
        }

        // Event listeners
        if (prevBtn) prevBtn.addEventListener('click', prevSlide);
        if (nextBtn) nextBtn.addEventListener('click', nextSlide);

        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => goToSlide(index));
        });

        // Touch/Swipe support
        const sliderContainer = document.querySelector('.hero-slider');
        if (sliderContainer) {
            let touchStartX = 0;
            let touchEndX = 0;

            sliderContainer.addEventListener('touchstart', (e) => {
                touchStartX = e.changedTouches[0].screenX;
            });

            sliderContainer.addEventListener('touchend', (e) => {
                touchEndX = e.changedTouches[0].screenX;
                const diff = touchStartX - touchEndX;
                if (Math.abs(diff) > 50) {
                    if (diff > 0) nextSlide();
                    else prevSlide();
                }
            });
        }
    },

    // ========================================
    // NEWS RENDERER
    // ========================================
    async renderNews(containerId, limit = null) {
        const news = await this.fetchData('news');
        const container = document.getElementById(containerId);
        if (!container || !news.length) return;

        // Sort by date (newest first)
        let sortedNews = [...news].sort((a, b) => new Date(b.date) - new Date(a.date));

        // Limit results
        if (limit) {
            sortedNews = sortedNews.slice(0, limit);
        }

        const html = sortedNews.map(item => `
            <div class="news-card" data-id="${item.id}">
                <div class="news-image">
                    ${item.image ? `<img src="${item.image}" alt="${item.title}">` : '📰'}
                </div>
                <div class="news-content">
                    <span class="news-date">${this.formatDate(item.date)}</span>
                    <h3>${item.title}</h3>
                    <p>${item.summary}</p>
                    <a href="haberler.html#haber-${item.id}" class="news-link">Devamını Oku →</a>
                </div>
            </div>
        `).join('');

        container.innerHTML = html;
    },

    // ========================================
    // PROJECTS RENDERER
    // ========================================
    async renderProjects(containerId, limit = null) {
        const projects = await this.fetchData('projects');
        const container = document.getElementById(containerId);
        if (!container || !projects.length) return;

        let filteredProjects = [...projects];

        // Limit results
        if (limit) {
            filteredProjects = filteredProjects.slice(0, limit);
        }

        const html = filteredProjects.map(item => `
            <div class="project-card" data-id="${item.id}">
                <div class="project-image">
                    ${item.image ? `<img src="${item.image}" alt="${item.title}">` : '📚'}
                </div>
                <div class="project-content">
                    <span class="project-tag">${item.category}</span>
                    <h3>${item.title}</h3>
                    <p>${item.summary}</p>
                </div>
            </div>
        `).join('');

        container.innerHTML = html;
    },

    // ========================================
    // FULL NEWS PAGE RENDERER
    // ========================================
    async renderNewsPage(containerId) {
        const news = await this.fetchData('news');
        const container = document.getElementById(containerId);
        if (!container || !news.length) return;

        // Sort by date (newest first)
        const sortedNews = [...news].sort((a, b) => new Date(b.date) - new Date(a.date));

        const html = sortedNews.map(item => `
            <article class="news-article" id="haber-${item.id}">
                <div class="news-article-image">
                    ${item.image ? `<img src="${item.image}" alt="${item.title}">` : ''}
                </div>
                <div class="news-article-content">
                    <div class="news-meta">
                        <span class="news-category">${item.category}</span>
                        <span class="news-date">${this.formatDate(item.date)}</span>
                    </div>
                    <h2>${item.title}</h2>
                    <p>${item.content}</p>
                </div>
            </article>
        `).join('');

        container.innerHTML = html;
    },

    // ========================================
    // FULL PROJECTS PAGE RENDERER
    // ========================================
    async renderProjectsPage(containerId) {
        const projects = await this.fetchData('projects');
        const container = document.getElementById(containerId);
        if (!container || !projects.length) return;

        const html = projects.map(item => `
            <article class="project-article" id="proje-${item.id}">
                <div class="project-article-image">
                    ${item.image ? `<img src="${item.image}" alt="${item.title}">` : ''}
                </div>
                <div class="project-article-content">
                    <div class="project-meta">
                        <span class="project-category">${item.category}</span>
                        <span class="project-status status-${item.status?.toLowerCase().replace(' ', '-')}">${item.status}</span>
                    </div>
                    <h2>${item.title}</h2>
                    <p>${item.content}</p>
                </div>
            </article>
        `).join('');

        container.innerHTML = html;
    }
};

// Export for use
window.ContentManager = ContentManager;
