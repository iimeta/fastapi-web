<template>
  <div class="container">
    <a-breadcrumb class="container-breadcrumb">
      <a-breadcrumb-item>
        <icon-settings />
      </a-breadcrumb-item>
      <a-breadcrumb-item>{{ $t('menu.sys') }}</a-breadcrumb-item>
      <a-breadcrumb-item>{{ $t('menu.site.config.update') }}</a-breadcrumb-item>
    </a-breadcrumb>
    <a-spin :loading="loading" style="width: 100%">
      <a-card
        class="general-card"
        :body-style="{ padding: '0 20px 20px 20px' }"
        :bordered="false"
      >
        <div class="wrapper">
          <a-form
            ref="formRef"
            :model="formData"
            class="form"
            :label-col-props="{ span: 4 }"
          >
            <a-form-item
              field="domain"
              :label="$t('site.config.label.domain')"
              :rules="[
                {
                  required: true,
                  message: $t('site.config.error.domain.required'),
                },
              ]"
            >
              <a-input
                v-model="formData.domain"
                :placeholder="$t('site.config.placeholder.domain')"
                allow-clear
              />
            </a-form-item>
            <a-form-item
              field="title"
              :label="$t('site.config.label.title')"
              :rules="[
                {
                  required: true,
                  message: $t('site.config.error.title.required'),
                },
              ]"
            >
              <a-input
                v-model="formData.title"
                :placeholder="$t('site.config.placeholder.title')"
                allow-clear
              />
            </a-form-item>
            <a-form-item
              field="logo"
              :label="$t('site.config.label.logo')"
              :rules="[
                {
                  required: true,
                  message: $t('site.config.error.logo.required'),
                },
              ]"
            >
              <a-input
                v-model="formData.logo"
                :placeholder="$t('site.config.placeholder.logo')"
                allow-clear
              />
            </a-form-item>
            <a-form-item
              field="favicon"
              :label="$t('site.config.label.favicon')"
              :rules="[
                {
                  required: true,
                  message: $t('site.config.error.favicon.required'),
                },
              ]"
            >
              <a-input
                v-model="formData.favicon"
                :placeholder="$t('site.config.placeholder.favicon')"
                allow-clear
              />
            </a-form-item>
            <a-form-item field="avatar" :label="$t('site.config.label.avatar')">
              <a-input
                v-model="formData.avatar"
                :placeholder="$t('site.config.placeholder.avatar')"
                allow-clear
              />
            </a-form-item>
            <a-form-item field="bg_img" :label="$t('site.config.label.bg_img')">
              <a-input
                v-model="formData.bg_img"
                :placeholder="$t('site.config.placeholder.bg_img')"
                allow-clear
              />
            </a-form-item>
            <a-form-item
              field="copyright"
              :label="$t('site.config.label.copyright')"
            >
              <a-input
                v-model="formData.copyright"
                :placeholder="$t('site.config.placeholder.copyright')"
                allow-clear
              />
            </a-form-item>
            <a-form-item
              field="jump_url"
              :label="$t('site.config.label.jump_url')"
            >
              <a-input
                v-model="formData.jump_url"
                :placeholder="$t('site.config.placeholder.jump_url')"
                allow-clear
              />
            </a-form-item>
            <a-form-item
              field="keywords"
              :label="$t('site.config.label.keywords')"
            >
              <a-input
                v-model="formData.keywords"
                :placeholder="$t('site.config.placeholder.keywords')"
                allow-clear
              />
            </a-form-item>
            <a-form-item
              field="description"
              :label="$t('site.config.label.description')"
            >
              <a-input
                v-model="formData.description"
                :placeholder="$t('site.config.placeholder.description')"
                allow-clear
              />
            </a-form-item>
            <a-form-item
              field="icp_beian"
              :label="$t('site.config.label.icp_beian')"
            >
              <a-input
                v-model="formData.icp_beian"
                :placeholder="$t('site.config.placeholder.icp_beian')"
                allow-clear
              />
            </a-form-item>
            <a-form-item
              field="ga_beian"
              :label="$t('site.config.label.ga_beian')"
            >
              <a-input
                v-model="formData.ga_beian"
                :placeholder="$t('site.config.placeholder.ga_beian')"
                allow-clear
              />
            </a-form-item>
            <a-form-item
              field="register_tips"
              :label="$t('site.config.label.register_tips')"
            >
              <a-input
                v-model="formData.register_tips"
                :placeholder="$t('site.config.placeholder.register_tips')"
                allow-clear
              />
            </a-form-item>
            <a-form-item
              v-if="!formData.register_tips"
              field="grant_quota"
              :label="$t('site.config.label.grant_quota')"
            >
              <a-input-number
                v-model="formData.grant_quota"
                :placeholder="$t('site.config.placeholder.grant_quota')"
                :min="0.000001"
                :max="9999999999999"
                :parser="parserPrice"
                allow-clear
              >
                <template #prefix> $ </template>
              </a-input-number>
            </a-form-item>
            <a-form-item v-if="!formData.register_tips">
              <a-radio-group type="button" @change="handleQuotaQuickChange">
                <a-radio :value="1"> $1 </a-radio>
                <a-radio :value="2"> $2 </a-radio>
                <a-radio :value="5"> $5 </a-radio>
                <a-radio :value="10"> $10 </a-radio>
                <a-radio :value="20"> $20 </a-radio>
                <a-radio :value="50"> $50 </a-radio>
                <a-radio :value="100"> $100 </a-radio>
                <a-radio :value="200"> $200 </a-radio>
                <a-radio :value="1000"> $1000 </a-radio>
                <a-radio :value="10000"> $10000 </a-radio>
              </a-radio-group>
            </a-form-item>
            <a-form-item
              v-if="!formData.register_tips"
              field="quota_expires_at"
              :label="$t('site.config.label.quota_expires_at')"
            >
              <a-input-number
                v-model="formData.quota_expires_at"
                :placeholder="$t('site.config.placeholder.quota_expires_at')"
                :precision="0"
                :min="1"
                allow-clear
              />
            </a-form-item>
            <a-form-item
              field="support_email_suffix"
              :label="$t('site.config.label.support_email_suffix')"
            >
              <a-input
                v-model="formData.support_email_suffix"
                :placeholder="
                  $t('site.config.placeholder.support_email_suffix')
                "
                allow-clear
              />
            </a-form-item>
            <a-form-item
              field="register_welcome"
              :label="$t('site.config.label.register_welcome')"
            >
              <a-textarea
                v-model="formData.register_welcome"
                :placeholder="$t('site.config.placeholder.register_welcome')"
                :auto-size="{ minRows: 3, maxRows: 20 }"
              />
            </a-form-item>
            <a-form-item field="host" :label="$t('site.config.label.host')">
              <a-input
                v-model="formData.host"
                :placeholder="$t('site.config.placeholder.host')"
                allow-clear
              />
            </a-form-item>
            <a-form-item field="port" :label="$t('site.config.label.port')">
              <a-input-number
                v-model="formData.port"
                :placeholder="$t('site.config.placeholder.port')"
                :precision="0"
                :min="1"
                allow-clear
              />
            </a-form-item>
            <a-form-item
              field="user_name"
              :label="$t('site.config.label.user_name')"
            >
              <a-input
                v-model="formData.user_name"
                :placeholder="$t('site.config.placeholder.user_name')"
                allow-clear
              />
            </a-form-item>
            <a-form-item
              field="password"
              :label="$t('site.config.label.password')"
            >
              <a-input
                v-model="formData.password"
                :placeholder="$t('site.config.placeholder.password')"
                allow-clear
              />
            </a-form-item>
            <a-form-item
              field="from_name"
              :label="$t('site.config.label.from_name')"
            >
              <a-input
                v-model="formData.from_name"
                :placeholder="$t('site.config.placeholder.from_name')"
                allow-clear
              />
            </a-form-item>
            <a-form-item
              field="carousel1_title"
              :label="$t('site.config.label.carousel1_title')"
            >
              <a-input
                v-model="formData.carousel1_title"
                :placeholder="$t('site.config.placeholder.carousel1_title')"
                allow-clear
              />
            </a-form-item>
            <a-form-item
              v-for="(carousels, index) of formData.carousels1"
              :key="index"
              :label="`${index + 1}. ` + $t('site.config.label.carousels1')"
            >
              <a-input
                v-model="formData.carousels1[index].image_url"
                :placeholder="
                  $t('site.config.placeholder.carousels1.image_url')
                "
                style="width: 42%; margin-right: 5px"
              />
              <a-input
                v-model="formData.carousels1[index].jump_url"
                :placeholder="$t('site.config.placeholder.carousels1.jump_url')"
                style="width: 42%"
              />
              <a-button
                type="primary"
                shape="circle"
                style="margin: 0 10px 0 10px"
                @click="handleCarousels1Add()"
              >
                <icon-plus />
              </a-button>
              <a-button
                type="secondary"
                shape="circle"
                @click="handleCarousels1Del(index)"
              >
                <icon-minus />
              </a-button>
            </a-form-item>
            <a-form-item
              field="carousel2_title"
              :label="$t('site.config.label.carousel2_title')"
            >
              <a-input
                v-model="formData.carousel2_title"
                :placeholder="$t('site.config.placeholder.carousel2_title')"
                allow-clear
              />
            </a-form-item>
            <a-form-item
              v-for="(carousels, index) of formData.carousels2"
              :key="index"
              :label="`${index + 1}. ` + $t('site.config.label.carousels2')"
            >
              <a-input
                v-model="formData.carousels2[index].image_url"
                :placeholder="
                  $t('site.config.placeholder.carousels2.image_url')
                "
                style="width: 42%; margin-right: 5px"
              />
              <a-input
                v-model="formData.carousels2[index].jump_url"
                :placeholder="$t('site.config.placeholder.carousels2.jump_url')"
                style="width: 42%"
              />
              <a-button
                type="primary"
                shape="circle"
                style="margin: 0 10px 0 10px"
                @click="handleCarousels2Add()"
              >
                <icon-plus />
              </a-button>
              <a-button
                type="secondary"
                shape="circle"
                @click="handleCarousels2Del(index)"
              >
                <icon-minus />
              </a-button>
            </a-form-item>
            <a-form-item
              field="announcement_title"
              :label="$t('site.config.label.announcement_title')"
            >
              <a-input
                v-model="formData.announcement_title"
                :placeholder="$t('site.config.placeholder.announcement_title')"
                allow-clear
              />
            </a-form-item>
            <a-form-item
              field="announcement_more_url"
              :label="$t('site.config.label.announcement_more_url')"
            >
              <a-input
                v-model="formData.announcement_more_url"
                :placeholder="
                  $t('site.config.placeholder.announcement_more_url')
                "
                allow-clear
              />
            </a-form-item>
            <a-form-item
              v-for="(announcements, index) of formData.announcements"
              :key="index"
              :label="`${index + 1}. ` + $t('site.config.label.announcements')"
            >
              <a-input
                v-model="formData.announcements[index].content"
                :placeholder="
                  $t('site.config.placeholder.announcements.content')
                "
                style="width: 42%; margin-right: 5px"
              />
              <a-input
                v-model="formData.announcements[index].jump_url"
                :placeholder="
                  $t('site.config.placeholder.announcements.jump_url')
                "
                style="width: 42%"
              />
              <a-button
                type="primary"
                shape="circle"
                style="margin: 0 10px 0 10px"
                @click="handleAnnouncementsAdd()"
              >
                <icon-plus />
              </a-button>
              <a-button
                type="secondary"
                shape="circle"
                @click="handleAnnouncementsDel(index)"
              >
                <icon-minus />
              </a-button>
            </a-form-item>
            <a-form-item
              field="document_title"
              :label="$t('site.config.label.document_title')"
            >
              <a-input
                v-model="formData.document_title"
                :placeholder="$t('site.config.placeholder.document_title')"
                allow-clear
              />
            </a-form-item>
            <a-form-item
              field="document_more_url"
              :label="$t('site.config.label.document_more_url')"
            >
              <a-input
                v-model="formData.document_more_url"
                :placeholder="$t('site.config.placeholder.document_more_url')"
                allow-clear
              />
            </a-form-item>
            <a-form-item
              v-for="(documents, index) of formData.documents"
              :key="index"
              :label="`${index + 1}. ` + $t('site.config.label.documents')"
            >
              <a-input
                v-model="formData.documents[index].title"
                :placeholder="$t('site.config.placeholder.documents.title')"
                style="width: 42%; margin-right: 5px"
              />
              <a-input
                v-model="formData.documents[index].jump_url"
                :placeholder="$t('site.config.placeholder.documents.jump_url')"
                style="width: 42%"
              />
              <a-button
                type="primary"
                shape="circle"
                style="margin: 0 10px 0 10px"
                @click="handleDocumentsAdd()"
              >
                <icon-plus />
              </a-button>
              <a-button
                type="secondary"
                shape="circle"
                @click="handleDocumentsDel(index)"
              >
                <icon-minus />
              </a-button>
            </a-form-item>
            <a-form-item
              field="recharge_tips"
              :label="$t('site.config.label.recharge_tips')"
            >
              <a-input
                v-model="formData.recharge_tips"
                :placeholder="$t('site.config.placeholder.recharge_tips')"
                allow-clear
              />
            </a-form-item>
            <a-form-item field="remark" :label="$t('site.config.label.remark')">
              <a-textarea
                v-model="formData.remark"
                :placeholder="$t('site.config.placeholder.remark')"
              />
            </a-form-item>
            <a-space>
              <div class="submit-btn">
                <a-button
                  type="secondary"
                  @click="
                    $router.push({
                      name: 'SiteConfig',
                    })
                  "
                >
                  {{ $t('button.cancel') }}
                </a-button>
                <a-button type="primary" @click="submitForm">
                  {{ $t('button.submit') }}
                </a-button>
              </div>
            </a-space>
          </a-form>
        </div>
      </a-card>
    </a-spin>
  </div>
</template>

<script lang="ts" setup>
  import { ref, getCurrentInstance } from 'vue';
  import useLoading from '@/hooks/loading';
  import { parserPrice } from '@/utils/common';
  import {
    submitSiteConfigUpdate,
    SiteConfigUpdate,
    querySiteConfigDetail,
    SiteConfigDetailParams,
    Carousel,
    Announcement,
    Document,
  } from '@/api/site_config';
  import { FormInstance } from '@arco-design/web-vue';
  import { useRouter, useRoute } from 'vue-router';

  const { proxy } = getCurrentInstance() as any;

  const router = useRouter();
  const route = useRoute();
  const formRef = ref<FormInstance>();
  const formData = ref<SiteConfigUpdate>({
    id: '',
    domain: '',
    title: '',
    logo: '',
    favicon: '',
    avatar: '',
    bg_img: '',
    copyright: '',
    jump_url: '',
    keywords: '',
    description: '',
    icp_beian: '',
    ga_beian: '',
    register_tips: '',
    grant_quota: ref(),
    quota_expires_at: ref(),
    support_email_suffix: ref(),
    register_welcome: '',
    host: '',
    port: ref(),
    user_name: '',
    password: '',
    from_name: '',
    carousel1_title: '',
    carousels1: [],
    carousel2_title: '',
    carousels2: [],
    announcement_title: '',
    announcement_more_url: '',
    announcements: [],
    document_title: '',
    document_more_url: '',
    documents: [],
    recharge_tips: '',
    remark: '',
    status: 1,
  });

  const { loading, setLoading } = useLoading(false);
  const submitForm = async () => {
    const res = await formRef.value?.validate();
    if (!res) {
      setLoading(true);
      try {
        if (formData.value.support_email_suffix) {
          formData.value.support_email_suffix =
            formData.value.support_email_suffix.split(',');
        }

        const carousels1RemoveIndexes: number[] = [];
        formData.value.carousels1.forEach((item, index) => {
          if (!item.image_url && !item.jump_url) {
            carousels1RemoveIndexes.push(index);
          }
        });

        carousels1RemoveIndexes.reverse().forEach((item) => {
          formData.value.carousels1.splice(item, 1);
        });

        const carousels2RemoveIndexes: number[] = [];
        formData.value.carousels2.forEach((item, index) => {
          if (!item.image_url && !item.jump_url) {
            carousels2RemoveIndexes.push(index);
          }
        });

        carousels2RemoveIndexes.reverse().forEach((item) => {
          formData.value.carousels2.splice(item, 1);
        });

        const announcementsRemoveIndexes: number[] = [];
        formData.value.announcements.forEach((item, index) => {
          if (!item.content && !item.jump_url) {
            announcementsRemoveIndexes.push(index);
          }
        });

        announcementsRemoveIndexes.reverse().forEach((item) => {
          formData.value.announcements.splice(item, 1);
        });

        const documentsRemoveIndexes: number[] = [];
        formData.value.documents.forEach((item, index) => {
          if (!item.title && !item.jump_url) {
            documentsRemoveIndexes.push(index);
          }
        });

        documentsRemoveIndexes.reverse().forEach((item) => {
          formData.value.documents.splice(item, 1);
        });

        await submitSiteConfigUpdate(formData.value).then(() => {
          proxy.$message.success('更新成功');
          router.push({
            name: 'SiteConfig',
          });
        });
      } catch (err) {
        if (formData.value.support_email_suffix) {
          formData.value.support_email_suffix =
            formData.value.support_email_suffix.join(',');
        }
      } finally {
        setLoading(false);
      }
    }
  };

  const getSiteConfigDetail = async (
    params: SiteConfigDetailParams = { id: route.query.id }
  ) => {
    setLoading(true);
    try {
      const { data } = await querySiteConfigDetail(params);
      formData.value.id = data.id;
      formData.value.domain = data.domain;
      formData.value.title = data.title;
      formData.value.logo = data.logo;
      formData.value.favicon = data.favicon;
      formData.value.avatar = data.avatar;
      formData.value.bg_img = data.bg_img;
      formData.value.copyright = data.copyright;
      formData.value.jump_url = data.jump_url;
      formData.value.keywords = data.keywords;
      formData.value.description = data.description;
      formData.value.icp_beian = data.icp_beian;
      formData.value.ga_beian = data.ga_beian;
      formData.value.register_tips = data.register_tips;
      formData.value.grant_quota = data.grant_quota;
      formData.value.quota_expires_at = data.quota_expires_at;
      formData.value.support_email_suffix =
        data.support_email_suffix?.join(',');
      formData.value.register_welcome = data.register_welcome;
      formData.value.host = data.host;
      formData.value.port = data.port;
      formData.value.user_name = data.user_name;
      formData.value.password = data.password;
      formData.value.from_name = data.from_name;
      formData.value.carousel1_title = data.carousel1_title;
      formData.value.carousels1 = data.carousels1;
      formData.value.carousel2_title = data.carousel2_title;
      formData.value.carousels2 = data.carousels2;
      formData.value.announcement_title = data.announcement_title;
      formData.value.announcement_more_url = data.announcement_more_url;
      formData.value.announcements = data.announcements;
      formData.value.document_title = data.document_title;
      formData.value.document_more_url = data.document_more_url;
      formData.value.documents = data.documents;
      formData.value.recharge_tips = data.recharge_tips;
      formData.value.remark = data.remark;
      formData.value.status = data.status;

      if (
        !formData.value.carousels1 ||
        formData.value.carousels1.length === 0
      ) {
        formData.value.carousels1 = [];
        handleCarousels1Add();
      }

      if (
        !formData.value.carousels2 ||
        formData.value.carousels2.length === 0
      ) {
        formData.value.carousels2 = [];
        handleCarousels2Add();
      }

      if (
        !formData.value.announcements ||
        formData.value.announcements.length === 0
      ) {
        formData.value.announcements = [];
        handleAnnouncementsAdd();
      }

      if (!formData.value.documents || formData.value.documents.length === 0) {
        formData.value.documents = [];
        handleDocumentsAdd();
      }
    } catch (err) {
      // you can report use errorHandler or other
    } finally {
      setLoading(false);
    }
  };
  getSiteConfigDetail();

  const handleQuotaQuickChange = (quota: number) => {
    formData.value.grant_quota = quota;
  };

  const handleCarousels1Add = () => {
    const carousel: Carousel = {
      image_url: '',
      jump_url: '',
    };
    formData.value.carousels1.push(carousel);
  };

  const handleCarousels1Del = (index: number) => {
    formData.value.carousels1.splice(index, 1);
  };

  const handleCarousels2Add = () => {
    const carousel: Carousel = {
      image_url: '',
      jump_url: '',
    };
    formData.value.carousels2.push(carousel);
  };

  const handleCarousels2Del = (index: number) => {
    formData.value.carousels2.splice(index, 1);
  };

  const handleAnnouncementsAdd = () => {
    const carousel: Announcement = {
      content: '',
      jump_url: '',
    };
    formData.value.announcements.push(carousel);
  };

  const handleAnnouncementsDel = (index: number) => {
    formData.value.announcements.splice(index, 1);
  };

  const handleDocumentsAdd = () => {
    const document: Document = {
      title: '',
      jump_url: '',
    };
    formData.value.documents.push(document);
  };

  const handleDocumentsDel = (index: number) => {
    formData.value.documents.splice(index, 1);
  };
</script>

<script lang="ts">
  export default {
    name: 'SiteConfigUpdate',
  };
</script>

<style scoped lang="less">
  .container {
    padding: 0 10px 20px 10px;
  }

  .container-breadcrumb {
    margin: 6px 0;
    :deep(.arco-breadcrumb-item) {
      color: rgb(var(--gray-6));
      &:last-child {
        color: rgb(var(--gray-8));
      }
    }
  }

  .general-card {
    &:first-child {
      padding-top: 61px;
    }
  }

  .wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: var(--color-bg-2);
    :deep(.arco-form) {
      .arco-form-item {
        width: 700px;
        &:first-child {
          margin-top: 20px;
        }
      }
    }
  }

  .form {
    align-items: center;
  }

  .submit-btn {
    width: 300px;
    display: flex;
    button {
      flex: 1;
      margin: 20px 30px;
    }
  }
</style>
