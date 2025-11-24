<template>
    <div class="customer-list-page flex flex-col flex-1 overflow-hidden">
        <!-- Toolbar -->
        <div class="toolbar flex flex-row items-center justify-between">
            <div class="toolbar-left flex flex-row items-center gap-8">
                <!-- Selection info when items selected -->
                    <div v-if="allSelectedCustomerIds.length > 0" class="selection-info flex flex-row items-center gap-8">
                        <span class="selection-count">Đã chọn {{ allSelectedCustomerIds.length }}</span>
                        <MsButton variant="text" @click="selectAllCurrentPage" title="Chọn tất cả trang này">
                            <span>Chọn tất</span>
                        </MsButton>
                        <MsButton variant="text" @click="clearAllSelected" title="Bỏ chọn">
                            <span>Bỏ chọn</span>
                        </MsButton>
                        <MsButton variant="outline" @click="openBulkAssignTypeModal">
                            <template #icon-left>
                                <span class="icon icon-edit"></span>
                            </template>
                            Gán loại khách hàng
                        </MsButton>
                        <MsButton variant="outline" @click="handleDeleteSelected">
                            <template #icon-left>
                                <span class="icon icon-delete"></span>
                            </template>
                            Xóa
                        </MsButton>
                        <MsButton variant="outline" @click="handleExportSelected">
                            <template #icon-left>
                                <span class="icon icon-export"></span>
                            </template>
                            Xuất ra Excel
                        </MsButton>
                    </div>
                
                <!-- Default toolbar items (always visible) -->
                <div v-else class="dropdown-wrapper flex flex-row items-center justify-between">
                    <span class="icon icon-folder"></span>
                    <span class="dropdown-title">Tất cả khách hàng</span>
                    <span class="icon icon-dropdown"></span>
                </div>
                
                <div class="toolbar-filter flex flex-row items-center justify-between gap-16">
                    <MsButton variant="text" title="Sửa giao diện">
                        <span>Sửa</span>
                    </MsButton>
                    <MsButton variant="filter" icon-only title="Refresh" class="filter-refresh">
                        <template #icon-left>
                            <span class="icon icon-refresh"></span>
                        </template>
                    </MsButton>
                </div>
            </div>

            <div class="toolbar-right flex flex-row items-center gap-8 justify-between">
                <div class="ai-search-input">
                    <span class="icon icon-search ai-gradient-icon"></span>
                    <input 
                        type="text" 
                        placeholder="Tìm kiếm thông minh" 
                        v-model="searchQuery" 
                        @keyup.enter="handleSearch"
                        class="ai-gradient-text" 
                    />
                    <span 
                        v-if="searchQuery"
                        class="icon icon-clear"
                        style="cursor:pointer;"
                        @click="searchQuery = ''; handleSearch();"
                        title="Xóa tìm kiếm"
                    ></span>
                    <span v-else class="icon-ai"></span>
                </div>

                <MsButton variant="filter" icon-only title="Bộ lọc" class="gradient-btn">
                    <template #icon-left>
                        <span class="icon icon-static ai-gradient-icon"></span>
                    </template>
                </MsButton>

                <MsButton variant="primary"  @click="handleAddCustomer">
                    <template #icon-left>
                        <span class="icon icon-add" style="background-color: white;"></span>
                    </template>
                    <span class="pr-4">Thêm</span>
                </MsButton>
                <MsButton variant="outline" @click="goToImportExcel">
                    <template #icon-left>
                        <span class="icon icon-import"></span>
                    </template>
                    Nhập từ Excel
                </MsButton>

                <MsButton variant="filter" icon-only title="Thêm tùy chọn">
                    <template #icon-left>
                        <span class="icon icon-more"></span>
                    </template>
                </MsButton>
                <MsButton variant="filter" >
                    <template #icon-left>
                        <span class="icon icon-menu-drop"></span>
                    </template>
                    <template #icon-right>
                        <span class="icon icon-dropdown"></span>
                    </template>
                </MsButton>
            </div>
        </div>

        <!-- Table -->
        <MsTable
        class="flex-1"
            :fields="tableFields"
            :rows="customers"
            :enablePagination="true"
            :total="totalCustomers"
            :currentPage="currentPage"
            :pageSize="pageSize"
            :selectable="true"
            v-model="pageSelectedIds"
            row-key="customerId"
            :sort-by="sortBy"
            :sort-direction="sortDirection"
            @edit="handleEdit"
            @delete="handleDelete"
            @page-change="handlePageChange"
            @page-size-change="handlePageSizeChange"
            @sort-change="handleSortChange"
        >
            <!-- Custom cell cho Mã khách hàng -->
            <template #customerCode="{ value, row }">
                <a href="#" class="link" @click.prevent="viewCustomerDetail(row)">
                    {{ value }}
                </a>
            </template>
            
            <!-- Custom cell cho Tên khách hàng -->
            <template #customerFullName="{ value, row }">
                <a href="#" class="link" @click.prevent="viewCustomerDetail(row)">
                    {{ value || '-' }}
                </a>
            </template>

            <!-- Custom cell cho Điện thoại (với icon) -->
            <template #customerPhone="{ value }">
                <span v-if="value" class="phone-number">
                    <span class="icon-phone"></span>
                    {{ value }}
                </span>
                <span v-else>-</span>
            </template>
        </MsTable>
        </div>
        <!-- Modal bulk gán loại khách hàng -->
        <MsModal v-model="showBulkAssignTypeModal">
            <div class="pt-6 flex flex-row items-center">
                <div class="" style="font-size: 13px; font-weight: 600; width: 50%;">Loại khách hàng</div>
                <MsSelect v-model="bulkAssignType" :options="customerTypeOptions"  />
            </div>
            <div class="flex flex-row justify-end gap-8 pt-6">
                <MsButton variant="outline" @click="closeBulkAssignTypeModal">Hủy Bỏ</MsButton>
                <MsButton variant="primary" :disabled="!bulkAssignType" @click="handleBulkAssignType">Gán loại</MsButton>
            </div>
        </MsModal>
        <!-- Modal xác nhận xóa (dùng chung cho xóa 1 và xóa nhiều) -->
        <MsModal v-model="showDeleteModal">
            <div class="pt-6" style="line-height: 1.5;">
                <div v-if="deleteMode === 'single'">
                  Bạn có chắc chắn muốn xóa khách hàng <span class="font-bold">{{ rowToDelete?.customerFullName }}</span> không?
                </div>
                <div v-else>
                  Bạn có chắc chắn muốn xóa <span class="font-bold">{{ bulkDeleteCount }}</span> khách hàng đã chọn không?
                </div>
            </div>
            <div class="flex flex-row justify-end gap-8 pt-6">
                <MsButton variant="outline" @click="cancelDelete">Hủy Bỏ</MsButton>
                <MsButton variant="danger" @click="confirmDelete">Đồng Ý</MsButton>
            </div>
        </MsModal>
</template>


<script setup>
import { ref, computed, onMounted, nextTick, onBeforeMount } from 'vue';
import { useRouter } from 'vue-router';
import MsButton from '@/components/ms-button/MsButton.vue';
import MsTable from '@/components/ms-table/MsTable.vue';
import MsModal from '@/components/ms-modal/MsModal.vue';
import MsSelect from '@/components/ms-form-field/MsSelect.vue';
import { CustomerAPI } from '@/apis';
import { useToastNotification } from '@/composables/useToast.js';

const searchQuery = ref('');
const currentPage = ref(1);
const pageSize = ref(10);
// Danh sách ID đã chọn qua nhiều trang
const allSelectedCustomerIds = ref([]);
// Danh sách ID của trang hiện tại (để truyền vào MsTable)
const pageSelectedIds = computed({
    get() {
        // Lấy các ID trên trang hiện tại có trong allSelectedCustomerIds
        return customers.value
            .map(c => c.customerId)
            .filter(id => allSelectedCustomerIds.value.includes(id));
    },
    set(newVal) {
        const pageIds = customers.value.map(c => c.customerId);
        // Loại bỏ các ID của trang hiện tại khỏi allSelectedCustomerIds
        allSelectedCustomerIds.value = allSelectedCustomerIds.value.filter(id => !pageIds.includes(id));
        // Thêm lại các ID vừa chọn
        allSelectedCustomerIds.value = [...allSelectedCustomerIds.value, ...newVal];
    }
});
const customers = ref([]);
const totalCustomers = ref(0);
const error = ref(null);
const sortBy = ref('');
const sortDirection = ref('');


const router = useRouter();
const customerAPI = new CustomerAPI();
const { showSuccess, showError } = useToastNotification();

// State cho modal xác nhận xóa (dùng chung cho xóa 1 và xóa nhiều)
const showDeleteModal = ref(false);
const deleteMode = ref('single'); // 'single' | 'bulk'
const rowToDelete = ref(null);
const bulkDeleteCount = ref(0);


const tableFields = [
    { 
        key: 'customerType', 
        label: 'Loại khách hàng',
        type: 'text',
        width: 150
    },
    { 
        key: 'customerCode', 
        label: 'Mã khách hàng',
        type: 'custom',
        width: 200
    },
    { 
        key: 'customerFullName', 
        label: 'Tên khách hàng',
        type: 'custom',
        width: 200
    },
    { 
        key: 'customerTaxCode', 
        label: 'Mã số thuế',
        type: 'text',
        width: 150
    },
    { 
        key: 'customerShippingAddr', 
        label: 'Địa chỉ (Giao hàng)',
        type: 'text',
        width: 150
    },
    { 
        key: 'customerPhone', 
        label: 'Điện thoại',
        type: 'custom',
        width: 150
    },
    { 
        key: 'customerLastPurchaseDate', 
        label: 'Ngày mua hàng gần nhất',
        type: 'date',
        width: 200
    },
    { 
        key: 'customerPurchasedItems', 
        label: 'Hàng hóa đã mua',
        type: 'text',
        width: 150
    },
    { 
        key: 'customerLastestPurchasedItems', 
        label: 'Tên hàng hóa đã mua',
        type: 'text',
        width: 150
    },
    // { 
    //     key: 'customerEmail
    //     label: 'Email',
    //     type: 'text',
    //     width: 150
    // },
];

/**
 * Lấy danh sách khách hàng có phân trang
 * Author: NTT
 * Date: 18/11/2025
 */
const fetchCustomers = async () => {
    try {
        error.value = null;

        const params = {
            page: currentPage.value,           
            pageSize: pageSize.value,
            search: searchQuery.value || undefined,  
            sortBy: sortBy.value || undefined,
            sortDirection: sortDirection.value || undefined
        };

        const response = await customerAPI.getPaging(params);
        if (!response.error) {
            customers.value = response.data || [];
            totalCustomers.value = response.meta?.total || 0;
            console.log('Updated customers.value:', customers.value.length, 'items');
        } else {
            showError(response.error.message || 'Có lỗi xảy ra khi lấy dữ liệu');
            error.value = response.error.message || 'Có lỗi xảy ra khi lấy dữ liệu';
        }
    } catch (err) {
        showError(err.message || 'Không thể kết nối đến server');
        error.value = err.message || 'Không thể kết nối đến server';
        console.error('Error fetching customers:', err);
    }
};

/**
 * Xử lý sửa khách hàng
 * @param {Object} row - Thông tin khách hàng cần sửa
 * @returns {void}
 * Author: NTT
 * Date: 18/11/2025
 */
const handleEdit = (row) => {
    router.push({ name: 'CustomerEdit', params: { id: row.customerId } });
};

/**
 * Xử lý xóa khách hàng
 * @param {Object} row - Thông tin khách hàng cần xóa
 * Author: NTT (18/11/2025)
 */
const handleDelete = (row) => {
    deleteMode.value = 'single';
    rowToDelete.value = row;
    showDeleteModal.value = true;
};

/**
 * Xử lý xóa nhiều khách hàng đã chọn
 * Author: NTT (18/11/2025)
 */
const handleDeleteSelected = () => {
    if (allSelectedCustomerIds.value.length === 0) return;
    deleteMode.value = 'bulk';
    bulkDeleteCount.value = allSelectedCustomerIds.value.length;
    showDeleteModal.value = true;
};


/**
 * Xác nhận xóa khách hàng (1 hoặc nhiều)
 * Author: NTT (18/11/2025)
 */
const confirmDelete = async () => {
    try {
        if (deleteMode.value === 'single' && rowToDelete.value) {
            await customerAPI.delete(rowToDelete.value.customerId);
            showSuccess('Xóa khách hàng thành công!');
        } else if (deleteMode.value === 'bulk' && bulkDeleteCount.value > 0) {
            await customerAPI.bulkDelete(allSelectedCustomerIds.value);
            showSuccess('Xóa khách hàng thành công!');
            allSelectedCustomerIds.value = [];
        }
        await fetchCustomers();
    } catch (err) {
        showError('Xóa khách hàng thất bại!');
    } finally {
        showDeleteModal.value = false;
        rowToDelete.value = null;
        bulkDeleteCount.value = 0;
    }
};


/**
 * Đóng modal xác nhận xóa, reset state xóa
 * Author: NTT (18/11/2025)
 */
const cancelDelete = () => {
    showDeleteModal.value = false;
    rowToDelete.value = null;
    bulkDeleteCount.value = 0;
};

/**
 * Xử lý khi chuyển trang
 * @param {number} page -  trang  chuyển tới
 * Author: NTT (18/11/2025)
 */
const handlePageChange = (page) => {
    console.log('handlePageChange called with page:', page);
    currentPage.value = page;
    console.log('currentPage updated to:', currentPage.value);
    fetchCustomers();
};

/**
 * Xử lý khi thay đổi số lượng bản ghi trên trang
 * @param {number} newPageSize - Số lượng bản ghi mới
 * Author: NTT (18/11/2025)
 */
const handlePageSizeChange = (newPageSize) => {
    pageSize.value = newPageSize;
    currentPage.value = 1;
    fetchCustomers();
};

/**
 * Xử lý thay đổi sort
 * @param {Object} param - Object chứa sortBy và sortDirection
 * @param {string} sortBy - Tên trường cần sort
 * @param {string} sortDirection - Hướng sắp xếp ('asc' hoặc 'desc')
 * Author: NTT (19/11/2025)
 */
const handleSortChange = ({ sortBy: newSortBy, sortDirection: newSortDirection }) => {
    console.log('Sort changed:', newSortBy, newSortDirection);
    
    sortBy.value = newSortBy;
    sortDirection.value = newSortDirection;
    
    // Reset về trang 1 khi sort
    currentPage.value = 1;
    
    // Fetch data với sort mới
    fetchCustomers();
};

/**
 * Xem chi tiết khách hàng
 * @param {Object} customer - Thông tin khách hàng
 * Author: NTT (18/11/2025)
 */
const viewCustomerDetail = (customer) => {
    router.push({ name: 'CustomerEdit', params: { id: customer.customerId } });
    // TODO: Navigate to customer detail page
};


/**
 * Chọn tất cả khách hàng trên trang hiện tại
 * Author: NTT (18/11/2025)
 */
const selectAllCurrentPage = () => {
    const pageIds = customers.value.map(c => c.customerId);
    // Thêm các ID chưa có vào allSelectedCustomerIds
    allSelectedCustomerIds.value = Array.from(new Set([...allSelectedCustomerIds.value, ...pageIds]));
};


/**
 * Bỏ chọn tất cả khách hàng đã chọn
 * Author: NTT (18/11/2025)
 */
const clearAllSelected = () => {
    allSelectedCustomerIds.value = [];
};



// Modal gán loại khách hàng
const showBulkAssignTypeModal = ref(false);
const bulkAssignType = ref(null);
const customerTypeOptions = [
        { value: 'NBH01', label: 'NBH01' },
        { value: 'LKHA', label: 'LKHA' },
        { value: 'VIP', label: 'VIP' }
];
/**
 * Mở modal gán loại khách hàng hàng loạt
 * Author: NTT (18/11/2025)
 */
const openBulkAssignTypeModal = () => {
    bulkAssignType.value = null;
    showBulkAssignTypeModal.value = true;
};
/**
 * Đóng modal gán loại khách hàng hàng loạt
 * Author: NTT (18/11/2025)
 */
const closeBulkAssignTypeModal = () => {
    showBulkAssignTypeModal.value = false;
};
/**
 * Xử lý gán loại khách hàng hàng loạt
 * Author: NTT (18/11/2025)
 */
const handleBulkAssignType = async () => {
    if (!bulkAssignType.value || allSelectedCustomerIds.value.length === 0) return;
    try {
        await customerAPI.bulkAssignType({
            customerIds: allSelectedCustomerIds.value,
            customerType: bulkAssignType.value
        });
        showSuccess('Gán loại khách hàng thành công!');
        closeBulkAssignTypeModal();
        fetchCustomers();
    } catch (err) {
        showError('Gán loại khách hàng thất bại!');
    }
};



/**
 * Xuất danh sách khách hàng đã chọn ra file CSV
 * Author: NTT (18/11/2025)
 */
const handleExportSelected = async () => {
    if (allSelectedCustomerIds.value.length === 0) return;
    try {
        const res = await customerAPI.exportCSV(allSelectedCustomerIds.value);
        // Tạo file và tải về
        const blob = new Blob([res], { type: 'text/csv;charset=utf-8;' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `MISA_CRM_Customers_${new Date().toISOString().replace(/[-:T.]/g, '').slice(0, 14)}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
    } catch (err) {
        showError('Export CSV thất bại!');
    }
};

/**
 * Xử lý tìm kiếm khi nhấn Enter
 * Author: NTT (18/11/2025)
 */
const handleSearch = () => {
    currentPage.value = 1; // Reset về trang 1 khi search
    fetchCustomers();
};
/**
 * Chuyeển hướng đến trang thêm khách hàng
 * Author: NTT (18/11/2025)
 */
const handleAddCustomer = () => {
    router.push({ name: 'CustomerCreate' });
};
/**
 * Chuyeển hướng đến trang nhập khách hàng
 * Author: NTT (20/11/2025)
 */
const goToImportExcel = () => {
    router.push({ name: 'CustomerImport' });
};


/**
 * fetch dữ liệu khi component được mount
 * Author: NTT (18/11/2025)
 */
onMounted(() => {
    fetchCustomers();
});
</script>

<style scoped>

.customer-list-page {
    display: flex;
    flex-direction: column;
    height: 100%;
    background: var(--white-color);
}

/* Toolbar */
.toolbar {
    min-height: var(--toolbar-height);
    max-height: var(--toolbar-height);
    padding: 12px 20px;
    background: #e2e4e9;
    border-bottom: 1px solid var(--border-secondary);
    gap: 16px;
}

/* Selection info styles */
.selection-info {
    padding: 8px 0;
}

.selection-count {
    font-size: var(--font-size-primary);
    font-weight: var(--font-weight-bold);
    color: var(--primary-color);
}

.toolbar-left {
    display: flex;
    align-items: center;
    gap: 8px;
}

.dropdown-wrapper {
    height: 32px;
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 6px 12px;
    border: 1px solid var(--border-secondary);
    border-radius: 4px;
    background: var(--white-color);
    cursor: pointer;
    transition: all 0.2s;
}



.dropdown-title {
    font-size: var(--font-size-primary);
    font-weight: var(--font-weight-bold);
    color: var(--text-color);
}

.toolbar-right {
    display: flex;
    align-items: center;
    gap: 8px;
}
.filter-refresh{
    height: fit-content;
    width: fit-content !important;
    background: transparent;
    border: none;
}

/* AI Search Box */
.ai-search-input {
    width: 284px;
    height: 32px;
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 6px 12px;
    border-radius: 3px;
    background: linear-gradient(90deg, rgba(66, 98, 240, .1) 0%, rgba(159, 115, 241, .1) 100%), #FFF;
    position: relative;
}

/* Gradient border chung cho search box & button */
.ai-search-input::before,
.gradient-btn::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: inherit;
    padding: 1px;
    background: linear-gradient(251deg, #4262F0 24.05%, #9F73F1 71.93%);
    -webkit-mask: 
        linear-gradient(#fff 0 0) content-box,
        linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask: 
        linear-gradient(#fff 0 0) content-box,
        linear-gradient(#fff 0 0);
    mask-composite: exclude;
    pointer-events: none;
}


.ai-search-input:focus-within {
    background: var(--white-color);
}

.ai-search-input:focus-within::before {
    background: linear-gradient(90deg, rgb(66, 98, 240) 0%, rgb(159, 115, 241) 100%);
}

/* Gradient icon & placeholder text chung */
.ai-gradient-icon,
.ai-search-input input::placeholder {
    background: linear-gradient(90deg, rgb(66, 98, 240) 0%, rgb(159, 115, 241) 100%);
}

.ai-gradient-icon {
    flex-shrink: 0;
}

.ai-search-input input::placeholder {
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
}

/* Gradient Button */
.gradient-btn {
    position: relative;
    background: linear-gradient(90deg, #E7EBFD 0%, #ECE7FD 32.21%, #E5F7FF 66.11%, #FDEFE7 100%);
    border-radius: 3px;
}

.ai-search-input input {
    flex: 1;
    border: none;
    outline: none;
    font-size: var(--font-size-primary);
    color: var(--text-color);
    background: transparent;
}

.icon-ai {
    display: inline-block;
    background: url('../../assets/images/ai-icon.svg') no-repeat center ;
    width: 16px;
    height: 16px;
}

/* Custom Table Styles */
.link {
    color: var(--primary-color);
    text-decoration: none;
    font-weight: 500;
}

.link:hover {
    text-decoration: underline;
}

.phone-number {
    display: flex;
    align-items: center;
    gap: 4px;
    color: var(--primary-color);
}

.empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
    padding: 40px 20px;
    color: var(--icon-color);
}

</style>