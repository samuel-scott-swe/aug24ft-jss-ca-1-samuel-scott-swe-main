function open_new_window(location) {
  window.location.href = location;
}

// Add event listener for details button
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.view-detail').forEach((button) => {
    button.addEventListener('click', async (e) => {
      e.preventDefault();
      const memeId = button.getAttribute('data-id');

      try {
        const response = await fetch('/memes/meme', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: memeId }),
        });

        if (response.ok) {
          window.location.href = `/memes/meme/${memeId}`;
        } else {
          console.error('Failed to fetch meme details');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    });
  });
});
