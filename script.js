document.addEventListener('DOMContentLoaded', () => {
    const gameContainer = document.getElementById('game-container');
    const ravan = document.getElementById('ravan');
    const crosshair = document.getElementById('crosshair');
    const arrow = document.getElementById('arrow');
    const crackerVideo = document.getElementById('cracker-video');
    const celebrationMessage = document.getElementById('celebration-message');
    const fireVideo = document.getElementById('fire-video');

    // Get the title element (assuming it's the <h3> element in your HTML)
    const gameTitle = document.querySelector('.game-container h3');

    // Crosshair size (30px font-size, so half is 15px for perfect centering)
    const CROSSHAIR_SIZE = 30;
    const CROSSHAIR_OFFSET = CROSSHAIR_SIZE / 2;
    let isRavanHit = false;

    // --- 1. Crosshair Movement Logic (No change) ---
    document.addEventListener('mousemove', (e) => {
        crosshair.style.left = `${e.clientX - CROSSHAIR_OFFSET}px`;
        crosshair.style.top = `${e.clientY - CROSSHAIR_OFFSET}px`;
    });

    // --- 2. Aiming and Hit Logic ---
    ravan.addEventListener('click', (e) => {
        if (isRavanHit) return;
        isRavanHit = true;

        gameContainer.style.overflow = 'hidden';
        gameContainer.style.height = '100vh';
        // Disable crosshair immediately
        crosshair.style.display = 'none';

        // Calculate Ravan's center point (unchanged)
        const ravanRect = ravan.getBoundingClientRect();
        const targetX = ravanRect.left + ravanRect.width / 2;
        const targetY = ravanRect.top + ravanRect.height / 2;

        // --- NEW STARTING POSITION (unchanged) ---
        const startX = 0;
        const startY = e.clientY;

        // Calculate flight path (angle and distance from the new starting point)
        const dx = targetX - startX;
        const dy = targetY - startY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const angleDeg = Math.atan2(dy, dx) * (180 / Math.PI);

        // Launch Arrow Animation (unchanged)
        arrow.style.left = `${startX}px`;
        arrow.style.top = `${startY}px`;
        arrow.style.transform = `translate(-50%, -50%) rotate(${angleDeg}deg)`;
        arrow.style.transition = 'none';
        void arrow.offsetWidth;
        arrow.classList.add('shooting');
        arrow.style.transition = `all 0.6s ease-out`;
        arrow.style.transform = `translate(-50%, -50%) rotate(${angleDeg}deg) translateX(${distance}px)`;

        // --- EXECUTION TIMELINE CONSTANTS ---
        const ARROW_FLIGHT_TIME = 600;
        // Increased burn time to make the fire effect dramatic
        const FIRE_BURN_TIME = 2000;
        // Adjusted blackout fade for a smoother transition after the burn
        const BLACKOUT_FADE_DURATION = 0;

        // 1. After Arrow Hit (ARROW_FLIGHT_TIME)
        setTimeout(() => {
            arrow.classList.remove('shooting');
            arrow.style.opacity = 0;

            // Start Impact and Fire Video (Ravan remains visually present here)
            ravan.classList.add('impact');

            // Start fire video
            fireVideo.classList.remove('hidden-fire-video');
            fireVideo.currentTime = 0;
            fireVideo.play();

            // Hide the game title
            if (gameTitle) {
                gameTitle.style.display = 'none';
            }

            // 2. After Fire Burn is done (FIRE_BURN_TIME)
            setTimeout(() => {
                // Stop and hide the temporary fire video
                fireVideo.pause();
                fireVideo.classList.add('hidden-fire-video');

                // Start Blackout Fade (Now Ravan starts disappearing)
                document.body.classList.add('fading-to-black');

                // *** FIX: Apply 'burned' class now to start the fade-out/scale-down 
                // *** transition during the blackout.
                ravan.classList.add('burned');

                // 3. After Blackout Fade is done (BLACKOUT_FADE_DURATION)
                setTimeout(() => {

                    document.body.classList.remove('fading-to-black');

                    // Start the Cracker Video
                    crackerVideo.classList.remove('hidden-video');
                    crackerVideo.currentTime = 0;
                    crackerVideo.play();

                    // Show Celebration Message
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

                }, BLACKOUT_FADE_DURATION); // Wait for blackout to complete

            }, FIRE_BURN_TIME); // Wait for fire video to burn out

        }, ARROW_FLIGHT_TIME); // Wait for arrow flight to finish
    });

    // --- 3. Miss Logic (No change) ---
    gameContainer.addEventListener('click', (e) => {
        if (!isRavanHit && e.target.closest('#ravan') === null && e.target.closest('#game-container')) {
            gameContainer.style.animation = 'shake 0.1s ease-in-out 2';
            setTimeout(() => {
                gameContainer.style.animation = '';
            }, 200);
        }
    });
});