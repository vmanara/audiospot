
// Single post page functionality
document.addEventListener('DOMContentLoaded', function() {
    loadPost();
});

async function loadPost() {
    const urlParams = new URLSearchParams(window.location.search);
    const slug = urlParams.get('slug');
    
    if (!slug) {
        showError('Post não encontrado');
        return;
    }
    
    try {
        // Load post metadata from posts.json
        const postsResponse = await fetch('posts.json');
        const posts = await postsResponse.json();
        const post = posts.find(p => p.slug === slug);
        
        if (!post) {
            showError('Post não encontrado');
            return;
        }
        
        // Update page metadata
        document.getElementById('post-title').textContent = post.title + ' - Reviews e Ofertas';
        document.getElementById('post-heading').textContent = post.title;
        document.getElementById('post-date').textContent = formatDate(post.date);
        
        // Load markdown content
        const contentResponse = await fetch(`content/posts/${slug}.md`);
        if (!contentResponse.ok) {
            throw new Error('Conteúdo não encontrado');
        }
        
        const markdown = await contentResponse.text();
        const html = marked.parse(markdown);
        
        document.getElementById('post-content').innerHTML = html;
        
    } catch (error) {
        console.error('Erro ao carregar post:', error);
        showError('Erro ao carregar o post');
    }
}

function showError(message) {
    document.getElementById('post-heading').textContent = 'Erro';
    document.getElementById('post-content').innerHTML = `<p>${message}</p>`;
    document.getElementById('post-date').textContent = '';
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}
