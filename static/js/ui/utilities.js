/*
 * Metadata Remote - Intelligent audio metadata editor
 * Copyright (C) 2025 Dr. William Nelson Leonard
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

/**
 * UI Utility Functions for Metadata Remote
 * General UI helpers and formatting utilities
 */

(function() {
    // Create namespace if it doesn't exist
    window.MetadataRemote = window.MetadataRemote || {};
    window.MetadataRemote.UI = window.MetadataRemote.UI || {};
    
    window.MetadataRemote.UI.Utilities = {
        /**
         * Show status message (legacy function - kept for compatibility)
         * @param {string} message - Status message
         * @param {string} type - Status type
         */
        showStatus(message, type) {
            // Legacy function - kept for compatibility but hidden - status is now hidden by CSS
            const status = document.getElementById('status');
            if (status) {
                status.textContent = message;
                status.className = `status ${type}`;
            }
            
            // For errors, also show an alert since the status element is hidden
            if (type === 'error') {
                alert(`Error: ${message}`);
            }
        },
    
        /**
         * Hide status message (legacy function - kept for compatibility)
         */
        hideStatus() {
            // Legacy function - kept for compatibility
            const status = document.getElementById('status');
            status.style.display = 'none';
        },
    
        /**
         * Enable or disable all form inputs and buttons
         * @param {boolean} enabled - Whether to enable or disable
         */
        setFormEnabled(enabled) {
            const inputs = document.querySelectorAll('#metadata-form input');
            const buttons = document.querySelectorAll('button');
            
            inputs.forEach(input => input.disabled = !enabled);
            buttons.forEach(button => {
                // Skip history panel buttons
                if (button.classList.contains('history-btn') || 
                    button.classList.contains('history-clear-btn')) {
                    return;
                }
                if (!button.classList.contains('btn-status') || !button.classList.contains('processing')) {
                    // Don't re-enable buttons that are disabled due to format restrictions
                    if (enabled && button.title && button.title.includes('does not support embedded album art')) {
                        return; // Skip re-enabling this button
                    }
                    button.disabled = !enabled;
                }
            });
        },
    
        /**
         * Get SVG icon for audio file
         * @param {string} filename - The filename (unused – single icon for all audio)
         * @returns {string} SVG markup string
         */
        getFormatIcon(filename) {
            return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>';
        },
    
        /**
         * Get format badge HTML with visual indicators
         * @param {string} filename - The filename
         * @returns {string} HTML string for format badge
         */
        getFormatBadge(filename) {
            const ext = filename.split('.').pop().toUpperCase();
            const lossless = ['FLAC', 'WAV', 'WV', 'OGG', 'OPUS'];
            const limitedMetadata = ['WAV', 'WV'];
            const noAlbumArt = ['WAV', 'WV'];
            
            const isLossless = lossless.includes(ext);
            const hasLimitations = limitedMetadata.includes(ext) || noAlbumArt.includes(ext);
            
            // Check for audiobook format
            const isAudiobook = ext === 'M4B';
            let typeClass = isAudiobook ? 'audiobook' : (isLossless ? 'lossless' : 'lossy');
            let badgeHtml = `<span class="format-badge format-badge--${typeClass}">${ext}</span>`;
            
            if (hasLimitations) {
                const limitations = [];
                if (limitedMetadata.includes(ext)) {
                    limitations.push('limited metadata');
                }
                if (noAlbumArt.includes(ext)) {
                    limitations.push('no album art');
                }
                
                badgeHtml += `<span style="
                    font-size: 0.65rem;
                    padding: 0.15rem 0.3rem;
                    border-radius: 4px;
                    background: rgba(255, 107, 107, 0.2);
                    color: #ff6b6b;
                    margin-left: 0.3rem;
                    font-weight: 400;
                " title="${limitations.join(', ')}">⚠</span>`;
            }
            
            return badgeHtml;
        }
    };
})();
