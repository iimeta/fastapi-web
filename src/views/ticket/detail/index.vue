<template>
  <div class="ticket-detail">
    <a-spin :loading="loading" style="width: 100%">
      <!-- Header -->
      <div class="ticket-header">
        <div class="ticket-header-top">
          <div class="ticket-header-left">
            <a-button size="small" @click="goBack">
              <template #icon><icon-left /></template>
              {{ $t('button.return') }}
            </a-button>
            <span v-if="ticketData.ticket_no" class="ticket-no">
              {{ ticketData.ticket_no }}
              <a-button
                type="text"
                size="mini"
                class="copy-btn"
                @click="handleCopyTicketNo"
              >
                <template #icon><icon-copy /></template>
              </a-button>
            </span>
          </div>
          <!-- Action Buttons -->
          <div v-if="hasActions" class="ticket-actions">
            <a-button
              v-if="isHandler && ticketData.status === 2"
              size="small"
              type="primary"
              @click="handleStatusUpdate(3)"
            >
              {{ $t('ticket.button.start') }}
            </a-button>
            <a-button
              v-if="
                isHandler &&
                (ticketData.status === 1 ||
                  ticketData.status === 3 ||
                  ticketData.status === 4)
              "
              size="small"
              type="primary"
              status="success"
              @click="handleStatusUpdate(5)"
            >
              {{ $t('ticket.button.resolve') }}
            </a-button>
            <a-button
              v-if="ticketData.status === 5 || ticketData.status === 6"
              size="small"
              type="primary"
              @click="handleStatusUpdate(2)"
            >
              {{ $t('ticket.button.reopen') }}
            </a-button>
            <a-button
              v-if="ticketData.status !== 6"
              size="small"
              status="danger"
              @click="handleClose"
            >
              {{ $t('ticket.button.close') }}
            </a-button>
          </div>
        </div>

        <h2 class="ticket-title">{{ ticketData.title }}</h2>

        <div class="ticket-meta">
          <a-tag :color="statusColor(ticketData.status || 2)" size="small">
            {{ $t(`ticket.dict.status.${ticketData.status || 2}`) }}
          </a-tag>
          <a-tag :color="priorityColor(ticketData.priority || 2)" size="small">
            {{ $t(`ticket.dict.priority.${ticketData.priority || 2}`) }}
          </a-tag>
          <a-tag
            :color="categoryColor(ticketData.category || 'other')"
            size="small"
          >
            {{ $t(`ticket.dict.category.${ticketData.category || 'other'}`) }}
          </a-tag>
          <span class="meta-item">
            {{ $t('ticket.label.submitter') }}:
            {{ ticketData.user_name || '-' }}
          </span>
          <span
            v-if="userStore.role === 'admin' && ticketData.assignee_role"
            class="meta-item"
          >
            {{ $t('ticket.label.assignee') }}:
            <a-tag :color="roleColor(ticketData.assignee_role)" size="small">
              {{ $t(`ticket.dict.role.${ticketData.assignee_role}`) }}
            </a-tag>
          </span>
          <span class="meta-item meta-time">
            {{ ticketData.created_at }}
          </span>
        </div>
      </div>

      <!-- Timeline: Original + Replies -->
      <div class="ticket-timeline">
        <!-- Original content -->
        <div class="timeline-item">
          <div class="timeline-avatar">
            <a-tag
              :color="roleColor(displayRole(ticketData.user_role || 'user'))"
              size="small"
            >
              {{
                $t(
                  `ticket.dict.role.${displayRole(
                    ticketData.user_role || 'user'
                  )}`
                )
              }}
            </a-tag>
          </div>
          <div class="timeline-body">
            <div class="timeline-header">
              <span class="timeline-name">{{ ticketData.user_name }}</span>
              <span class="timeline-time">{{ ticketData.created_at }}</span>
            </div>
            <div
              class="timeline-content"
              @click="handleImageClick"
              v-html="contentHtml"
            ></div>
          </div>
        </div>

        <!-- Replies -->
        <div
          v-for="reply in ticketData.replies"
          :key="reply.id"
          class="timeline-item"
          :class="{
            'timeline-item--staff':
              displayRole(reply.role || 'user') !== 'user',
          }"
        >
          <div class="timeline-avatar">
            <a-tag
              :color="roleColor(displayRole(reply.role || 'user'))"
              size="small"
            >
              {{ $t(`ticket.dict.role.${displayRole(reply.role || 'user')}`) }}
            </a-tag>
          </div>
          <div class="timeline-body">
            <div class="timeline-header">
              <span class="timeline-name">{{ reply.user_name }}</span>
              <span class="timeline-time">{{ reply.created_at }}</span>
            </div>
            <div
              class="timeline-content"
              @click="handleImageClick"
              v-html="replyHtmlMap[reply.id] || ''"
            ></div>
          </div>
        </div>
      </div>

      <!-- Reply Form -->
      <div
        v-if="ticketData.status && ticketData.status !== 6"
        class="ticket-reply-form"
      >
        <Vditor
          ref="replyEditorRef"
          v-model="replyContent"
          :show-variables="false"
          style="width: 100%"
        />
        <div
          style="
            margin-top: 12px;
            display: flex;
            justify-content: space-between;
            align-items: center;
          "
        >
          <a-button @click="goBack">
            <template #icon><icon-left /></template>
            {{ $t('button.return') }}
          </a-button>
          <a-button type="primary" :loading="replyLoading" @click="handleReply">
            {{ $t('ticket.button.reply') }}
          </a-button>
        </div>
      </div>

      <!-- Image Preview -->
      <a-image-preview-group
        v-model:visible="previewVisible"
        v-model:current="previewCurrent"
        :src-list="previewSrcList"
        infinite
      />
    </a-spin>
  </div>
</template>

<script lang="ts" setup>
  import { ref, computed, onMounted } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { useRoute, useRouter } from 'vue-router';
  import { Message, Modal } from '@arco-design/web-vue';
  import VditorLib from 'vditor';
  import useLoading from '@/hooks/loading';
  import { useUserStore } from '@/store';
  import {
    queryTicketDetail,
    submitTicketReply,
    submitTicketUpdateStatus,
    submitTicketClose,
    TicketDetail,
  } from '@/api/ticket';
  import Vditor from '@/views/common/vditor.vue';

  const VDITOR_CDN = 'https://vditor.fastapi.pro/vditor@3.11.2';

  const { t } = useI18n();
  const route = useRoute();
  const router = useRouter();
  const userStore = useUserStore();
  const { loading, setLoading } = useLoading(true);
  const replyLoading = ref(false);
  const replyEditorRef = ref<{ getValue: () => string }>();

  const ticketData = ref<Partial<TicketDetail>>({});
  const replyContent = ref('');
  const contentHtml = ref('');
  const replyHtmlMap = ref<Record<string, string>>({});

  const md2html = async (md: string): Promise<string> => {
    if (!md) return '';
    return VditorLib.md2html(md, { cdn: VDITOR_CDN, mode: 'dark' });
  };

  const renderContent = async () => {
    contentHtml.value = await md2html(ticketData.value.content || '');
    const map: Record<string, string> = {};
    if (ticketData.value.replies) {
      await Promise.all(
        ticketData.value.replies.map(async (reply) => {
          map[reply.id] = await md2html(reply.content);
        })
      );
    }
    replyHtmlMap.value = map;
  };

  const fetchDetail = async (showLoading = true) => {
    const id = route.query.id as string;
    if (!id) return;

    if (showLoading) setLoading(true);
    try {
      const { data } = await queryTicketDetail({ id });
      ticketData.value = data;
      await renderContent();
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  const handleReply = async () => {
    // Sync Vditor content before validation (input callback may be debounced)
    if (replyEditorRef.value) {
      replyContent.value = replyEditorRef.value.getValue();
    }

    if (!replyContent.value || replyContent.value.trim() === '') {
      Message.warning(t('ticket.placeholder.reply'));
      return;
    }

    const { id: ticketId } = ticketData.value;
    if (!ticketId) return;

    replyLoading.value = true;
    try {
      await submitTicketReply({
        ticket_id: ticketId,
        content: replyContent.value,
      });
      Message.success(t('ticket.message.reply.success'));
      replyContent.value = '';
      await fetchDetail(false);
    } finally {
      replyLoading.value = false;
    }
  };

  const handleStatusUpdate = async (status: number) => {
    const { id } = ticketData.value;
    if (!id) return;

    try {
      await submitTicketUpdateStatus({ id, status });
      Message.success(t('ticket.message.status.success'));
      await fetchDetail();
    } catch (e) {
      // error handled by interceptor
    }
  };

  const handleClose = () => {
    const { id } = ticketData.value;
    if (!id) return;

    Modal.warning({
      title: t('ticket.button.close'),
      content: t('ticket.message.close.confirm'),
      hideCancel: false,
      onOk: async () => {
        await submitTicketClose({ id });
        Message.success(t('ticket.message.close.success'));
        await fetchDetail();
      },
    });
  };

  const goBack = () => {
    router.back();
  };

  const handleCopyTicketNo = () => {
    if (ticketData.value.ticket_no) {
      navigator.clipboard.writeText(ticketData.value.ticket_no);
      Message.success(t('ticket.message.copy.success'));
    }
  };

  const hasActions = computed(() => {
    const s = ticketData.value.status;
    return s && s > 0;
  });

  // 当前用户是否为工单处理人(非提交人)
  // admin始终可处理; reseller仅当工单分配给reseller处理且不是自己提交的
  const isHandler = computed(() => {
    if (userStore.role === 'admin') return true;
    if (
      userStore.role === 'reseller' &&
      ticketData.value.assignee_role === 'reseller'
    ) {
      return true;
    }
    return false;
  });

  const previewVisible = ref(false);
  const previewCurrent = ref(0);
  const previewSrcList = ref<string[]>([]);

  const extractImages = (html: string): string[] => {
    const srcs: string[] = [];
    const regex = /<img[^>]+src="([^"]+)"/g;
    let match = regex.exec(html);
    while (match) {
      srcs.push(match[1]);
      match = regex.exec(html);
    }
    return srcs;
  };

  const allImages = computed(() => {
    const images: string[] = [];
    images.push(...extractImages(contentHtml.value));
    Object.values(replyHtmlMap.value).forEach((html) => {
      images.push(...extractImages(html));
    });
    return images;
  });

  const handleImageClick = (e: MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.tagName === 'IMG') {
      const { src } = target as HTMLImageElement;
      const index = allImages.value.indexOf(src);
      previewCurrent.value = index >= 0 ? index : 0;
      previewSrcList.value = index >= 0 ? allImages.value : [src];
      previewVisible.value = true;
    }
  };

  // 角色显示映射
  // 管理员查看: 看到真实角色
  // 用户查看: 代理商作为处理人的回复显示为"管理员", 避免用户疑惑
  // 代理商查看自己提交的工单: 自己显示"代理商", 管理员回复显示"管理员"
  // 代理商查看用户提交的工单(作为处理人): 显示真实角色
  const displayRole = (role: string) => {
    if (userStore.role === 'admin') return role;
    // 用户视角: 工单分配给代理商处理时, 代理商回复显示为管理员
    if (
      userStore.role === 'user' &&
      role === 'reseller' &&
      ticketData.value.assignee_role === 'reseller'
    ) {
      return 'admin';
    }
    return role;
  };

  const priorityColor = (priority: number) => {
    const colors: Record<number, string> = {
      1: 'gray',
      2: 'blue',
      3: 'orange',
      4: 'red',
    };
    return colors[priority] || 'gray';
  };

  const categoryColor = (category: string) => {
    const colors: Record<string, string> = {
      account: 'blue',
      billing: 'orange',
      technical: 'purple',
      feature: 'cyan',
      other: 'gray',
    };
    return colors[category] || 'gray';
  };

  const statusColor = (status: number) => {
    const colors: Record<number, string> = {
      1: 'purple',
      2: 'orangered',
      3: 'blue',
      4: 'cyan',
      5: 'green',
      6: 'gray',
    };
    return colors[status] || 'gray';
  };

  const roleColor = (role: string) => {
    const colors: Record<string, string> = {
      user: 'blue',
      reseller: 'green',
      admin: 'purple',
    };
    return colors[role] || 'gray';
  };

  onMounted(() => {
    fetchDetail();
  });
</script>

<script lang="ts">
  export default {
    name: 'TicketDetail',
  };
</script>

<style scoped lang="less">
  .ticket-detail {
    background: #fff;
    min-height: 100vh;
    max-width: 100%;
    margin: -16px -20px;
    padding: 24px 0;
  }

  .ticket-header {
    max-width: 1080px;
    margin: 0 auto;
    padding: 0 32px 20px;
    position: relative;

    &::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 32px;
      right: 32px;
      border-bottom: 1px solid #f0f0f0;
    }
  }

  .ticket-header-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 12px;
  }

  .ticket-header-left {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .ticket-no {
    font-family: monospace;
    font-size: 13px;
    color: #999;
    display: inline-flex;
    align-items: center;
    gap: 2px;

    .copy-btn {
      color: #999;
      padding: 0 2px;
    }
  }

  .ticket-title {
    margin: 0 0 12px;
    font-size: 20px;
    font-weight: 600;
    line-height: 1.4;
    color: #1d2129;
  }

  .ticket-meta {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 8px;
    font-size: 13px;
    color: #86909c;

    .meta-item {
      display: inline-flex;
      align-items: center;
      gap: 4px;
    }

    .meta-time {
      margin-left: auto;
    }
  }

  .ticket-actions {
    display: flex;
    gap: 8px;
  }

  // Timeline
  .ticket-timeline {
    max-width: 1080px;
    margin: 0 auto;
    padding: 0 32px;
  }

  .timeline-item {
    display: flex;
    gap: 14px;
    padding: 20px 0;

    & + .timeline-item {
      border-top: 1px solid #f0f0f0;
    }
  }

  .timeline-avatar {
    flex-shrink: 0;
    padding-top: 2px;
  }

  .timeline-body {
    flex: 1;
    min-width: 0;
  }

  .timeline-header {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 8px;
  }

  .timeline-name {
    font-weight: 500;
    font-size: 14px;
    color: #1d2129;
  }

  .timeline-time {
    font-size: 12px;
    color: #c0c0c0;
    margin-left: auto;
  }

  .rich-content() {
    :deep(img) {
      max-width: 100%;
      cursor: pointer;
      border-radius: 6px;
      transition: opacity 0.2s;

      &:hover {
        opacity: 0.85;
      }
    }

    :deep(pre) {
      background: #f7f8fa;
      padding: 12px;
      border-radius: 6px;
      overflow-x: auto;
      font-size: 13px;
    }

    :deep(code) {
      background: #f7f8fa;
      padding: 2px 6px;
      border-radius: 3px;
      font-size: 13px;
    }

    :deep(blockquote) {
      border-left: 3px solid #e5e6eb;
      padding-left: 12px;
      margin: 8px 0;
      color: #86909c;
    }

    :deep(p) {
      margin: 4px 0;
    }
  }

  .timeline-content {
    line-height: 1.7;
    word-wrap: break-word;
    font-size: 14px;
    color: #4e5969;
    .rich-content();
  }

  .timeline-item--staff {
    .timeline-body {
      background: #f7f8fa;
      border-radius: 8px;
      padding: 12px 16px;
    }

    .timeline-header {
      margin-bottom: 6px;
    }
  }

  // Reply form
  .ticket-reply-form {
    max-width: 1080px;
    margin: 0 auto;
    padding: 20px 32px 0;
    position: relative;

    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 32px;
      right: 32px;
      border-top: 1px solid #f0f0f0;
    }
  }
</style>
