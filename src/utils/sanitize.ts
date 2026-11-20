import DOMPurify from 'dompurify';

// 独立实例, 钩子只作用于这里的净化
const purifier = DOMPurify(window);

purifier.addHook('uponSanitizeElement', (node, data) => {
  // 表单控件只保留 Markdown 任务列表的复选框
  if (data.tagName === 'input') {
    const el = node as Element;
    if (el.getAttribute('type') !== 'checkbox') {
      el.parentNode?.removeChild(el);
    }
  }
});

purifier.addHook('afterSanitizeAttributes', (node) => {
  const el = node as Element;
  if (el.tagName === 'INPUT') {
    el.setAttribute('disabled', '');
  }
  if (el.tagName === 'A' && el.getAttribute('target')) {
    el.setAttribute('rel', 'noopener noreferrer');
  }
});

/**
 * 净化不可信的 HTML(如用户提交的 Markdown 渲染结果), 用于 v-html 之前。
 * 白名单方式: 只保留常规排版标签和属性, 去掉脚本、全部事件属性、内联样式、
 * 外链样式表、表单以及 SVG/MathML。
 */
export default function sanitizeHtml(html: string): string {
  if (!html) return '';
  return purifier.sanitize(html, {
    USE_PROFILES: { html: true },
    FORBID_TAGS: [
      'style',
      'form',
      'button',
      'textarea',
      'select',
      'option',
      'optgroup',
      'fieldset',
      'label',
      'dialog',
      'audio',
      'video',
      'source',
      'track',
    ],
    FORBID_ATTR: ['style', 'srcset', 'action', 'formaction', 'autofocus'],
  });
}
