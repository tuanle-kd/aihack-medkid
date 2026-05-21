import { expect, test } from '@playwright/test';

test.describe('MediKid-AI MVP01: Onboarding & Legal Consent Flow', () => {

  test.beforeEach(async ({ page }) => {
    // Truy cập trang chính của ứng dụng
    await page.goto('/');
  });

  test('1. Consent Modal blocks the UI on initial load', async ({ page }) => {
    // Đảm bảo Consent Modal hiển thị và che phủ toàn bộ màn hình
    const consentHeader = page.locator('h2', { hasText: 'MediKid-AI' });
    await expect(consentHeader).toBeVisible();
    await expect(page.getByText('Đồng thuận xử lý dữ liệu cá nhân')).toBeVisible();

    // Nút "Bắt đầu tư vấn" phải ở trạng thái disabled khi chưa tích chọn checkbox
    const submitBtn = page.getByRole('button', { name: 'Bắt đầu tư vấn' });
    await expect(submitBtn).toBeDisabled();
  });

  test('2. Accordion "Xem chi tiết điều khoản" expands/collapses properly', async ({ page }) => {
    // Accordion ban đầu không hiển thị text chi tiết
    await expect(page.getByText('Mục đích xử lý')).not.toBeVisible();

    // Click vào để mở accordion
    await page.getByText('Xem chi tiết điều khoản').click();

    // Kiểm tra xem các đề mục chi tiết về Nghị định 13 có xuất hiện hay chưa
    await expect(page.getByText('Mục đích xử lý')).toBeVisible();
    await expect(page.getByText('Loại dữ liệu')).toBeVisible();
    await expect(page.getByText('Thời gian lưu trữ')).toBeVisible();
    
    // Click lần nữa để thu gọn
    await page.getByText('Xem chi tiết điều khoản').click();
    await expect(page.getByText('Mục đích xử lý')).not.toBeVisible();
  });

  test('3. Accepting consent grants access and initializes Session', async ({ page }) => {
    const submitBtn = page.getByRole('button', { name: 'Bắt đầu tư vấn' });
    
    // Tích chọn checkbox đồng thuận
    const consentCheckbox = page.locator('input[type="checkbox"]');
    await consentCheckbox.check();

    // Nút CTA "Bắt đầu tư vấn" phải được kích hoạt (enabled)
    await expect(submitBtn).toBeEnabled();

    // Click bắt đầu
    await submitBtn.click();

    // Modal đồng thuận phải biến mất khỏi DOM hoặc ẩn đi
    await expect(page.getByText('Đồng thuận xử lý dữ liệu cá nhân')).not.toBeVisible();

    // Kiểm tra giao diện chính đã sẵn sàng cho Phụ huynh và Bác sĩ
    await expect(page.getByText('📱 Phụ huynh (Mobile View)')).toBeVisible();
    await expect(page.getByText('🖥️ Bác sĩ (Desktop View)')).toBeVisible();

    // Mở Debug Console (Ctrl+Shift+D hoặc click nút Debug) để verify Session ID được khởi tạo
    await page.getByRole('button', { name: '⚡ Debug' }).click();
    await expect(page.locator('span', { hasText: '⚡ Debug Console' })).toBeVisible();
    await expect(page.locator('span', { hasText: 'SESSION ID:' })).toBeVisible();
  });

  test('4. Session persists and does not prompt consent modal again on page reload', async ({ page }) => {
    // Chấp nhận điều khoản ở lần đầu tiên
    await page.locator('input[type="checkbox"]').check();
    await page.getByRole('button', { name: 'Bắt đầu tư vấn' }).click();

    // Đợi Modal biến mất
    await expect(page.getByText('Đồng thuận xử lý dữ liệu cá nhân')).not.toBeVisible();

    // Reload trang
    await page.reload();

    // Đảm bảo không hiển thị lại pop-up đồng thuận (vì đã lưu trạng thái vào sessionStorage)
    await expect(page.getByText('Đồng thuận xử lý dữ liệu cá nhân')).not.toBeVisible();
    await expect(page.getByText('📱 Phụ huynh (Mobile View)')).toBeVisible();
  });
});
