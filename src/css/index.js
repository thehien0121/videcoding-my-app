// Tự động import tất cả các file CSS trong thư mục css
// Sử dụng tính năng glob import của Vite
const cssFiles = import.meta.glob('./*.css');

// Import tất cả các file CSS
Object.keys(cssFiles).forEach(path => {
    cssFiles[path]();
}); 