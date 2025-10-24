import { IFormAction } from "src/model/action/IFormAction";
import { FormActionType } from "src/model/enums/FormActionType";
import CpsForm from "src/view/shared/CpsForm";
import { CreateFileSetting } from "./create-file/CreateFileSetting";
import { GenerateFormSetting } from "./generate-form/OpenFormSetting";
import { InsertTextSetting } from "./insert-text/InsertTextSetting";
import { RunScriptSetting } from "./run-script/RunScriptSetting";
import { SuggestModalSetting } from "./suggest-modal/SuggestModalSetting";
import { UpdateFrontmatterSetting } from "./update-frontmatter/UpdateFrontmatterSetting";
import { WaitSetting } from "./wait/WaitSetting";
import { RemarkSetting } from "./common/RemarkSetting";
import { RunCommandSetting } from "./run-command/RunCommandSetting";

export default function (props: {
	value: IFormAction;
	onChange: (value: IFormAction) => void;
}) {
	const { value, onChange } = props;

	return (
		<CpsForm layout="horizontal">
			<RemarkSetting value={value} onChange={onChange} />
			<CreateFileSetting value={value} onChange={onChange} />
			<InsertTextSetting value={value} onChange={onChange} />
			<UpdateFrontmatterSetting value={value} onChange={onChange} />
			<RunScriptSetting value={value} onChange={onChange} />
			<SuggestModalSetting value={value} onChange={onChange} />
			<RunCommandSetting value={value} onChange={onChange} />
			<GenerateFormSetting value={value} onChange={onChange} />
			<WaitSetting value={value} onChange={onChange} />
		</CpsForm>
	);
}
