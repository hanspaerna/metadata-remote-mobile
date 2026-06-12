/*
 * Metadata Remote - Mobile Navigation
 * Minimal pane-switching logic for small screens.
 */

(function () {
    'use strict';

    const BREAKPOINT = 768;

    function isMobile() {
        return window.innerWidth < BREAKPOINT;
    }

    /**
     * Switch the visible pane on mobile.
     * @param {'folders'|'files'|'metadata'} pane
     */
    function switchPane(pane) {
        if (!isMobile()) return;

        const container = document.querySelector('.container');
        if (container) {
            container.setAttribute('data-mobile-pane', pane);
        }

        document.querySelectorAll('.mobile-nav-btn').forEach(function (btn) {
            btn.classList.toggle('active', btn.dataset.pane === pane);
        });
    }

    function init() {
        // Start on Folders pane on mobile
        if (isMobile()) {
            switchPane('folders');
        }

        // Auto-advance to Files when a folder is tapped
        var folderTree = document.getElementById('folder-tree');
        if (folderTree) {
            folderTree.addEventListener('click', function (e) {
                if (!isMobile()) return;
                if (e.target.closest('.tree-item')) {
                    // Short delay so the file list can populate first
                    setTimeout(function () { switchPane('files'); }, 180);
                }
            });
        }

        // Auto-advance to Edit (metadata) when a file is tapped
        var fileList = document.getElementById('file-list');
        if (fileList) {
            fileList.addEventListener('click', function (e) {
                if (!isMobile()) return;
                if (e.target.closest('li')) {
                    setTimeout(function () { switchPane('metadata'); }, 180);
                }
            });
        }

        // On resize back to desktop, remove the mobile pane attribute
        window.addEventListener('resize', function () {
            var container = document.querySelector('.container');
            if (!container) return;
            if (!isMobile()) {
                container.removeAttribute('data-mobile-pane');
            } else if (!container.getAttribute('data-mobile-pane')) {
                switchPane('folders');
            }
        });
    }

    document.addEventListener('DOMContentLoaded', init);

    // Expose so nav buttons and other modules can call it
    window.MetadataRemote = window.MetadataRemote || {};
    window.MetadataRemote.MobileNav = { switchPane: switchPane };
}());
