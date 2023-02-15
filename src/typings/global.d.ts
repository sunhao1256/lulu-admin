interface Window {
  $snackBar?: import('@/components/provider').SnackBarApiInjection,
  $loadingOverly?: import('@/components/provider').LoadingOverlyApiInjection,
  $dialog?: import("@/components/provider").DialogApiInjection
}

/** 通用类型 */
declare namespace Common {
  /**
   * 策略模式
   * [状态, 为true时执行的回调函数]
   */
  type StrategyAction = [boolean, () => void];
}

/** 构建时间 */
declare const PROJECT_BUILD_TIME: string;
