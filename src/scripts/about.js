document.addEventListener('DOMContentLoaded', async () => {
    const container = document.querySelector('.windows-container');
    const links = document.querySelectorAll('.section-menu a');
    let activeWindow = null;
    let activeLink = null;

    async function loadContent(section) {
        try {
            const response = await fetch(`src/assets/${section}.html`);
            return await response.text();
        } catch (error) {
            console.error(`Error loading ${section}:`, error);
            return '<div class="error">Failed to load content</div>';
        }
    }

    // Content sections
    const sections = {
        experience: await loadContent('experience'),
        education: await loadContent('education'),
        certificates: await loadContent('certificates'),
        competitions: await loadContent('competitions'),
        projects: await loadContent('projects'),
    };

    // Create windows for each section
    const createWindow = (title, content) => {
        const window = document.createElement('div');
        window.className = 'section-window';
        window.innerHTML = `
            <div class="window-header">
                <div class="window-dots">
                    <span class="dot red minimize-btn"></span>
                    <span class="dot yellow"></span>
                    <span class="dot green"></span>
                </div>
                <div class="window-title">${title}</div>
            </div>
            <div class="window-content">
                ${content}
            </div>
        `;

        // Add minimize functionality
        const minimizeBtn = window.querySelector('.minimize-btn');
        minimizeBtn.addEventListener('click', () => {
            hideWindow(window);
        });

        return window;
    };

    const hideWindow = (window) => {
        window.classList.remove('active');
        setTimeout(() => {
            window.remove();
        }, 300); // Match transition duration
        activeWindow = null;
        if (activeLink) {
            activeLink.classList.remove('active');
            activeLink = null;
        }
    };

    // Function to show a specific section
    const showSection = (sectionName, link) => {
        // Remove any existing window
        if (activeWindow) {
            hideWindow(activeWindow);
        }

        // Remove active class from all links
        links.forEach(l => l.classList.remove('active'));

        // Create and show new window
        const window = createWindow(
            sectionName.charAt(0).toUpperCase() + sectionName.slice(1),
            sections[sectionName] || ''
        );
        container.appendChild(window);
        
        // Trigger reflow for animation
        window.offsetHeight;
        
        // Show window and activate link
        window.classList.add('active');
        link.classList.add('active');
        activeWindow = window;
        activeLink = link;
    };

    // Handle navigation clicks
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const sectionName = link.getAttribute('data-section');

            // If clicking active link, hide window
            if (link.classList.contains('active')) {
                if (activeWindow) {
                    hideWindow(activeWindow);
                }
                return;
            }

            showSection(sectionName, link);
        });
    });

    // Automatically open Professional Experience section
    const experienceLink = document.querySelector('[data-section="education"]');
    if (experienceLink) {
        showSection('education', experienceLink);
    }
});