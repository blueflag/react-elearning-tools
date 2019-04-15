//@flow
export default {
    enabled: function (): * {
        return (
            document.fullscreenEnabled ||
            document.webkitFullscreenEnabled ||
            document.mozFullScreenEnabled ||
            //$FlowFixMe
            document.msFullscreenEnabled
        );
    },
    active: function (): * {
        return (
            document.fullscreenElement ||
            document.webkitFullscreenElement ||
            document.mozFullScreenElement ||
            //$FlowFixMe
            document.msFullscreenElement
        );
    },
    exit: function () {
        if (document.exitFullscreen) {
            //$FlowFixMe
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
            //$FlowFixMe
            document.webkitExitFullscreen();
        } else if (document.mozCancelFullScreen) {
            //$FlowFixMe
            document.mozCancelFullScreen();
        } else if (document.msExitFullscreen) {
            //$FlowFixMe
            document.msExitFullscreen();
        }
    },
    request: function (element: Object) {
        if (element.requestFullscreen) {
            element.requestFullscreen();
        } else if (element.webkitRequestFullscreen) {
            element.webkitRequestFullscreen();
        } else if (element.mozRequestFullScreen) {
            element.mozRequestFullScreen();
        } else if (element.msRequestFullscreen) {
            element.msRequestFullscreen();
        }
    }
};
