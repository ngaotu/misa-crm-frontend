<template>
    <div class="customer-form-page flex flex-col flex-1 overflow-hidden">
        <!-- Toolbar -->
        <div class="toolbar flex flex-row items-center justify-between">
            <div class="toolbar-left flex flex-row items-center gap-16">
                <h2 class="page-title">{{ pageTitle }}</h2>

                <div class="dropdown-wrapper flex flex-row items-center justify-between">
                    <span class="dropdown-title">Mẫu tiêu chuẩn</span>
                    <span class="icon icon-dropdown"></span>
                </div>

                <MsButton variant="text" title="Sửa giao diện" class="toolbar-fix-layout">
                    <span>Sửa bố cục</span>
                </MsButton>
            </div>

            <div class="toolbar-right flex flex-row items-center gap-8">
                <MsButton class="custom-toolbar-btn" variant="outline" @click="handleCancel">
                    Hủy bỏ
                </MsButton>

                <MsButton class="custom-toolbar-btn" variant="outline" @click="onSubmitAndAdd">
                    Lưu và thêm
                </MsButton>

                <MsButton class="custom-toolbar-btn" variant="primary" @click="onSubmit">
                    Lưu
                </MsButton>
            </div>
        </div>

        <!-- Form Container -->
        <div class="form-container flex-1 overflow-auto">


            <div class="form-content">
                <form @submit.prevent="onSubmit">
                    <!-- Avatar in form for file submit -->
                    <div class="form-row form-header avatar-form-row">
                        <div class="form-col col-12">
                            <div class="avatar-placeholder flex flex-col gap-8">
                                <span class="avatar-title">Ảnh</span>
                                <span v-if="!customerAvatar" class="icon-user avatar-icon"
                                    @click="showAvatarModal = true"></span>
                                <img v-else :src="customerAvatar" class="avatar-image"
                                    @click="showAvatarModal = true" />
                            </div>
                        </div>
                    </div>
                    <!-- Section Title -->
                    <div class=" form-row section-title">Thông tin chung</div>
                    <!-- Row 1 -->
                    <div class="form-row">
                        <div class="form-col col-6">
                            <MsInput v-model="customerCode" label="Mã khách hàng" :disabled="true"
                                :error-message="errors.customerCode" />
                        </div>
                        <div class="form-col col-6">
                            <MsInput  ref="firstInputRef" v-model="customerFullName" label="Tên khách hàng" :required="true"
                                :error-message="errors.customerFullName" :autofocus="true" @blur="onFullNameBlur" />
                        </div>
                    </div>
                    <!-- Row 2 -->
                    <div class="form-row">
                        <div class="form-col col-6">
                            <MsInput v-model="customerPhone" label="Điện thoại" type="tel"
                                :error-message="errors.customerPhone" @blur="onPhoneBlur" />
                        </div>
                        <div class="form-col col-6">
                            <MsInput v-model="customerEmail" label="Email" type="email"
                                :error-message="errors.customerEmail" @blur="onEmailBlur" />
                        </div>
                    </div>
                    <!-- Row 3 -->
                    <div class="form-row">
                        <div class="form-col col-6">
                            <MsInput v-model="customerTaxCode" label="Mã số thuế"
                                :error-message="errors.customerTaxCode" />
                        </div>
                        <div class="form-col col-6">
                            <MsSelect v-model="customerType" label="Loại khách hàng" placeholder=""
                                :options="customerTypeOptions" :error-message="errors.customerType"
                                customDropdownIcon="icon-account-category" />
                        </div>
                    </div>



                    <!-- Row 4 -->
                    <div class="form-row">
                        <div class="form-col col-6">
                            <MsInput v-model="customerShippingAddr" label="Địa chỉ (Giao hàng)"
                                :error-message="errors.customerShippingAddr" />
                        </div>
                        <div class="form-col col-6">
                            <MsDatePicker v-model="customerLastPurchaseDate" label="Ngày mua hàng gần nhất"
                                :max-date="new Date()" :error-message="errors.customerLastPurchaseDate" />
                        </div>
                    </div>

                    <!-- Row 5 -->
                    <div class="form-row">
                        <div class="form-col col-6">
                            <MsInput v-model="customerPurchasedItems" label="Hàng hóa đã mua"
                                :error-message="errors.customerPurchasedItems" />
                        </div>
                        <div class="form-col col-6">
                            <MsInput v-model="customerLastestPurchasedItems" label="Tên hàng hóa đã mua"
                                :error-message="errors.customerLastestPurchasedItems" />
                        </div>
                    </div>
                </form>
                <MsModal v-model="showAvatarModal">
                    <div class="avatar-upload-modal">
                        <h3 class="avatar-modal-title">Chọn ảnh</h3>
                        <div class="avatar-dropzone-rect" @dragover.prevent="onAvatarDragOver"
                            @dragleave.prevent="onAvatarDragLeave" @drop.prevent="onAvatarDrop">
                            <template v-if="!avatarPreview">
                                <div class="avatar-dropzone-content-rect">
                                    <span class="avatar-dropzone-title">Kéo và thả vào đây</span>
                                    <span class="avatar-dropzone-or">hoặc</span>
                                    <MsButton variant="outline" @click="triggerAvatarInput"><span
                                            class="icon icon-attach-file"></span> Chọn ảnh</MsButton>
                                    <input ref="avatarInputRef" type="file" accept="image/*" style="display:none"
                                        @change="onAvatarFileChange" />
                                </div>
                            </template>
                            <template v-else>
                                <div class="avatar-preview-rect">
                                    <img :src="avatarPreview" class="avatar-preview-image-rect" />
                                    <!-- <MsButton variant="outline" @click="removeAvatarPreview">Xóa</MsButton> -->
                                </div>
                            </template>
                        </div>
                        <div class="avatar-modal-actions">
                            <MsButton v-if="avatarPreview" variant="outline" @click="removeAvatarPreview"
                                class="custom-toolbar-btn">Xóa
                            </MsButton>
                            <MsButton variant="outline" @click="showAvatarModal = false" class="custom-toolbar-btn">Đóng
                            </MsButton>
                            <MsButton variant="primary" :disabled="!avatarFile" @click="saveAvatarPreview"
                                class="custom-toolbar-btn">Lưu
                            </MsButton>
                        </div>
                    </div>
                </MsModal>
            </div>
        </div>
    </div>
</template>

<script setup>

import { ref, onMounted, computed, watch, useTemplateRef, nextTick } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useForm, useField } from 'vee-validate';
import { useToastNotification } from '@/composables/useToast.js';
import MsButton from '@/components/ms-button/MsButton.vue';
import MsInput from '@/components/ms-form-field/MsInput.vue';
import MsSelect from '@/components/ms-form-field/MsSelect.vue';
import MsDatePicker from '@/components/ms-form-field/MsDatePicker.vue';
import MsModal from '@/components/ms-modal/MsModal.vue';
import { CustomerAPI } from '@/apis';
import { customerSchema } from '@/schemas/customerschema';
import { useGenerateCode } from '@/composables/useGenerateCode.js';

const router = useRouter();
const route = useRoute();
const customerAPI = new CustomerAPI();
const { showSuccess, showError } = useToastNotification();
const firstInputRef = useTemplateRef('firstInputRef');
// Setup vee-validate form
const formContext = useForm({
    validationSchema: customerSchema,

});
const { handleSubmit, errors, resetForm: resetVeeForm } = formContext;

// Define form fields với useField
const { value: customerCode } = useField('customerCode');
const { value: customerFullName, handleBlur: markFullNameTouched, 
    validate: validateCustomerFullName } = useField('customerFullName', customerSchema.customerFullName, {
    validateOnValueUpdate: false, validateOnBlur: true,
});
const { value: customerType } = useField('customerType');
const { value: customerTaxCode } = useField('customerTaxCode');
// const { value: customerPhone } = useField('customerPhone');
const { value: customerPhone, handleBlur: markPhoneTouched,
        validate: validateCustomerPhone } = useField('customerPhone', customerSchema.customerPhone, {
        validateOnValueUpdate: false, validateOnBlur: true,
});
const { value: customerEmail, handleBlur: markEmailTouched, 
    validate: validateCustomerEmail } = useField('customerEmail', customerSchema.customerEmail, {
    validateOnValueUpdate: false, validateOnBlur: true,
});
const { value: customerShippingAddr } = useField('customerShippingAddr');
const { value: customerLastPurchaseDate } = useField('customerLastPurchaseDate');
const { value: customerPurchasedItems } = useField('customerPurchasedItems');
const { value: customerLastestPurchasedItems } = useField('customerLastestPurchasedItems');

/**
 * Xử lý blur tên khách hàng
 */
const onFullNameBlur = () => {
    markFullNameTouched();
    validateCustomerFullName(); 
};

/**
 * Xử lý blur số điện thoại
 */
const onPhoneBlur = () => {
    markPhoneTouched();
    validateCustomerPhone();
};
/**
 * Xử lý blur email
 */
const onEmailBlur = () => {
    markEmailTouched();
    validateCustomerEmail();
};
// Customer type options
const customerTypeOptions = [
    { value: 'NBH01', label: 'NBH01' },
    { value: 'LKHA', label: 'LKHA' },
    { value: 'VIP', label: 'VIP' }
];

const customerId = computed(() => route.params.id || null);
const isEditMode = computed(() => !!customerId.value);
const pageTitle = computed(() => isEditMode.value ? 'Sửa Khách hàng' : 'Thêm Khách hàng');

/**
 * Reset form về trạng thái ban đầu
 * Author: NTT (19/11/2025)
 */
const resetForm = () => {
    resetVeeForm({
        values: {
            customerCode: null,
            customerFullName: null,
            customerType: null,
            customerTaxCode: null,
            customerPhone: null,
            customerEmail: null,
            customerShippingAddr: null,
            customerLastPurchaseDate: null,
            customerPurchasedItems: null,
            customerLastestPurchasedItems: null,
            customerAvatar: null,
        },
        touched: {},
        errors: {}
    });
    customerAvatar.value = null;
    avatarFile.value = null;
    avatarPreview.value = null;
    generateCustomerCode();
    setFocus();
};

/**
 * Xử lý hủy bỏ và quay lại danh sách
 * Author: NTT (19/11/2025)
 */
const handleCancel = () => {
    router.push({ name: 'Customers' });
};

/**
 * Lấy thông tin khách hàng nếu có customerId
 * Author: NTT (19/11/2025)
 */
async function fetchCustomerDetail() {
    if (!customerId.value) return;
    try {
        const res = await customerAPI.getById(customerId.value);
        if (res && res.data) {
            resetVeeForm({ values: convertEmptyStringsToNull(res.data) });
            if (res.data.customerAvatar) {
                customerAvatar.value = res.data.customerAvatar.startsWith('/')
                    ? `${import.meta.env.VITE_IMAGE_URL}${res.data.customerAvatar}`
                    : res.data.customerAvatar;
            }
        }
    } catch (err) {
        showError('Không lấy được thông tin khách hàng');
    }
}

/**
 * Xử lý lưu khách hàng
 * Author: NTT (19/11/2025)
 */
const onSubmit = handleSubmit(async (values) => {
    const normalizedValues = convertEmptyStringsToNull(values);
    try {
        let response;
        let payload;
        // Nếu có file avatar, dùng FormData để gửi kiểu multipart
        if (avatarFile.value) {
            payload = new FormData();
            Object.entries(normalizedValues).forEach(([key, val]) => {
                payload.append(key, val ?? '');
            });
            payload.append('avatar', avatarFile.value);
        } else {
            payload = normalizedValues;
        }
        console.log('Payload:', payload);
        if (isEditMode.value) {
            response = await customerAPI.update(customerId.value, payload);
        } else {
            response = await customerAPI.create(payload);
        }
        if (!response.error) {
            showSuccess(isEditMode.value ? 'Cập nhật khách hàng thành công!' : 'Lưu khách hàng thành công!');
            router.push({ name: 'Customers' });
        } else {
            showError(response.error.message || 'Có lỗi xảy ra khi lưu khách hàng');
        }
    } catch (error) {
        let message = isEditMode.value ? 'Không thể cập nhật khách hàng. Vui lòng thử lại sau.' : 'Không thể lưu khách hàng. Vui lòng thử lại sau.';
        if (error.response && error.response.data && error.response.data.error) {
            message = error.response.data.error.message || message;
        }
        showError(message);
    }
});

/**
 * Xử lý submit form và thêm mới khách hàng, gửi dữ liệu và file avatar lên server
 * Sau khi lưu xong, tiếp tục thêm mới khách hàng
 * @param {Object} values - Dữ liệu form đã validate
 * Author: NTT (22/11/2025)
 */
const onSubmitAndAdd = handleSubmit(async (values) => {
    const normalizedValues = convertEmptyStringsToNull(values);
    try {
        let response;
        let payload;
        if (avatarFile.value) {
            payload = new FormData();
            Object.entries(normalizedValues).forEach(([key, val]) => {
                payload.append(key, val ?? '');
            });
            payload.append('avatar', avatarFile.value);
        } else {
            payload = normalizedValues;
        }
        if (isEditMode.value) {
            response = await customerAPI.update(customerId.value, payload);
            if (!response.error) {
                showSuccess('Cập nhật khách hàng thành công!');
                router.replace({ name: 'CustomerCreate' });
                setTimeout(() => {
                    resetForm();
                }, 0);
            } else {
                showError(response.error.message || 'Có lỗi xảy ra khi cập nhật khách hàng');
            }
        } else {
            response = await customerAPI.create(payload);
            if (!response.error) {
                showSuccess('Lưu khách hàng thành công!');
                resetForm();
            } else {
                showError(response.error.message || 'Có lỗi xảy ra khi lưu khách hàng');
            }
        }
    } catch (error) {
        let message = isEditMode.value ? 'Không thể cập nhật khách hàng. Vui lòng thử lại sau.' : 'Không thể lưu khách hàng. Vui lòng thử lại sau.';
        if (error.response && error.response.data && error.response.data.error) {
            message = error.response.data.error.message || message;
        }
        showError(message);
        console.error('Error saving customer:', error);
    }
});

/**
 * Convert tất cả giá trị rỗng ("") thành null trong object
 * @param {Object} formValues - object values từ handleSubmit
 * @returns {Object} object mới với "" → null
 */
function convertEmptyStringsToNull(formValues) {
    const result = {};
    Object.keys(formValues).forEach(key => {
        const value = formValues[key];
        if (typeof value === 'string' && value.trim() === '') {
            result[key] = null;
        } else if (Array.isArray(value)) {
            result[key] = value.map(v => (v === '' ? null : v));
        } else {
            result[key] = value;
        }
    });
    return result;
}
/**
 * Kiểm tra trùng số điện thoại khi blur
 * Author: NTT
 * Date: 23/11/2025
 * @returns {Promise<void>}
 */


/**
 * Generate customer code khi component được mount
 * @returns {Promise<void>}
 * Author: NTT
 * Date: 19/11/2025
 */
const generateCustomerCode = async () => {
    try {
        const response = await useGenerateCode();
        if (response && !response.error) {
            customerCode.value = response.data;
        }
    } catch (error) {
        console.error('Error generating customer code:', error);
    }
};

const customerAvatar = ref(null);
const showAvatarModal = ref(false);
const avatarFile = ref(null);
const avatarPreview = ref(null);
const avatarInputRef = ref(null);

/**
 * Xử lý drag-over khi kéo file vào vùng drop avatar
 * Author: NTT (22/11/2025)
 * @returns {void}
 */
const onAvatarDragOver = () => { };

/**
 * Xử lý drag-leave khi rời khỏi vùng drop avatar
 * Author: NTT (22/11/2025)
 * @returns {void}
 */
const onAvatarDragLeave = () => { };

/**
 * Xử lý drop file vào vùng drop avatar
 * Author: NTT (22/11/2025)
 * @param {DragEvent} e - Sự kiện drop
 * @returns {void}
 */
const onAvatarDrop = (e) => {
    const files = e.dataTransfer.files;
    if (files && files.length) {
        handleAvatarFile(files[0]);
    }
};

/**
 * Trigger input chọn file avatar
 * Author: NTT (22/11/2025)
 * @returns {void}
 */
const triggerAvatarInput = () => {
    avatarInputRef.value.click();
};

/**
 * Xử lý khi chọn file avatar từ input
 * Author: NTT (22/11/2025)
 * @param {Event} e - Sự kiện change
 * @returns {void}
 */
const onAvatarFileChange = (e) => {
    const file = e.target.files[0];
    handleAvatarFile(file);
};

/**
 * Xử lý file avatar (tạo preview)
 * Author: NTT (22/11/2025)
 * @param {File} file - File ảnh
 * @returns {void}
 */
function handleAvatarFile(file) {
    if (!file) return;
    avatarFile.value = file;
    avatarPreview.value = URL.createObjectURL(file);
}

/**
 * Xóa preview avatar
 * Author: NTT (22/11/2025)
 * @returns {void}
 */
const removeAvatarPreview = () => {
    avatarFile.value = null;
    avatarPreview.value = null;
};

/**
 * Lưu preview avatar vào form
 * Author: NTT (22/11/2025)
 * @returns {void}
 */
function saveAvatarPreview() {
    if (avatarPreview.value) {
        customerAvatar.value = avatarPreview.value;
        showAvatarModal.value = false;
    }
}
/**
 * Thiết lập focus cho trường đầu tiên khi component được mount
 * Author: NTT (19/11/2025)
 */
const setFocus = () => {
    nextTick(() => {
        console.log('Focus called');
        firstInputRef.value?.focus();
    });
    
};
onMounted(() => {
    if (isEditMode.value) {
        fetchCustomerDetail();
    } else {
        generateCustomerCode();
    }
    setFocus();
});
watch(customerId, (newId, oldId) => {
    if (newId) {
        fetchCustomerDetail();
    } else {
        resetForm();
    }
    // setFocus();
});


</script>

<style scoped>
.customer-form-page {
    display: flex;
    flex-direction: column;
    height: 100%;
    background: var(--background-main-color);
}

/* Toolbar */
.toolbar {
    min-height: var(--toolbar-height);
    max-height: var(--toolbar-height);
    padding: 0 16px;
    background: #e2e4e9;
    border-bottom: 1px solid var(--border-secondary);
    gap: 16px;
}

.toolbar-left {
    display: flex;
    align-items: center;
    gap: 8px;
}

.toolbar-right {
    display: flex;
    align-items: center;
    gap: 8px;
}

.page-title {
    font-size: 20px;
    font-weight: var(--font-weight-medium);
    color: var(--text-color);
    margin: 0;
}

.dropdown-wrapper {
    padding: 5px 0 0 8px;
    cursor: pointer;
}



.dropdown-title {
    font-weight: var(--font-weight-medium);
    font-size: 16px;
    color: var(--text-color);
    margin-right: 8px;
}

/* Form Container */
.form-container {
    flex: 1;
    background: var(--background-white);
    padding-top: 32px;
}

/* Form Header - Avatar */
.form-row.form-header {
    display: flex;
    align-items: center;
    margin-bottom: 40px;
}

.form-header .avatar-placeholder .avatar-title {
    font-size: var(--font-size-title);
    font-weight: var(--font-weight-medium);
    color: var(--text-color);
    margin-bottom: 16px;
}

/* Avatar upload modal redesign */
.avatar-upload-modal {
    padding: 16px 0px;
    text-align: left;
}

.avatar-modal-title {
    font-size: 16px;
    font-weight: 600;
    margin-bottom: 16px;
}

.avatar-dropzone-rect {
    border: 2px dashed var(--border-color);
    border-radius: 8px;
    padding: 0;
    margin-bottom: 16px;
    transition: border-color 0.3s;
    width: 100%;
    height: 240px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #f5f6fa;
}

/* .avatar-dropzone-rect:hover {
    border-color: var(--primary-color);
} */

.avatar-dropzone-content-rect {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: var(--text-color);
    font-size: 16px;
}

.avatar-dropzone-title {
    font-size: 16px;
    font-weight: 600;
    margin-bottom: 12px;
}

.avatar-dropzone-or {
    margin-bottom: 10px;
    font-size: 13px;
    font-weight: 400;
}

.avatar-preview-rect {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

.avatar-preview-image-rect {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 8px;
    /* margin-bottom: 12px; */
}


.avatar-dropzone:hover {
    border-color: var(--primary-color);
}

.avatar-dropzone-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: var(--text-color);
}

.avatar-preview {
    position: relative;
    display: inline-block;
}

.avatar-preview-image {
    width: 64px;
    height: 64px;
    border-radius: 50%;
    object-fit: cover;
    border: 2px solid var(--primary-color);
}

.avatar-modal-actions {
    display: flex;
    justify-content: center;
    gap: 16px;
    margin-top: 16px;
}

/* Section Title */
.section-title {
    font-size: var(--font-size-title);
    font-weight: var(--font-weight-medium);
    color: var(--text-color);
    /* padding: 0 56px; */
    margin-bottom: 4px;
}

.form-content {
    width: 100%;
    padding: 8px 56px;
}

/* Form Layout */
.form-row {
    display: flex;
    gap: 80px;
    margin-bottom: 16px;
}

.form-col {
    flex: 1;
    /* margin-right: 80px; */
    overflow: hidden;
}

.form-col.col-6 {
    flex: 0 0 calc(50% - 40px);
}

.form-col.col-12 {
    flex: 0 0 100%;
}

.form-content,
.form-row,
.form-col {
    overflow: visible !important;
}

.custom-toolbar-btn {
    padding: 5px 16px !important;
}

.toolbar-fix-layout {
    padding-top: 5px;
}

.avatar-image {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    object-fit: cover;
    cursor: pointer;
    border: 1px solid var(--border-color);
    image-rendering: auto;
    image-rendering: crisp-edges;
    image-rendering: -webkit-optimize-contrast;
}
</style>