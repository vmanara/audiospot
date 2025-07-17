// Main application script
class BlogApp {
  constructor() {
    this.posts = [];
    this.currentFilter = 'all';
    this.init();
  }

  async init() {
    this.bindEvents();
    await this.loadPosts();
    this.renderContent();
  }

  bindEvents() {
    // Filter buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.handleFilterChange(e.target.dataset.filter);
      });
    });

    // Post card clicks
    document.addEventListener('click', (e) => {
      const postCard = e.target.closest('.post-card');
      if (postCard) {
        const slug = postCard.dataset.slug;
        if (slug) {
          window.location.href = `post.html?slug=${slug}`;
        }
      }
    });

    // Share buttons
    this.bindShareButtons();
  }

  bindShareButtons() {
    document.querySelectorAll('.whatsapp-share').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const url = encodeURIComponent(window.location.href);
        const text = encodeURIComponent(document.title);
        window.open(`https://wa.me/?text=${text}%20${url}`, '_blank');
      });
    });

    document.querySelectorAll('.telegram-share').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const url = encodeURIComponent(window.location.href);
        const text = encodeURIComponent(document.title);
        window.open(`https://t.me/share/url?url=${url}&text=${text}`, '_blank');
      });
    });
  }

  async loadPosts() {
    try {
      const response = await fetch('posts.json');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      this.posts = data.posts || [];
    } catch (error) {
      console.error('Error loading posts:', error);
      this.showError('Erro ao carregar posts. Verifique sua conexão e tente novamente.');
    }
  }

  handleFilterChange(filter) {
    this.currentFilter = filter;
    
    // Update active filter button
    document.querySelectorAll('.filter-btn').forEach(btn => {
      btn.classList.remove('active');
    });
    document.querySelector(`[data-filter="${filter}"]`).classList.add('active');
    
    this.renderPosts();
  }

  renderContent() {
    const path = window.location.pathname;
    
    if (path.includes('blog.html')) {
      this.renderBlogPage();
    } else if (path.includes('post.html')) {
      this.renderPostPage();
    } else {
      this.renderHomePage();
    }
  }

  renderHomePage() {
    // Render hero post and secondary posts
    this.renderFeaturedPosts();
    
    // Render categories with counts
    this.renderCategories();
    
    // Load YouTube videos
    this.loadYouTubeVideos();
  }

  renderFeaturedPosts() {
    const heroPostContainer = document.getElementById('hero-post');
    const secondaryPostsContainer = document.getElementById('secondary-posts');
    
    if (heroPostContainer && secondaryPostsContainer && this.posts.length > 0) {
      // Main hero post (first post)
      const heroPost = this.posts[0];
      heroPostContainer.innerHTML = this.createHeroPost(heroPost);
      
      // Secondary posts (next 2 posts)
      const secondaryPosts = this.posts.slice(1, 3);
      secondaryPostsContainer.innerHTML = secondaryPosts.map(post => this.createSecondaryPost(post)).join('');
      
      // Add click handlers
      heroPostContainer.addEventListener('click', () => {
        window.location.href = `post.html?slug=${heroPost.slug}`;
      });
      
      secondaryPostsContainer.querySelectorAll('.secondary-post').forEach((element, index) => {
        element.addEventListener('click', () => {
          window.location.href = `post.html?slug=${secondaryPosts[index].slug}`;
        });
      });
    }
  }

  renderCategories() {
    const categories = ['review', 'news', 'tutorial', 'comparison'];
    
    categories.forEach(category => {
      const count = this.posts.filter(post => post.category === category).length;
      const countElement = document.getElementById(`${category}-count`);
      if (countElement) {
        countElement.textContent = count;
      }
    });

    // Add click handlers to category cards
    document.querySelectorAll('.category-card').forEach(card => {
      card.addEventListener('click', () => {
        const category = card.dataset.category;
        window.location.href = `blog.html?filter=${category}`;
      });
    });
  }

  createHeroPost(post) {
    return `
      <img src="${post.image}" alt="${post.title}" class="hero-post-image" onerror="this.style.display='none'">
      <div class="hero-post-content">
        <div class="hero-post-category">${this.getCategoryName(post.category)}</div>
        <h2 class="hero-post-title">${post.title}</h2>
        <p class="hero-post-excerpt">${post.excerpt}</p>
        <div class="hero-post-meta">
          <span class="hero-post-date">${this.formatDate(post.date)}</span>
          <span class="hero-post-author">Por ${post.author}</span>
        </div>
      </div>
    `;
  }

  createSecondaryPost(post) {
    return `
      <div class="secondary-post" data-slug="${post.slug}">
        <h3 class="secondary-post-title">${post.title}</h3>
        <p class="secondary-post-excerpt">${post.excerpt.substring(0, 120)}...</p>
        <div class="secondary-post-meta">
          <span class="secondary-post-category">${this.getCategoryName(post.category)}</span>
          <span class="secondary-post-date">${this.formatDate(post.date)}</span>
        </div>
      </div>
    `;
  }

  loadYouTubeVideos() {
    const youtubeContainer = document.getElementById('youtube-videos');
    if (!youtubeContainer) return;

    // Sample YouTube videos data - in real implementation, this would come from YouTube API
    const youtubeVideos = [
      {
        id: 'dQw4w9WgXcQ',
        title: 'Review: Melhores Fones de Ouvido 2025',
        description: 'Análise completa dos melhores fones de ouvido do mercado, incluindo testes de qualidade de som, conforto e durabilidade.',
        thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
        duration: '12:34',
        publishedAt: '2025-01-15'
      },
      {
        id: 'jNQXAC9IVRw',
        title: 'Top 5 Gadgets de Áudio para Casa',
        description: 'Descubra os melhores gadgets de áudio para transformar sua casa em um ambiente sonoro perfeito.',
        thumbnail: 'https://img.youtube.com/vi/jNQXAC9IVRw/maxresdefault.jpg',
        duration: '8:45',
        publishedAt: '2025-01-10'
      },
      {
        id: 'y8Kyi0WNg40',
        title: 'Como Escolher o Melhor Smartphone',
        description: 'Guia completo para escolher o smartphone perfeito para suas necessidades, com foco em qualidade de áudio e câmera.',
        thumbnail: 'https://img.youtube.com/vi/y8Kyi0WNg40/maxresdefault.jpg',
        duration: '15:22',
        publishedAt: '2025-01-05'
      }
    ];

    youtubeContainer.innerHTML = youtubeVideos.map(video => this.createYouTubeCard(video)).join('');

    // Bind click events to YouTube videos
    document.querySelectorAll('.youtube-video').forEach(videoCard => {
      videoCard.addEventListener('click', () => {
        const videoId = videoCard.dataset.videoId;
        window.open(`https://www.youtube.com/watch?v=${videoId}`, '_blank');
      });
    });
  }

  createYouTubeCard(video) {
    return `
      <div class="youtube-video" data-video-id="${video.id}">
        <div class="youtube-thumbnail">
          <img src="${video.thumbnail}" alt="${video.title}" onerror="this.src='https://via.placeholder.com/300x200/f8f9fa/6c757d?text=Video'">
          <div class="youtube-play-button">
            <svg viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z"/>
            </svg>
          </div>
          <div class="youtube-video-duration">${video.duration}</div>
        </div>
        <div class="youtube-video-content">
          <h4 class="youtube-video-title">${video.title}</h4>
          <p class="youtube-video-description">${video.description}</p>
          <div class="youtube-video-meta">
            <span class="youtube-video-date">${this.formatDate(video.publishedAt)}</span>
          </div>
        </div>
      </div>
    `;
  }

  renderBlogPage() {
    this.hideLoading();
    
    // Check for filter parameter in URL
    const urlParams = new URLSearchParams(window.location.search);
    const filterParam = urlParams.get('filter');
    
    if (filterParam && ['review', 'news', 'tutorial', 'comparison'].includes(filterParam)) {
      this.currentFilter = filterParam;
      
      // Update active filter button
      document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
      });
      const activeBtn = document.querySelector(`[data-filter="${filterParam}"]`);
      if (activeBtn) {
        activeBtn.classList.add('active');
      }
    }
    
    this.renderPosts();
  }

  renderPosts() {
    const postsContainer = document.getElementById('posts-grid');
    if (!postsContainer) return;

    const filteredPosts = this.currentFilter === 'all' 
      ? this.posts 
      : this.posts.filter(post => post.category === this.currentFilter);

    if (filteredPosts.length === 0) {
      this.showEmptyState();
      return;
    }

    this.hideStates();
    postsContainer.innerHTML = filteredPosts.map(post => this.createPostCard(post)).join('');
  }

  async renderPostPage() {
    const urlParams = new URLSearchParams(window.location.search);
    const slug = urlParams.get('slug');
    
    if (!slug) {
      this.showError('Post não encontrado.');
      return;
    }

    try {
      const post = this.posts.find(p => p.slug === slug);
      if (!post) {
        throw new Error('Post not found');
      }

      // Load markdown content
      const markdownResponse = await fetch(`content/posts/${slug}.md`);
      if (!markdownResponse.ok) {
        throw new Error('Markdown file not found');
      }
      
      const markdownContent = await markdownResponse.text();
      
      this.hideLoading();
      this.renderPostContent(post, markdownContent);
      
    } catch (error) {
      console.error('Error loading post:', error);
      this.showError('Post não encontrado ou erro ao carregar conteúdo.');
    }
  }

  renderPostContent(post, markdownContent) {
    // Update page title and meta
    document.title = `${post.title} - AudioSPOT`;
    this.updateMetaTags(post);

    // Render post header
    const postHeader = document.getElementById('post-header');
    if (postHeader) {
      postHeader.innerHTML = `
        <img src="${post.image}" alt="${post.title}" class="post-header-image" onerror="this.style.display='none'">
        <div class="post-header-category">${this.getCategoryName(post.category)}</div>
        <h1 class="post-header-title">${post.title}</h1>
        <div class="post-header-meta">
          <span class="post-date">${this.formatDate(post.date)}</span>
          <span class="post-author">${post.author}</span>
        </div>
      `;
    }

    // Render post content
    const postContent = document.getElementById('post-content');
    if (postContent && typeof marked !== 'undefined') {
      postContent.innerHTML = marked.parse(markdownContent);
    } else {
      postContent.innerHTML = `<p>Erro ao carregar conteúdo do post.</p>`;
    }

    // Show post container
    document.querySelector('.post-container').style.display = 'block';
  }

  updateMetaTags(post) {
    const metaTags = [
      { selector: '#post-description', attr: 'content', value: post.excerpt },
      { selector: '#og-title', attr: 'content', value: post.title },
      { selector: '#og-description', attr: 'content', value: post.excerpt },
      { selector: '#og-image', attr: 'content', value: post.image }
    ];

    metaTags.forEach(tag => {
      const element = document.querySelector(tag.selector);
      if (element) {
        element.setAttribute(tag.attr, tag.value);
      }
    });
  }

  createPostCard(post) {
    return `
      <article class="post-card" data-slug="${post.slug}">
        <img src="${post.image}" alt="${post.title}" class="post-card-image" onerror="this.style.display='none'">
        <div class="post-card-content">
          <div class="post-card-category">${this.getCategoryName(post.category)}</div>
          <h3 class="post-card-title">${post.title}</h3>
          <p class="post-card-excerpt">${post.excerpt}</p>
          <div class="post-card-meta">
            <span class="post-card-date">${this.formatDate(post.date)}</span>
            <span class="post-card-author">${post.author}</span>
          </div>
        </div>
      </article>
    `;
  }

  getCategoryName(category) {
    const categories = {
      'review': 'Review',
      'news': 'Notícia',
      'tutorial': 'Tutorial',
      'comparison': 'Comparação'
    };
    return categories[category] || category;
  }

  formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  getCategoryName(category) {
    const categoryNames = {
      'review': 'Review',
      'news': 'Notícias',
      'tutorial': 'Tutorial',
      'comparison': 'Comparação'
    };
    return categoryNames[category] || category;
  }

  showLoading() {
    this.hideStates();
    const loading = document.getElementById('loading');
    if (loading) loading.style.display = 'block';
  }

  hideLoading() {
    const loading = document.getElementById('loading');
    if (loading) loading.style.display = 'none';
  }

  showEmptyState() {
    this.hideStates();
    const emptyState = document.getElementById('empty-state');
    if (emptyState) emptyState.style.display = 'block';
  }

  showError(message) {
    this.hideStates();
    const errorState = document.getElementById('error-state');
    if (errorState) {
      errorState.style.display = 'block';
      const errorMessage = errorState.querySelector('p');
      if (errorMessage) errorMessage.textContent = message;
    }
  }

  hideStates() {
    const states = ['loading', 'empty-state', 'error-state'];
    states.forEach(stateId => {
      const element = document.getElementById(stateId);
      if (element) element.style.display = 'none';
    });
  }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new BlogApp();
});

// Layout and color variations
class LayoutVariations {
  static applyVariation(variationNumber) {
    document.body.classList.remove('layout-variation-1', 'layout-variation-2', 'layout-variation-3');
    if (variationNumber > 0) {
      document.body.classList.add(`layout-variation-${variationNumber}`);
    }
  }

  static applyColorPalette(paletteNumber) {
    document.body.classList.remove('color-palette-1', 'color-palette-2');
    if (paletteNumber > 0) {
      document.body.classList.add(`color-palette-${paletteNumber}`);
    }
  }
}

// Expose variations for testing
window.LayoutVariations = LayoutVariations;

// Service Worker registration for offline support (disabled for now)
// if ('serviceWorker' in navigator) {
//   window.addEventListener('load', () => {
//     navigator.serviceWorker.register('/sw.js')
//       .then(registration => {
//         console.log('SW registered: ', registration);
//       })
//       .catch(registrationError => {
//         console.log('SW registration failed: ', registrationError);
//       });
//   });
// }
