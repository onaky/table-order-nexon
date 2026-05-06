# Component Methods

## Frontend - Custom Hooks

### useAuth
```typescript
useTableAuth(): { login(storeId, tableNo, password): Promise<void>; isAuthenticated: boolean; logout(): void }
useAdminAuth(): { login(storeId, username, password): Promise<void>; isAuthenticated: boolean; admin: Admin | null; logout(): void }
```

### useMenu
```typescript
useMenus(categoryId?: number): { menus: Menu[]; isLoading: boolean; error: Error | null }
useMenuDetail(menuId: number): { menu: MenuDetail | null; isLoading: boolean }
useMenuMutation(): { createMenu(data): Promise<Menu>; updateMenu(id, data): Promise<Menu>; deleteMenu(id): Promise<void>; reorderMenus(ids: number[]): Promise<void> }
```

### useCategory
```typescript
useCategories(): { categories: Category[]; isLoading: boolean }
useCategoryMutation(): { create(data): Promise<Category>; update(id, data): Promise<Category>; delete(id): Promise<void> }
```

### useIngredient
```typescript
useIngredients(): { ingredients: Ingredient[]; isLoading: boolean }
useMenuIngredients(menuId: number): { ingredients: Ingredient[]; isLoading: boolean }
useIngredientMutation(): { create(data): Promise<Ingredient>; update(id, data): Promise<Ingredient>; delete(id): Promise<void>; linkToMenu(ingredientId, menuId): Promise<void>; unlinkFromMenu(ingredientId, menuId): Promise<void> }
```

### useCart
```typescript
useCart(): { items: CartItem[]; addItem(menu: Menu): void; removeItem(menuId: number): void; updateQuantity(menuId: number, qty: number): void; clearCart(): void; totalAmount: number; itemCount: number }
```

### useOrder
```typescript
useCreateOrder(): { createOrder(items: CartItem[]): Promise<Order>; isLoading: boolean }
useOrders(): { orders: Order[]; isLoading: boolean }
useOrderSSE(): { orders: Order[]; connected: boolean }
```

### useSSE
```typescript
useSSE(url: string): { data: any; connected: boolean; error: Error | null }
```

### useUpload
```typescript
useUpload(): { uploadImage(file: File): Promise<string>; isUploading: boolean }
```

---

## Backend - Controller Methods

### AuthController
```typescript
postTableLogin(req, res): Promise<void>      // POST /api/auth/table/login
postAdminLogin(req, res): Promise<void>      // POST /api/auth/admin/login
postVerifyToken(req, res): Promise<void>     // POST /api/auth/verify
```

### MenuController
```typescript
getMenus(req, res): Promise<void>            // GET /api/menus?categoryId=
getMenuById(req, res): Promise<void>         // GET /api/menus/:id
createMenu(req, res): Promise<void>          // POST /api/menus
updateMenu(req, res): Promise<void>          // PUT /api/menus/:id
deleteMenu(req, res): Promise<void>          // DELETE /api/menus/:id
reorderMenus(req, res): Promise<void>        // PUT /api/menus/reorder
```

### CategoryController
```typescript
getCategories(req, res): Promise<void>       // GET /api/categories
createCategory(req, res): Promise<void>      // POST /api/categories
updateCategory(req, res): Promise<void>      // PUT /api/categories/:id
deleteCategory(req, res): Promise<void>      // DELETE /api/categories/:id
```

### IngredientController
```typescript
getIngredients(req, res): Promise<void>      // GET /api/ingredients
getMenuIngredients(req, res): Promise<void>  // GET /api/menus/:menuId/ingredients
createIngredient(req, res): Promise<void>    // POST /api/ingredients
updateIngredient(req, res): Promise<void>    // PUT /api/ingredients/:id
deleteIngredient(req, res): Promise<void>    // DELETE /api/ingredients/:id
linkToMenu(req, res): Promise<void>          // POST /api/menus/:menuId/ingredients/:ingredientId
unlinkFromMenu(req, res): Promise<void>      // DELETE /api/menus/:menuId/ingredients/:ingredientId
```

### OrderController
```typescript
createOrder(req, res): Promise<void>         // POST /api/orders
getOrders(req, res): Promise<void>           // GET /api/orders?tableId=&sessionId=
getOrdersByTable(req, res): Promise<void>    // GET /api/tables/:tableId/orders
updateOrderStatus(req, res): Promise<void>   // PUT /api/orders/:id/status
deleteOrder(req, res): Promise<void>         // DELETE /api/orders/:id
getOrderHistory(req, res): Promise<void>     // GET /api/tables/:tableId/history?date=
```

### TableController
```typescript
getTables(req, res): Promise<void>           // GET /api/tables
setupTable(req, res): Promise<void>          // POST /api/tables/setup
completeTable(req, res): Promise<void>       // POST /api/tables/:id/complete
getTableSession(req, res): Promise<void>     // GET /api/tables/:id/session
```

### UploadController
```typescript
uploadImage(req, res): Promise<void>         // POST /api/uploads/image
deleteImage(req, res): Promise<void>         // DELETE /api/uploads/:filename
```

### SSEController
```typescript
connectStream(req, res): Promise<void>       // GET /api/sse/orders?storeId=
```

---

## Backend - Service Methods

### AuthService
```typescript
authenticateTable(storeId: string, tableNo: number, password: string): Promise<{ token: string; table: Table }>
authenticateAdmin(storeId: string, username: string, password: string): Promise<{ token: string; admin: Admin }>
verifyToken(token: string): Promise<TokenPayload>
hashPassword(password: string): Promise<string>
comparePassword(plain: string, hashed: string): Promise<boolean>
```

### MenuService
```typescript
findAll(storeId: string, categoryId?: number): Promise<Menu[]>
findById(id: number): Promise<Menu>
create(data: CreateMenuDto): Promise<Menu>
update(id: number, data: UpdateMenuDto): Promise<Menu>
delete(id: number): Promise<void>
reorder(menuIds: number[]): Promise<void>
```

### OrderService
```typescript
create(data: CreateOrderDto): Promise<Order>
findByTableSession(tableId: number, sessionId: string): Promise<Order[]>
findByStore(storeId: string): Promise<Order[]>
updateStatus(id: number, status: OrderStatus): Promise<Order>
delete(id: number): Promise<void>
getHistory(tableId: number, date?: string): Promise<OrderHistory[]>
```

### TableService
```typescript
findAll(storeId: string): Promise<Table[]>
setup(data: SetupTableDto): Promise<Table>
completeSession(tableId: number): Promise<void>
getCurrentSession(tableId: number): Promise<TableSession | null>
createSession(tableId: number): Promise<TableSession>
```

### SSEService
```typescript
addClient(storeId: string, res: Response): void
removeClient(storeId: string, res: Response): void
broadcastOrderEvent(storeId: string, event: OrderEvent): void
broadcastStatusChange(storeId: string, orderId: number, status: OrderStatus): void
```

### UploadService
```typescript
saveImage(file: Express.Multer.File): Promise<string>
deleteImage(filename: string): Promise<void>
getImagePath(filename: string): string
```
