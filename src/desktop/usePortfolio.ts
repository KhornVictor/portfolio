// Shares the JSON portfolio (loaded once by Desktop.vue) with every app.
import { inject, provide, type InjectionKey, type Ref } from "vue";
import type { Portfolio } from "../service/portfolio.service";

const key: InjectionKey<Ref<Portfolio | null>> = Symbol("portfolio");

export function providePortfolio(data: Ref<Portfolio | null>) {
  provide(key, data);
}

export function usePortfolio(): Ref<Portfolio | null> {
  const data = inject(key);
  if (!data) throw new Error("usePortfolio() must be used inside <Desktop>");
  return data;
}
