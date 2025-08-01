<template>
  <div ref="divRef">
    <div class="aie-container">
      <div class="aie-header-panel">
        <div class="aie-container-header"></div>
      </div>
      <div class="aie-main">
        <div class="aie-directory-content">
          <div class="aie-directory">
            <h5>目录</h5>
            <div id="outline"></div>
          </div>
        </div>
        <div class="aie-container-panel">
          <div class="aie-container-main"></div>
        </div>
      </div>
      <div class="aie-container-footer">
        <a-descriptions title="用户属性" :column="{ xs: 1, md: 2, lg: 3 }">
          <a-descriptions-item
            v-for="(item, index) of userAttribute"
            :key="index"
            :label="item.label"
          >
            <a-tag>{{ item.value }}</a-tag>
          </a-descriptions-item>
        </a-descriptions>

        <a-descriptions title="代理商属性" :column="{ xs: 1, md: 2, lg: 3 }">
          <a-descriptions-item
            v-for="(item, index) of resellerAttribute"
            :key="index"
            :label="item.label"
          >
            <a-tag>{{ item.value }}</a-tag>
          </a-descriptions-item>
        </a-descriptions>

        <a-descriptions title="站点属性" :column="{ xs: 1, md: 3, lg: 4 }">
          <a-descriptions-item
            v-for="(item, index) of siteAttribute"
            :key="index"
            :label="item.label"
          >
            <a-tag>{{ item.value }}</a-tag>
          </a-descriptions-item>
        </a-descriptions>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, reactive, watch, onMounted, onUnmounted } from 'vue';
  import { AiEditor, type AiEditorOptions } from 'aieditor';
  import 'aieditor/dist/style.css';

  const props = defineProps<{
    modelValue: string;
    options?: AiEditorOptions;
  }>();

  const emit = defineEmits<(e: 'update:modelValue', value: string) => void>();
  const divRef = ref<any>();
  const aieditor = ref<AiEditor | null>(null);

  const updateOutLine = (editor: AiEditor) => {
    const outlineContainer = document.querySelector('#outline');
    while (outlineContainer?.firstChild) {
      outlineContainer.removeChild(outlineContainer.firstChild);
    }
    const outlines = editor.getOutline();
    outlines.forEach((outline) => {
      const child = document.createElement('div');
      child.classList.add(`aie-title${outline.level}`);
      child.style.marginLeft = `${14 * (outline.level - 1)}px`;
      child.style.padding = `4px 0`;
      child.innerHTML = `<a style="text-decoration: none;" href="#${outline.id}">${outline.text}</a>`;
      child.addEventListener('click', (e) => {
        e.preventDefault();
        const el = editor.innerEditor.view.dom.querySelector(
          `#${outline.id}`
        ) as HTMLElement;
        el.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
          inline: 'nearest',
        });
        setTimeout(() => {
          editor.focusPos(outline.pos + outline.size - 1);
        }, 1000);
      });
      outlineContainer?.appendChild(child);
    });
  };

  const editorConfig = reactive<AiEditorOptions>({
    element: '',
    placeholder: '请输入内容',
    content: '',
    toolbarExcludeKeys: ['attachment'],
    onChange: (editor: AiEditor) => {
      emit('update:modelValue', editor.getHtml());
      updateOutLine(editor);
    },
    onCreated: (editor: AiEditor) => {
      updateOutLine(editor);
    },
  });

  watch(
    () => props.modelValue,
    (value) => {
      if (value !== aieditor.value?.getHtml()) {
        aieditor.value?.destroy();
        editorConfig.content = value;
        aieditor.value = new AiEditor(editorConfig);
      }
    }
  );

  onMounted(() => {
    editorConfig.element = divRef.value;
    aieditor.value = new AiEditor(editorConfig);
  });

  onUnmounted(() => {
    aieditor.value?.destroy();
  });

  const userAttribute = [
    {
      label: '用户ID',
      value: '{{.user.user_id}}',
    },
    {
      label: '姓名',
      value: '{{.user.name}}',
    },
    {
      label: '邮箱',
      value: '{{.user.email}}',
    },
    {
      label: '手机号',
      value: '{{.user.phone}}',
    },
    {
      label: '剩余额度',
      value: '{{.user.quota}}',
    },
    {
      label: '已用额度',
      value: '{{.user.used_quota}}',
    },
    {
      label: '额度过期时间',
      value: '{{.user.quota_expires_at}}',
    },
    {
      label: '预警阈值',
      value: '{{.user.warning_threshold}}',
    },
    {
      label: '过期预警阈值',
      value: '{{.user.expire_warning_threshold}}',
    },
  ];

  const resellerAttribute = [
    {
      label: '用户ID',
      value: '{{.reseller.user_id}}',
    },
    {
      label: '姓名',
      value: '{{.reseller.name}}',
    },
    {
      label: '邮箱',
      value: '{{.reseller.email}}',
    },
    {
      label: '手机号',
      value: '{{.reseller.phone}}',
    },
    {
      label: '剩余额度',
      value: '{{.reseller.quota}}',
    },
    {
      label: '已用额度',
      value: '{{.reseller.used_quota}}',
    },
    {
      label: '额度过期时间',
      value: '{{.reseller.quota_expires_at}}',
    },
    {
      label: '预警阈值',
      value: '{{.reseller.warning_threshold}}',
    },
    {
      label: '过期预警阈值',
      value: '{{.reseller.expire_warning_threshold}}',
    },
  ];

  const siteAttribute = [
    {
      label: '域名',
      value: '{{.site.domain}}',
    },
    {
      label: '标题',
      value: '{{.site.title}}',
    },
    {
      label: 'Logo',
      value: '{{.site.logo}}',
    },
    {
      label: '版权信息',
      value: '{{.site.copyright}}',
    },
    {
      label: '跳转URL',
      value: '{{.site.jump_url}}',
    },
    {
      label: 'ICP备案',
      value: '{{.site.icp_beian}}',
    },
    {
      label: '公安备案',
      value: '{{.site.ga_beian}}',
    },
    {
      label: '注册欢迎语',
      value: '{{.site.register_welcome}}',
    },
  ];
</script>

<script lang="ts">
  export default {
    name: 'AiEditor',
  };
</script>

<style scoped lang="less">
  .container {
    height: 100%;
    width: 100%;
    box-sizing: border-box;
  }

  .aie-header-panel {
    position: sticky;
    z-index: 1;
  }

  .aie-header-panel aie-header > div {
    align-items: center;
    justify-content: center;
    padding: 10px 0;
  }

  .aie-container {
    border: none !important;
  }

  .aie-container-panel {
    width: calc(100% - 2rem - 2px);
    max-width: 80%;
    border: 1px solid var(--color-border-1);
    background-color: var(--color-bg-1);
    height: 100%;
    padding: 1rem;
    z-index: 99;
    overflow: auto;
    box-sizing: border-box;
    color: black;
  }

  .aie-main {
    position: relative;
    overflow: hidden;
    flex: 1;
    box-sizing: border-box;
    padding: 1rem 0px;
    background-color: var(--color-bg-2);
  }

  .aie-directory {
    position: absolute;
    top: 30px;
    right: -10%;
    width: 260px;
    z-index: 0;
  }

  .aie-directory h5 {
    font-size: 16px;
    text-indent: 4px;
    line-height: 32px;
  }

  .aie-directory a {
    height: 30px;
    font-size: 14px;
    text-indent: 4px;
    line-height: 30px;
    text-decoration: none;
    width: 100%;
    display: inline-block;
    margin: 0;
    padding: 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .aie-directory a:hover {
    cursor: pointer;
    border-radius: 4px;
  }

  .aie-title1 {
    font-size: 14px;
    font-weight: 500;
  }

  #outline {
    text-indent: 15px;
  }

  .aie-directory-content {
    position: sticky;
    top: 0px;
  }

  @media screen and (max-width: 1280px) {
    .aie-directory {
      display: none;
    }
  }

  @media screen and (max-width: 1400px) {
    .aie-directory {
      width: 200px;
    }
  }
</style>
