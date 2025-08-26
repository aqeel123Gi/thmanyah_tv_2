# مجلد Constants - إعدادات التطبيق

هذا المجلد يحتوي على الإعدادات والثوابت المستخدمة في التطبيق.

## الملفات المتاحة

### AppConfig.ts
ملف إدارة إعدادات التطبيق الأساسية.

#### الاستخدام:
```typescript
import AppConfig from '@/constants/AppConfig';

// تهيئة جميع الإعدادات
AppConfig.initialize();

// التحقق من حالة RTL
const isRTL = AppConfig.isRTL();

// السماح بتغيير اتجاه النص
AppConfig.canChangeRTL();
```

#### المميزات:
- ✅ إدارة إعدادات RTL
- ✅ تهيئة مركزية للإعدادات
- ✅ سهولة التوسع لإعدادات جديدة
- ✅ توثيق واضح باللغة العربية

### Colors.ts
إعدادات الألوان للتطبيق (الوضع الفاتح والداكن).

### TextStyles.ts
أنماط النصوص المستخدمة في التطبيق.

### videoState.ts
حالات الفيديو المختلفة.

## إضافة إعدادات جديدة

لإضافة إعداد جديد، يمكنك:

1. إضافة دالة جديدة في `AppConfig.ts`
2. استدعاء الدالة في `AppConfig.initialize()`
3. تصدير الدالة للاستخدام في أجزاء أخرى من التطبيق

مثال:
```typescript
// في AppConfig.ts
static setupFonts() {
  // إعداد الخطوط
}

static initialize() {
  this.setupRTL();
  this.setupFonts(); // إضافة جديدة
}
```
