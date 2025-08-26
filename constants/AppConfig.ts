import { I18nManager } from 'react-native';

/**
 * إعدادات التطبيق الأساسية
 */
export class AppConfig {
  /**
   * تهيئة إعدادات التطبيق الأساسية
   * يجب استدعاء هذه الدالة في بداية التطبيق
   */
  static initialize() {
    // تفعيل RTL للتطبيق
    this.setupRTL();
    
    // يمكن إضافة إعدادات أخرى هنا في المستقبل
    // مثل: إعدادات الخطوط، الألوان، إلخ
  }

  /**
   * إعداد اتجاه النص من اليمين إلى اليسار
   */
  private static setupRTL() {
    // تفعيل RTL للتطبيق
    I18nManager.forceRTL(true);
    
    // ملاحظة: يجب إعادة تشغيل التطبيق بعد تغيير إعدادات RTL
    console.log('RTL has been enabled for the application');
  }

  /**
   * الحصول على حالة RTL الحالية
   */
  static isRTL(): boolean {
    return I18nManager.isRTL;
  }

  /**
   * التحقق من إمكانية تغيير اتجاه النص
   */
  static canChangeRTL(): void {
    I18nManager.allowRTL(true);
  }
}

// تصدير مثيل من الإعدادات للاستخدام المباشر
export default AppConfig;
