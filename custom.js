function open_new_window(location) {
  window.location.href = location;
}

// Add event listener for details button using jQuery
$(document).ready(function() {
  $(document).on('click', '.view-detail', async function(e) {
    e.preventDefault();
    const memeId = $(this).data('id');

    try {
      const response = await $.ajax({
        url: '/memes/meme',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({ id: memeId }),
      });

      // Redirect only if response is successful
      if (response) {
        window.location.href = `/memes/meme/${memeId}`;
      } else {
        console.error('Failed to fetch meme details');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  });
});
