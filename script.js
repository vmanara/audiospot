
// Homepage functionality
document.addEventListener('DOMContentLoaded', function() {
    loadLatestPosts();
});

async function loadLatestPosts() {
    try {
        const response = await fetch('posts.json');
        const posts = await response.json();
        
        // Show only the 3 most recent posts on homepage
        const latestPosts = posts.slice(0, 3);
        
        const postsGrid = document.getElementById('latest-posts-grid');
        
        if (latestPosts.length === 0) {
            postsGrid.innerHTML = '<div class="loading">Nenhum post encontrado.</div>';
            return;
        }
        
        postsGrid.innerHTML = latestPosts.map(post => createPostCard(post)).join('');
        
    } catch (error) {
        console.error('Erro ao carregar posts:', error);
        document.getElementById('latest-posts-grid').innerHTML = 
            '<div class="loading">Erro ao carregar posts.</div>';
    }
}

// Newsletter functionality
document.addEventListener('DOMContentLoaded', function() {
    const newsletterForms = document.querySelectorAll('.newsletter-form');
    
    newsletterForms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = form.querySelector('input[type="email"]').value;
            
            // Simulate newsletter signup
            if (email) {
                alert('Obrigado! Você receberá nossas melhores ofertas em: ' + email);
                form.reset();
            }
        });
    });
});

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
