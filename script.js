document.addEventListener('DOMContentLoaded', () => {
    const gameContainer = document.getElementById('game-container');
    const ravan = document.getElementById('ravan');
    const crosshair = document.getElementById('crosshair');
    const arrow = document.getElementById('arrow');
    const crackerVideo = document.getElementById('cracker-video');
    const celebrationMessage = document.getElementById('celebration-message');
    
    // Get the title element (assuming it's the <h3> element in your HTML)
    const gameTitle = document.querySelector('.game-container h3'); 

    // Crosshair size (30px font-size, so half is 15px for perfect centering)
    const CROSSHAIR_SIZE = 30;
    const CROSSHAIR_OFFSET = CROSSHAIR_SIZE / 2;
    let isRavanHit = false;

    // --- 1. Crosshair Movement Logic ---
    document.addEventListener('mousemove', (e) => {
        crosshair.style.left = `${e.clientX - CROSSHAIR_OFFSET}px`;
        crosshair.style.top = `${e.clientY - CROSSHAIR_OFFSET}px`;
    });

    // --- 2. Aiming and Hit Logic ---
    ravan.addEventListener('click', (e) => {
        if (isRavanHit) return;
        isRavanHit = true;

        // Disable crosshair immediately
        crosshair.style.display = 'none';

        // Calculate Ravan's center point
        const ravanRect = ravan.getBoundingClientRect();
        const targetX = ravanRect.left + ravanRect.width / 2;
        const targetY = ravanRect.top + ravanRect.height / 2;

        // --- NEW STARTING POSITION ---
        // Arrow starts from the left edge of the viewport (X=0) 
        // at the vertical position (Y) of the click.
        const startX = 0; 
        const startY = e.clientY; 
        // -----------------------------

        // Calculate flight path (angle and distance from the new starting point)
        const dx = targetX - startX;
        const dy = targetY - startY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const angleDeg = Math.atan2(dy, dx) * (180 / Math.PI);

        // Launch Arrow Animation
        arrow.style.left = `${startX}px`;
        arrow.style.top = `${startY}px`;
        // Use translate-50% for centering and then rotate
        arrow.style.transform = `translate(-50%, -50%) rotate(${angleDeg}deg)`;
        arrow.style.transition = 'none'; 
        void arrow.offsetWidth; // Force reflow

        arrow.classList.add('shooting');
        arrow.style.transition = `all 0.6s ease-out`; // Increased flight time for distance
        // Move arrow the calculated distance
        arrow.style.transform = `translate(-50%, -50%) rotate(${angleDeg}deg) translateX(${distance}px)`;

        // --- NEW EXECUTION TIMELINE FOR DRAMA ---
        const ARROW_FLIGHT_TIME = 600; // Increased flight time to match distance (0.6s)
        const SHAKE_TIME = 100;
        const BLACKOUT_FADE_DURATION = 500; 

        setTimeout(() => {
            // Step 1: Hit and Shake
            arrow.classList.remove('shooting');
            arrow.style.opacity = 0; 
            
            // Apply impact shake and start Ravan's burn
            ravan.classList.add('impact'); 
            ravan.classList.add('burned'); 
            
            // Step 2: Blackout Fade starts
            document.body.classList.add('fading-to-black');

            // Hide the game title
            if (gameTitle) {
                gameTitle.style.display = 'none';
            }

            // Step 3: Wait for shake and blackout to complete, then start video/message
            setTimeout(() => {
                
                // Remove the fading class just before the video starts
                document.body.classList.remove('fading-to-black'); 

                // Start the Cracker Video
                crackerVideo.classList.remove('hidden-video');
                crackerVideo.currentTime = 0; 
                crackerVideo.play();
                
                // Show Celebration Message and trigger the fade-up animation
                celebrationMessage.classList.remove('hidden');
                celebrationMessage.classList.add('animated'); 

                // Disable further interaction and reset cursor
                ravan.style.pointerEvents = 'none';
                gameContainer.style.cursor = 'auto';
                
                // D. Stop the video after its run time
                const VIDEO_PLAY_TIME = 34000; 
                setTimeout(() => {
                    crackerVideo.pause();
                    crackerVideo.classList.add('hidden-video');
                }, VIDEO_PLAY_TIME);

            }, SHAKE_TIME + BLACKOUT_FADE_DURATION); 

        }, ARROW_FLIGHT_TIME);
    });

    // --- 3. Miss Logic ---
    gameContainer.addEventListener('click', (e) => {
        if (!isRavanHit && e.target.closest('#ravan') === null && e.target.closest('#game-container')) {
             gameContainer.style.animation = 'shake 0.1s ease-in-out 2';
             setTimeout(() => {
                gameContainer.style.animation = '';
             }, 200);
        }
    });
});