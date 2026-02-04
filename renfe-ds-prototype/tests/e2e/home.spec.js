import { test, expect } from "@playwright/test";

test("home loads search heading", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Buscar viaje" })).toBeVisible();
});
