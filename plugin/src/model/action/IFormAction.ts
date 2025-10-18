import { FormActionType } from "../enums/FormActionType";
import { Filter } from "../filter/Filter";

export interface IFormAction {
  id: string;
  type: FormActionType;
  condition?: Filter | null;
  remark?: string;
}


export const DEFAULT_CODE_FOR_ACTION = `/**
* app: obsidian App instance
* form: use form.fieldName to get field value
* Notice: toast message, "new Notice('Hello world')"
*/
async function entry() {
  const { app, form, requestUrl, obsidian, Notice, $selection } = this.$context;
  // write code here...

}

/**
 * Must reserve export.default and set a entry function
 */
exports.default = {
  entry: entry
}
`;