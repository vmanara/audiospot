
// Blog page functionality
document.addEventListener('DOMContentLoaded', function() {
    loadAllPosts();
});

async function loadAllPosts() {
    try {
        const response = await fetch('posts.json');
        const posts = await response.json();
        
        const postsGrid = document.getElementById('posts-grid');
        
        if (posts.length === 0) {
            postsGrid.innerHTML = '<div class="loading">Nenhum post encontrado.</div>';
            return;
        }
        
        postsGrid.innerHTML = posts.map(post => createPostCard(post)).join('');
        
    } catch (error) {
        console.error('Erro ao carregar posts:', error);
        document.getElementById('posts-grid').innerHTML = 
            '<div class="loading">Erro ao carregar posts.</div>';
    }
}

function createPostCard(post) {
    const formattedDate = formatDate(post.date);
    
    return `
        <a href="post.html?slug=${post.slug}" class="post-card">
            <img src="${post.image || 'https://via.placeholder.com/400x200?text=No+Image'}" 
                 alt="${post.title}" class="post-image" 
                 onerror="this.src='https://via.placeholder.com/400x200?text=No+Image'">
            <div class="post-content">
                <h3 class="post-title">${post.title}</h3>
                <div class="post-date">${formattedDate}</div>
                <p class="post-excerpt">${post.excerpt}</p>
            </div>
        </a>
    `;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}
