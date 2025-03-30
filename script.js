// 获取DOM元素
const markdownInput = document.getElementById('markdownInput');
const pdfPreview = document.getElementById('pdfPreview');
const importBtn = document.getElementById('importBtn');
const exportBtn = document.getElementById('exportBtn');

// 实时转换Markdown为HTML
markdownInput.addEventListener('input', () => {
    const markdown = markdownInput.value;
    const html = marked.parse(markdown, {
        breaks: true,
        sanitize: false,
        highlight: function() { return ''; }
    });
    pdfPreview.innerHTML = html;
    MathJax.typesetPromise([pdfPreview]).then(() => {
        // 确保公式渲染完成后再更新布局
        window.dispatchEvent(new Event('resize'));
    });
});

// 导入文件功能
importBtn.addEventListener('click', () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.md';
    input.onchange = e => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onload = () => {
            markdownInput.value = reader.result;
            markdownInput.dispatchEvent(new Event('input'));
        };
        reader.readAsText(file);
    };
    input.click();
});

// 导出PDF功能
exportBtn.addEventListener('click', () => {
    const element = pdfPreview;
    const opt = {
        margin: 10,
        filename: 'output.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { 
            scale: 3,
            useCORS: true,
            logging: true 
        },
        jsPDF: { 
            unit: 'mm',
            format: 'a4',
            orientation: 'portrait'
        },
        pagebreak: { 
            mode: 'avoid-all',
            before: '.page-break' 
        },
        autoPaging: 'text'
    };
    MathJax.typesetPromise([pdfPreview]).then(() => {
        return html2pdf().from(element).set(opt).save();
    }).catch(error => {
        console.error('PDF生成失败:', error);
    });
});

const translations = {
  zh: {
    header: 'AI2PDF',
    importBtn: '导入文件',
    markdownPlaceholder: '在此粘贴Markdown内容...',
    exportBtn: '导出PDF',
    previewTitle: 'PDF预览'
  },
  en: {
    header: 'AI2PDF',
    importBtn: 'Import File',
    markdownPlaceholder: 'Paste Markdown here...',
    exportBtn: 'Export PDF',
    previewTitle: 'PDF Preview'
  }
};

function updateLanguage(lang) {
  document.querySelector('header').textContent = translations[lang].header;
  document.getElementById('importBtn').textContent = translations[lang].importBtn;
  document.getElementById('markdownInput').placeholder = translations[lang].markdownPlaceholder;
  document.getElementById('exportBtn').textContent = translations[lang].exportBtn;
  document.querySelector('#pdfPreview').textContent = translations[lang].previewTitle;
}

document.getElementById('languageSelect').addEventListener('change', (e) => {
  updateLanguage(e.target.value);
});

// 初始化默认语言
updateLanguage('zh');