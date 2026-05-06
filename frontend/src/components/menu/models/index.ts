import { lazy, ComponentType } from 'react';

// 메뉴 ID → 3D 모델 매핑
const modelMap: Record<number, ComponentType<Record<string, unknown>>> = {};

// Lazy load로 코드 스플리팅
const BurgerModel = lazy(() => import('./BurgerModel'));
const SpicyBurgerModel = lazy(() => import('./SpicyBurgerModel'));
const PastaModel = lazy(() => import('./PastaModel'));
const PokeBowlModel = lazy(() => import('./PokeBowlModel'));
const FriesModel = lazy(() => import('./FriesModel'));
const OnionRingsModel = lazy(() => import('./OnionRingsModel'));
const DrinkModel = lazy(() => import('./DrinkModel'));
const CakeModel = lazy(() => import('./CakeModel'));

// 메뉴 ID 매핑 (mocks/menus.ts 기준)
modelMap[1] = BurgerModel;          // 트러플 시그니처 버거
modelMap[2] = SpicyBurgerModel;     // 스파이시 할라피뇨 버거
modelMap[3] = PastaModel;           // 갈릭 쉬림프 파스타
modelMap[4] = PokeBowlModel;        // 아보카도 포케 보울
modelMap[5] = FriesModel;           // 트러플 감자튀김
modelMap[6] = OnionRingsModel;      // 어니언 링
// 7, 8: 음료 → DrinkModel with variant
// 9, 10: 디저트 → CakeModel with variant

export function getMenuModel(menuId: number): { Component: ComponentType<Record<string, unknown>>; props?: Record<string, unknown> } | null {
  if (modelMap[menuId]) {
    return { Component: modelMap[menuId] };
  }

  // 음료
  if (menuId === 7) return { Component: DrinkModel as ComponentType<Record<string, unknown>>, props: { variant: 'cola' } };
  if (menuId === 8) return { Component: DrinkModel as ComponentType<Record<string, unknown>>, props: { variant: 'lemonade' } };

  // 디저트
  if (menuId === 9) return { Component: CakeModel as ComponentType<Record<string, unknown>>, props: { variant: 'cheesecake' } };
  if (menuId === 10) return { Component: CakeModel as ComponentType<Record<string, unknown>>, props: { variant: 'lava' } };

  return null;
}
