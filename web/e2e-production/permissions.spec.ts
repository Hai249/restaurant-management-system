import { expect, test } from "@playwright/test";
import { mockIdentity } from "./helpers/identity";

const protectedRoutes = [
    "/tables",
    "/orders",
    "/menu",
    "/inventory",
    "/kitchen",
    "/reports",
    "/staff",
];

for (const path of protectedRoutes) {
    test(`an Admin without permissions cannot open ${path}`, async ({
        page,
    }) => {
        // A role label must not grant operational permissions implicitly.
        await mockIdentity(page, { roles: ["Admin"], permissions: [] });
        await page.goto("/more");
        await expect(
            page.getByRole("heading", { name: "Bạn không có quyền truy cập" }),
        ).toHaveCount(0);
        await expect(page.locator(`a[href="${path}"]`)).toHaveCount(0);
        await page.goto(path);
        await expect(
            page.getByRole("heading", { name: "Bạn không có quyền truy cập" }),
        ).toBeVisible();
        await expect(page.locator(`a[href="${path}"]`)).toHaveCount(0);
    });
}

test("granted menu/report permissions allow routes; revocation hides menu and blocks the open route", async ({
    page,
}) => {
    const state = await mockIdentity(page, {
        permissions: ["catalog.availability.manage", "reporting.read"],
    });
    await page.goto("/more");
    await expect(page.locator('a[href="/reports"]').last()).toBeVisible();
    await expect(page.locator('a[href="/menu"]').first()).toBeVisible();
    await expect(page.locator('a[href="/inventory"]')).toHaveCount(0);
    await page.locator('a[href="/reports"]').last().click();
    await expect(page).toHaveURL(/\/reports$/);
    await expect(
        page.getByRole("heading", { name: "Báo cáo KD (UC28)" }),
    ).toBeVisible();
    await expect(
        page.getByRole("heading", { name: "Bạn không có quyền truy cập" }),
    ).toHaveCount(0);
    await page.locator('a[href="/menu"]').first().click();
    await expect(page).toHaveURL(/\/menu$/);
    await expect(
        page.getByRole("heading", { name: "QL món ăn" }),
    ).toBeVisible();
    await expect(
        page.getByRole("heading", { name: "Bạn không có quyền truy cập" }),
    ).toHaveCount(0);

    state.account.permissions = [];
    await page.evaluate(() => window.dispatchEvent(new Event("focus")));
    await expect(
        page.getByRole("heading", { name: "Bạn không có quyền truy cập" }),
    ).toBeVisible();
    await expect(page.locator('a[href="/menu"]')).toHaveCount(0);
});
