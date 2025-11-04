// Dark Mode Toggle Functionality
(function() {
    // Check for saved theme preference or default to light mode
    const currentTheme = localStorage.getItem('theme') || 'light';
    
    // Apply the theme on page load
    document.documentElement.setAttribute('data-theme', currentTheme);
    
    // Wait for DOM to be fully loaded
    document.addEventListener('DOMContentLoaded', function() {
        const toggleButton = document.getElementById('darkModeToggle');
        
        if (toggleButton) {
            // Set initial icon
            updateIcon(currentTheme);
            
            // Add click event listener
            toggleButton.addEventListener('click', function() {
                const theme = document.documentElement.getAttribute('data-theme');
                const newTheme = theme === 'light' ? 'dark' : 'light';
                
                // Update theme
                document.documentElement.setAttribute('data-theme', newTheme);
                localStorage.setItem('theme', newTheme);
                
                // Update icon
                updateIcon(newTheme);
            });
        }
    });
    
    // Function to update the icon based on theme
    function updateIcon(theme) {
        const toggleButton = document.getElementById('darkModeToggle');
        if (toggleButton) {
            toggleButton.textContent = theme === 'light' ? '🌙' : '☀️';
            toggleButton.setAttribute('aria-label', theme === 'light' ? 'Activar modo oscuro' : 'Activar modo claro');
        }
    }
})();

