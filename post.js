
// Post page functionality
document.addEventListener('DOMContentLoaded', function() {
    loadPost();
});

async function loadPost() {
    try {
        const urlParams = new URLSearchParams(window.location.search);
        const slug = urlParams.get('slug');
        
        if (!slug) {
            showError('Post não encontrado.');
            return;
        }
        
        // Load posts data
        const response = await fetch('posts.json');
        const posts = await response.json();
        
        // Find the post with matching slug
        const post = posts.find(p => p.slug === slug);
        
        if (!post) {
            showError('Post não encontrado.');
            return;
        }
        
        // Update page title and meta
        document.getElementById('post-title').textContent = post.title + ' - AudioSpot';
        document.getElementById('post-heading').textContent = post.title;
        document.getElementById('post-date').textContent = formatDate(post.date);
        
        // Load markdown content
        const contentResponse = await fetch(`content/posts/${slug}.md`);
        const markdown = await contentResponse.text();
        
        // Convert markdown to HTML
        const html = marked.parse(markdown);
        document.getElementById('post-content').innerHTML = html;
        
    } catch (error) {
        console.error('Erro ao carregar post:', error);
        showError('Erro ao carregar o post. Tente novamente mais tarde.');
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
