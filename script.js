// Load YouTube Iframe API
var tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

// Called by YouTube API when it's ready
function onYouTubeIframeAPIReady() {
    console.log('YouTube API is ready');
}

// Load and embed a YouTube video
async function loadVideo(videoId) {
    try {
        const videoLink = document.getElementById(`${videoId}-link`).value;
        const videoTitle = await getVideoTitle(videoLink);
        const videoContainer = document.getElementById(`${videoId}-container`);

        // Clear existing content
        while (videoContainer.firstChild) {
            videoContainer.removeChild(videoContainer.firstChild);
        }

        // Create and configure iframe
        const iframe = document.createElement('iframe');
        iframe.src = `https://www.youtube.com/embed/${getVideoId(videoLink)}?autoplay=1&mute=1&playsinline=1&enablejsapi=1`;
        iframe.frameBorder = 0;
        iframe.allowFullscreen = true;
        iframe.width = '100%';
        iframe.height = '100%';
        iframe.style.aspectRatio = '16/9';

        // Add video title and iframe to container
        const h2 = document.createElement('h2');
        h2.textContent = videoTitle;
        videoContainer.appendChild(h2);
        videoContainer.appendChild(iframe);

        // Initialize YouTube player
        const player = new YT.Player(iframe, {
            videoId: getVideoId(videoLink),
            events: {
                'onReady': onPlayerReady,
            }
        });

        function onPlayerReady(event) {
            event.target.playVideo();
        }
    } catch (error) {
        console.error(error);
        const videoContainer = document.getElementById(`${videoId}-container`);
        videoContainer.innerHTML = 'Error loading video';
    }
}

// Extract video ID from YouTube link
function getVideoId(link) {
    const url = new URL(link);
    const params = url.searchParams;
    return params.get('v');
}

// Fetch video title using noembed API
async function getVideoTitle(link) {
    try {
        const apiUrl = `https://noembed.com/embed?url=${link}`;
        const response = await fetch(apiUrl);
        const data = await response.json();
        return data.title;
    } catch (error) {
        console.error(error);
        return 'Unknown video title';
    }
}
