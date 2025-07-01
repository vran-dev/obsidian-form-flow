import { App, Notice } from "obsidian";
import { FormScript } from "./FormScript";
import * as obsidian_module from "obsidian";
import { localInstance } from "src/i18n/locals";
import { fetchJsonStream } from "src/utils/fetchStream";
import { getEditorSelection } from "src/utils/getEditorSelection";
import { SelectionPopup } from "src/component/popup/SelectionPopup";
import { ToastManager } from "src/component/toast/ToastManager";

export class FormScriptRunner {

  static async runFunction(app: App, func: FormScript, contextOptions: Record<string, any> = {}) {
    const context = this.buildContext(app, contextOptions);
    const thisContext = { $context: context };
    return await func.entry.apply(thisContext, []);
  }

  static async run(app: App, expression: string, functions: FormScript[], contextOptions: Record<string, any> = {}) {
    try {
      const context = this.buildContext(app, contextOptions);
      // 修改函数定义，将 context 作为 this.$context 传递
      const functionDefs = functions.map(fn => {
        return `  
                function ${fn.name}(...args) {
                  const func = functions.find(f => f.name === '${fn.name}');
                  const thisContext = { $context: context };
                  return func.entry.apply(thisContext, args);
                }
              `;
      }).join('\n');

      // 构建执行代码
      const code = `
              const $context = arguments[1];
              ${functionDefs}
              return (${expression});
            `;

      // 创建执行函数
      const evalFunction = new Function(
        'functions', 'context',
        code
      );
      return await evalFunction(functions, context);
    } catch (error) {
      console.error(`${localInstance.run_extend_function_error}:  ${expression}`, error);
      new Notice(`${localInstance.run_extend_function_error}: ${expression} \n` + error.message);
      throw new Error(`${localInstance.run_extend_function_error}: ${expression}\n` + error.message);
    }
  }

  private static buildContext(app: App, contextOptions: Record<string, any> = {}) {
    const selection = getEditorSelection(app);
    const context = {
      ...contextOptions,
      $selection: selection,
      get $clipboard() {
        return window.navigator.clipboard.readText();
      },
      app: app,
      moment: obsidian_module.moment,
      request: obsidian_module.request,
      requestUrl: obsidian_module.requestUrl,
      Notice: obsidian_module.Notice,
      obsidian: obsidian_module,
      // extend from components 
      fetchJsonStream: fetchJsonStream,
      SelectionPopup: SelectionPopup,
      ToastManager: ToastManager,
    };
    return context;
  }
}